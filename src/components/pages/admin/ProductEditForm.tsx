"use client";

import { useState, useEffect } from "react";
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
import { updateProduct } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import { productFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CategoryForm } from "@/components/pages/admin/CategoryForm";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  status: "AVAILABLE" | "OUT_OF_STOCK" | "LOW_STOCK";
  categoryId: string;
  ingredients: string[];
  tags: string[];
  slug: string;
  category: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductEditFormProps = {
  product: Product;
};

export function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    image: string;
    images: string[];
    status: "AVAILABLE" | "OUT_OF_STOCK" | "LOW_STOCK";
    categoryId: string;
    ingredients: string[];
    tags: string[];
    slug: string;
  }>({
    name: product.name || "",
    description: product.description || "",
    price: product.price.toString() || "",
    image: product.image || "",
    images: product.images || [],
    status: product.status || "AVAILABLE",
    categoryId: product.categoryId || "",
    ingredients: product.ingredients || [],
    tags: product.tags || [],
    slug: product.slug || "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories on component mount or when refreshed
  const fetchCategories = async () => {
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
  };

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(null);
    setFormError(null);
    setValidationErrors({});

    try {
      // Prepare the data for submission
      const productData = {
        ...(formData as any),
        price: parseFloat(formData.price || "0"),
        slug: formData.slug || generateSlug(formData.name || ""),
        ingredients: formData.ingredients || [],
        tags: formData.tags || [],
      };

      // Validate the form data
      const validationResult = productFormSchema.safeParse({
        ...productData,
        price: formData.price || "0", // Keep as string for validation
      });

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

      // Submit the form data
      const result = await updateProduct(product.id, productData);

      if (result.success) {
        setFormSuccess("Produk berhasil ditambahkan!");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 2000);
      } else {
        setFormError(result.error || "Gagal menambahkan produk");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Terjadi kesalahan saat menambahkan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
          <CardDescription>
            Masukkan detail produk baru yang ingin Anda tambahkan ke menu Anda.
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
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="89.99"
                value={formData.price || ""}
                onChange={handleChange}
                className={validationErrors.price ? "border-red-500" : ""}
              />
              {validationErrors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.price}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                validationErrors.description ? "border-red-500" : ""
              }`}
              placeholder="Deskripsikan produk Anda..."
              value={formData.description || ""}
              onChange={handleChange}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="categoryId">Kategori</Label>
              <CategoryForm onSuccess={fetchCategories} />
            </div>
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
            <Label htmlFor="image">Gambar Produk</Label>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Gambar Utama</p>
                <ImageUpload
                  onImageUploaded={(url) => {
                    setFormData({
                      ...formData,
                      image: url,
                    });
                    // Clear validation error when image is uploaded
                    if (validationErrors.image) {
                      setValidationErrors({
                        ...validationErrors,
                        image: "",
                      });
                    }
                  }}
                  defaultImage={formData.image || ""}
                />
                {validationErrors.image && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.image}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Gambar Tambahan (Opsional)
                </p>
                <MultipleImageUpload
                  onImagesUploaded={(urls) => {
                    setFormData({
                      ...formData,
                      images: urls,
                    });
                  }}
                  defaultImages={formData.images || []}
                  maxImages={4}
                />
              </div>
            </div>
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
            {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
