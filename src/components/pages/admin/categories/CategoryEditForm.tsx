"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCategory } from "@/actions/category-actions";
import { categoryFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
  productCount?: number;
};

type CategoryEditFormProps = {
  category: Category;
};

export function CategoryEditForm({ category }: CategoryEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    slug: string;
    image: string;
  }>({
    name: category.name || "",
    description: category.description || "",
    slug: category.slug || "",
    image: category.image || "",
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

    // If name field is updated, generate a slug (only if slug hasn't been manually edited)
    if (name === "name" && formData.slug === generateSlug(formData.name)) {
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
      const categoryData = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        image: formData.image,
      };

      // Validate the form data
      const validationResult = categoryFormSchema.safeParse(categoryData);

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
      const result = await updateCategory(category.id, categoryData);

      if (result.success) {
        setFormSuccess("Kategori berhasil diperbarui!");
        
        // Redirect after successful update after 1.5 seconds
        setTimeout(() => {
          router.push("/admin/dashboard/categories");
          router.refresh();
        }, 1500);
      } else {
        setFormError(result.error || "Gagal memperbarui kategori");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Terjadi kesalahan saat memperbarui kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/admin/dashboard/categories">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </Link>
          </Button>
        </div>
        <CardTitle>Edit Kategori</CardTitle>
        <CardDescription>
          Perbarui informasi kategori produk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Berhasil!</AlertTitle>
              <AlertDescription className="text-green-700">
                {formSuccess}
              </AlertDescription>
            </Alert>
          )}

          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                name="name"
                placeholder="contoh: Makanan Utama"
                value={formData.name}
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
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Deskripsi singkat tentang kategori ini"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={validationErrors.description ? "border-red-500" : ""}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="contoh: makanan-utama"
                value={formData.slug}
                onChange={handleChange}
                className={validationErrors.slug ? "border-red-500" : ""}
              />
              {validationErrors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.slug}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Slug digunakan untuk URL kategori. Hanya boleh berisi huruf kecil, angka, dan tanda hubung.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL Gambar (Opsional)</Label>
              <Input
                id="image"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                className={validationErrors.image ? "border-red-500" : ""}
              />
              {validationErrors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.image}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Masukkan URL gambar untuk kategori ini
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dashboard/categories")}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
