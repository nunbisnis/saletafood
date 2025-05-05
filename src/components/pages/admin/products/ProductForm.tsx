"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/actions/product-actions";
import { editProduct } from "@/actions/edit-product-action";
import { getCategories } from "@/actions/category-actions";
import { productFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Edit,
} from "lucide-react";
import { uploadFile, validateImageFile } from "@/lib/upload-utils";
import { formatIDR, parseIDR } from "@/lib/currency-utils";
import { RichTextEditorWithPreview } from "@/components/ui/rich-text-editor-with-preview";
import { HtmlContent } from "@/components/ui/html-content";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  images: string[];
  status: "AVAILABLE" | "OUT_OF_STOCK" | "LOW_STOCK";
  categoryId: string;
  furtherDetails: string[];
  tags: string[];
  slug?: string;
  currentDetail?: string; // Added for the rich text editor with live preview
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductFormProps = {
  productData?: any;
  isEditing?: boolean;
};

export function ProductForm({
  productData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize form data with product data if editing
  const [formData, setFormData] = useState<Partial<ProductFormData>>(() => {
    if (isEditing && productData) {
      return {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: formatIDR(parseFloat(productData.price.toString())),
        images: productData.images || [],
        status: productData.status,
        categoryId: productData.categoryId,
        furtherDetails: productData.furtherDetails || [],
        tags: productData.tags || [],
        slug: productData.slug,
      };
    }

    return {
      name: "",
      description: "",
      price: "",
      images: [],
      status: "AVAILABLE",
      categoryId: "",
      furtherDetails: [],
      tags: [],
      currentDetail: "", // Initialize the current detail
    };
  });

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategories();
      if ("categories" in result && result.categories) {
        setCategories(
          result.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          }))
        );
      }
    }
    fetchCategories();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // If name field is updated, generate a slug
    if (name === "name") {
      setFormData({
        ...formData,
        [name]: value,
        slug: generateSlug(value),
      });
    }
    // If price field is updated, format as IDR
    else if (name === "price") {
      // Only allow numbers and dots
      const numericValue = value.replace(/[^\d.]/g, "");

      // Parse the numeric value and format it
      if (numericValue) {
        try {
          // Remove all dots first
          const cleanValue = numericValue.replace(/\./g, "");
          // Parse as number
          const numberValue = parseFloat(cleanValue);

          if (!isNaN(numberValue)) {
            // Format with thousand separators
            setFormData({
              ...formData,
              [name]: formatIDR(numberValue),
            });
          } else {
            setFormData({
              ...formData,
              [name]: numericValue,
            });
          }
        } catch (error) {
          // If parsing fails, just use the numeric value
          setFormData({
            ...formData,
            [name]: numericValue,
          });
        }
      } else {
        // If empty, set empty string
        setFormData({
          ...formData,
          [name]: "",
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  // Handle adding a new image URL
  const handleAddImageUrl = () => {
    const newImageUrl = (
      document.getElementById("newImageUrl") as HTMLInputElement
    ).value;

    if (!newImageUrl) return;

    if (!newImageUrl.match(/^https?:\/\/.+/)) {
      setValidationErrors({
        ...validationErrors,
        images:
          "URL gambar harus valid dan dimulai dengan http:// atau https://",
      });
      return;
    }

    setFormData({
      ...formData,
      images: [...(formData.images || []), newImageUrl],
    });

    // Clear the input field
    (document.getElementById("newImageUrl") as HTMLInputElement).value = "";

    // Clear any validation errors
    if (validationErrors.images) {
      setValidationErrors({
        ...validationErrors,
        images: "",
      });
    }
  };

  // Process files for upload
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate the file
        const validationError = validateImageFile(file);
        if (validationError) {
          setValidationErrors({
            ...validationErrors,
            images: validationError,
          });
          setIsUploading(false);
          return;
        }

        // Update progress
        setUploadProgress(Math.round((i / files.length) * 50));

        // Upload the file
        const imageUrl = await uploadFile(file);

        // Add the URL to the form data
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));

        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Clear any validation errors
      if (validationErrors.images) {
        setValidationErrors({
          ...validationErrors,
          images: "",
        });
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setValidationErrors({
        ...validationErrors,
        images: "Gagal mengunggah gambar. Silakan coba lagi.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle removing an image URL
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.splice(index, 1);

    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(null);
    setFormError(null);
    setValidationErrors({});

    try {
      // Check if there's any unsaved content in the rich text editor (currentDetail)
      if (formData.currentDetail && formData.currentDetail.trim()) {
        // Add the current content from the rich text editor to furtherDetails
        const updatedFurtherDetails = [
          ...(formData.furtherDetails || []),
          formData.currentDetail.trim(),
        ];

        // Update formData with the new furtherDetails and clear currentDetail
        setFormData((prev) => ({
          ...prev,
          furtherDetails: updatedFurtherDetails,
          currentDetail: "",
        }));

        // Use the updated furtherDetails directly in the submission
        formData.furtherDetails = updatedFurtherDetails;
      }

      // Parse the formatted price
      const parsedPrice = parseIDR(formData.price || "0");
      console.log("Parsed price:", parsedPrice);

      // Prepare the data for client-side validation
      const validationData = {
        ...(formData as ProductFormData),
        price: formData.price || "0", // Keep as string for client validation
        slug: formData.slug || generateSlug(formData.name || ""),
        furtherDetails: formData.furtherDetails || [],
        tags: formData.tags || [],
      };
      console.log("Validation data:", validationData);

      // Prepare the data for submission (with parsed price as number)
      const productFormData = {
        ...validationData,
        price: parsedPrice, // Use parsed price for submission
      };
      console.log("Product form data for submission:", productFormData);

      // Validate the form data using the client-side schema
      const validationResult = productFormSchema.safeParse(validationData);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        setValidationErrors(
          Object.entries(errors).reduce((acc, [key, value]) => {
            acc[key] = value[0];
            return acc;
          }, {} as Record<string, string>)
        );
        setFormError("Mohon perbaiki kesalahan pada form");
        setIsSubmitting(false);
        return;
      }

      let result;

      // Submit the form data based on whether we're editing or creating
      if (isEditing && productData) {
        result = await editProduct(productData.id, productFormData);
        if (result.success) {
          setFormSuccess("Produk berhasil diperbarui!");

          // Redirect to dashboard after 2 seconds
          // Keep isSubmitting true until redirect happens
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 2000);
        } else {
          // Handle server-side validation errors if they exist
          if (result.fieldErrors) {
            console.log("Server returned field errors:", result.fieldErrors);

            // Convert field errors to the format expected by the form
            const serverErrors: Record<string, string> = {};

            // Loop through each field error
            Object.entries(result.fieldErrors).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                serverErrors[key] = value[0];
              } else if (typeof value === "string") {
                serverErrors[key] = value;
              } else {
                serverErrors[key] = "Field validation failed";
              }
            });

            setValidationErrors(serverErrors);
            setFormError("Mohon perbaiki kesalahan pada form");
          } else {
            setFormError(result.error || "Gagal memperbarui produk");
          }
          setIsSubmitting(false); // Only set to false on error
        }
      } else {
        result = await createProduct(productFormData);
        if (result.success) {
          setFormSuccess("Produk berhasil ditambahkan!");
          // Reset form after successful submission
          setFormData({
            name: "",
            description: "",
            price: "",
            images: [],
            status: "AVAILABLE",
            categoryId: "",
            furtherDetails: [],
            tags: [],
            currentDetail: "", // Reset the current detail
          });

          // Redirect to dashboard after 2 seconds
          // Keep isSubmitting true until redirect happens
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 2000);
        } else {
          // Handle server-side validation errors if they exist
          if (result.fieldErrors) {
            console.log("Server returned field errors:", result.fieldErrors);

            // Convert field errors to the format expected by the form
            const serverErrors: Record<string, string> = {};

            // Loop through each field error
            Object.entries(result.fieldErrors).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                serverErrors[key] = value[0];
              } else if (typeof value === "string") {
                serverErrors[key] = value;
              } else {
                serverErrors[key] = "Field validation failed";
              }
            });

            setValidationErrors(serverErrors);
            setFormError("Mohon perbaiki kesalahan pada form");
          } else {
            setFormError(result.error || "Gagal menambahkan produk");
          }
          setIsSubmitting(false); // Only set to false on error
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        `Terjadi kesalahan saat ${
          isEditing ? "memperbarui" : "menambahkan"
        } produk`
      );
      setIsSubmitting(false); // Only set to false on error
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
          <CardDescription>
            {isEditing
              ? "Edit informasi produk yang sudah ada."
              : "Masukkan detail produk baru yang ingin Anda tambahkan ke menu Anda."}
          </CardDescription>
        </CardHeader>

        {formSuccess && (
          <div className="px-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Berhasil!</AlertTitle>
              <AlertDescription className="text-green-700">
                {formSuccess}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {formError && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                name="name"
                placeholder="contoh: Burger Ayam Pedas"
                value={formData.name || ""}
                onChange={handleChange}
                className={validationErrors.name ? "border-red-500" : ""}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">Rp</span>
                </div>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="Contoh: 100.000"
                  value={formData.price || ""}
                  onChange={handleChange}
                  className={`pl-10 ${
                    validationErrors.price ? "border-red-500" : ""
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Format: Rp 200.000 (tanpa desimal) */}
              </p>
              {validationErrors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.price}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategori</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                validationErrors.categoryId ? "border-red-500" : ""
              }`}
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {validationErrors.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.categoryId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="description">Deskripsi</Label>
              <span className="text-xs text-muted-foreground">
                {formData.description?.length || 0}/300 karakter
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                validationErrors.description ? "border-red-500" : ""
              }`}
              placeholder="Deskripsikan produk Anda..."
              value={formData.description || ""}
              onChange={handleChange}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground">
              Maksimal 300 karakter untuk deskripsi produk
            </p>
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Unggah Gambar Produk</Label>
                <div
                  ref={dropZoneRef}
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <ImageIcon
                        className={`h-12 w-12 ${
                          isDragging ? "text-primary" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex flex-wrap justify-center text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                      >
                        <span>Unggah gambar</span>
                      </label>
                      <p className="pl-1">
                        atau seret dan lepas gambar di sini
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF hingga 5MB (bisa pilih beberapa gambar)
                    </p>
                  </div>

                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Mengunggah... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">
                  ATAU
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div>
                <Label htmlFor="newImageUrl">URL Gambar Produk</Label>
                <div className="flex mt-1">
                  <Input
                    id="newImageUrl"
                    name="newImageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className={`flex-1 ${
                      validationErrors.images ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="ml-2"
                  >
                    Tambah
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Masukkan URL gambar produk jika sudah memiliki URL gambar.
                </p>
              </div>
            </div>

            {validationErrors.images && (
              <p className="text-red-500 text-xs">{validationErrors.images}</p>
            )}

            <div>
              <Label>Gambar yang Ditambahkan</Label>
              {formData.images && formData.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {formData.images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-md p-2"
                    >
                      <div className="relative h-32 w-full">
                        <img
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs truncate flex-1 pr-2">
                          {imageUrl.substring(0, 30)}...
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  Belum ada gambar yang ditambahkan
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Deskripsi Lebih Lanjut</Label>
            <div>
              {/* State to track the current editor content */}
              <div className="w-full mb-4">
                <RichTextEditorWithPreview
                  key={`editor-${formData.furtherDetails?.length || 0}`}
                  value={formData.currentDetail || ""}
                  onChange={(value) => {
                    // Update the formData with the current editor content
                    setFormData({
                      ...formData,
                      currentDetail: value,
                    });
                  }}
                  placeholder="Tambahkan informasi tambahan tentang produk"
                  minHeight="200px"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    const currentDetail = formData.currentDetail;
                    if (currentDetail && currentDetail.trim()) {
                      // Add the current detail to the furtherDetails array
                      setFormData({
                        ...formData,
                        furtherDetails: [
                          ...(formData.furtherDetails || []),
                          currentDetail.trim(),
                        ],
                        // Clear the current detail
                        currentDetail: "",
                      });
                    }
                  }}
                >
                  Tambah ke Deskripsi
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Tambahkan informasi lebih lanjut tentang produk ini (fitur,
              manfaat, dll.) dengan format teks yang lebih kaya.
            </p>

            {formData.furtherDetails && formData.furtherDetails.length > 0 && (
              <div className="mt-4 border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">
                  Deskripsi yang Ditambahkan:
                </h4>
                <div className="space-y-4">
                  {formData.furtherDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between group">
                        <div className="flex-1 prose prose-sm max-w-none">
                          <HtmlContent html={detail} />
                        </div>
                        <div className="flex gap-1 ml-2 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              // Set the current detail to the selected one for editing
                              setFormData({
                                ...formData,
                                currentDetail: detail,
                              });

                              // Remove it from the furtherDetails array
                              const updatedDetails = [
                                ...(formData.furtherDetails || []),
                              ];
                              updatedDetails.splice(index, 1);
                              setFormData((prev) => ({
                                ...prev,
                                furtherDetails: updatedDetails,
                              }));
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              const updatedDetails = [
                                ...(formData.furtherDetails || []),
                              ];
                              updatedDetails.splice(index, 1);
                              setFormData({
                                ...formData,
                                furtherDetails: updatedDetails,
                              });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                id="newTag"
                name="newTag"
                placeholder="Tambahkan tag untuk produk (contoh: Pedas, Ayam, Burger)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => {
                  const newTag = (
                    document.getElementById("newTag") as HTMLInputElement
                  ).value;
                  if (newTag.trim()) {
                    setFormData({
                      ...formData,
                      tags: [...(formData.tags || []), newTag.trim()],
                    });
                    (
                      document.getElementById("newTag") as HTMLInputElement
                    ).value = "";
                  }
                }}
              >
                Tambah
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tambahkan tag untuk memudahkan pencarian produk
            </p>

            {formData.tags && formData.tags.length > 0 ? (
              <div className="mt-2 border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">
                  Tags yang Ditambahkan:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center group"
                    >
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1 rounded-full"
                        onClick={() => {
                          const updatedTags = [...(formData.tags || [])];
                          updatedTags.splice(index, 1);
                          setFormData({
                            ...formData,
                            tags: updatedTags,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Belum ada tag yang ditambahkan
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || "AVAILABLE"}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="LOW_STOCK">Stok Menipis</option>
                <option value="OUT_OF_STOCK">Habis</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL (otomatis)</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Slug dibuat otomatis dari nama produk
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
              ? "Perbarui Produk"
              : "Simpan Produk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
