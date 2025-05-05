"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { createCategory, updateCategory } from "@/actions/category-actions";
import { categoryFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ImageIcon, X } from "lucide-react";
import { uploadFile, validateImageFile } from "@/lib/upload-utils";
import { IconSelector } from "./IconSelector";

type CategoryFormData = {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  iconName?: string;
};

type CategoryFormProps = {
  categoryData?: any;
  isEditing?: boolean;
};

export function CategoryForm({
  categoryData,
  isEditing = false,
}: CategoryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize form data with category data if editing
  const [formData, setFormData] = useState<Partial<CategoryFormData>>(() => {
    if (isEditing && categoryData) {
      return {
        name: categoryData.name,
        description: categoryData.description || "",
        slug: categoryData.slug,
        image: categoryData.image || "",
        iconName: categoryData.iconName || "",
      };
    }

    return {
      name: "",
      description: "",
      slug: "",
      image: "",
      iconName: "",
    };
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // If name field is updated, generate a slug
    if (name === "name") {
      setFormData({
        ...formData,
        [name]: value,
        slug: generateSlug(value),
      });
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

  // Process files for upload
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // We only need one image for category, so just use the first file
      const file = files[0];

      // Validate the file
      const validationError = validateImageFile(file, 2); // Max 2MB
      if (validationError) {
        setValidationErrors({
          ...validationErrors,
          image: validationError,
        });
        setIsUploading(false);
        return;
      }

      // Update progress
      setUploadProgress(50);

      // Upload the file to the categories folder
      const imageUrl = await uploadFile(file, "categories");

      // Add the URL to the form data
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      // Clear any validation errors
      if (validationErrors.image) {
        setValidationErrors({
          ...validationErrors,
          image: "",
        });
      }

      // Update progress
      setUploadProgress(100);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setValidationErrors({
        ...validationErrors,
        image: "Gagal mengunggah gambar. Silakan coba lagi.",
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

  // Handle removing the image
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: "",
    });
  };

  // Handle icon selection
  const handleIconSelect = (iconName: string) => {
    setFormData({
      ...formData,
      iconName,
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
      // Validate form data
      const validationResult = categoryFormSchema.safeParse(formData);

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
      if (isEditing && categoryData) {
        result = await updateCategory(
          categoryData.id,
          formData as CategoryFormData
        );
        if (result.success) {
          setFormSuccess("Kategori berhasil diperbarui!");

          // Redirect to dashboard after 2 seconds
          // Keep isSubmitting true until redirect happens
          setTimeout(() => {
            router.push("/admin/dashboard/categories");
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
            setFormError(result.error || "Gagal memperbarui kategori");
          }
          setIsSubmitting(false); // Only set to false on error
        }
      } else {
        result = await createCategory(formData as CategoryFormData);
        if (result.success) {
          setFormSuccess("Kategori berhasil ditambahkan!");
          // Reset form after successful submission
          setFormData({
            name: "",
            description: "",
            slug: "",
            image: "",
            iconName: "",
          });

          // Redirect to dashboard after 2 seconds
          // Keep isSubmitting true until redirect happens
          setTimeout(() => {
            router.push("/admin/dashboard/categories");
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
            setFormError(result.error || "Gagal menambahkan kategori");
          }
          setIsSubmitting(false); // Only set to false on error
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        `Terjadi kesalahan saat ${
          isEditing ? "memperbarui" : "menambahkan"
        } kategori`
      );
      setIsSubmitting(false); // Only set to false on error
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informasi Kategori</CardTitle>
          <CardDescription>
            {isEditing
              ? "Edit informasi kategori yang sudah ada."
              : "Masukkan detail kategori baru yang ingin Anda tambahkan."}
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
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                name="name"
                placeholder="contoh: Makanan Utama"
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
              <Label htmlFor="slug">Slug URL (otomatis)</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                className={validationErrors.slug ? "border-red-500" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Slug dibuat otomatis dari nama kategori
              </p>
              {validationErrors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.slug}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <textarea
              id="description"
              name="description"
              className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                validationErrors.description ? "border-red-500" : ""
              }`}
              placeholder="Deskripsikan kategori ini..."
              value={formData.description || ""}
              onChange={handleChange}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Icon Selector */}
            <IconSelector
              selectedIcon={formData.iconName || null}
              onSelectIcon={handleIconSelect}
            />

            <div>
              <Label>Gambar Kategori (Opsional)</Label>
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
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
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <ImageIcon
                      className={`h-10 w-10 ${
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
                    <p className="pl-1">atau seret dan lepas gambar di sini</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hingga 2MB
                  </p>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Mengunggah... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
              {validationErrors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.image}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">
                ATAU
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL Gambar (Opsional)</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image || ""}
                onChange={handleChange}
                className={validationErrors.image ? "border-red-500" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Masukkan URL gambar untuk kategori ini
              </p>
            </div>
          </div>

          {formData.image && (
            <div className="space-y-2">
              <Label>Preview Gambar</Label>
              <div className="border rounded-md p-2 relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="relative h-40 w-full">
                  <Image
                    src={formData.image}
                    alt="Category preview"
                    width={400}
                    height={160}
                    className="h-full w-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/categories">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
              ? "Perbarui Kategori"
              : "Simpan Kategori"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
