"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategory } from "@/actions/category-actions";
import { categoryFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

export default function NewCategoryPage() {
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
    name: "",
    description: "",
    slug: "",
    image: "",
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-generate slug when name changes
      if (name === "name") {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
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
      const result = await createCategory(categoryData);

      if (result.success) {
        setFormSuccess("Kategori berhasil ditambahkan!");

        // Redirect after successful creation after 1.5 seconds
        setTimeout(() => {
          router.push("/admin/dashboard/categories");
          router.refresh();
        }, 1500);
      } else {
        setFormError(result.error || "Gagal menambahkan kategori");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Terjadi kesalahan saat menambahkan kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tambah Kategori Baru</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/categories">
            Kembali ke Daftar Kategori
          </Link>
        </Button>
      </div>

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
          <CardTitle>Tambah Kategori Baru</CardTitle>
          <CardDescription>
            Tambahkan kategori produk baru untuk digunakan dalam produk Anda
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
                  className={
                    validationErrors.description ? "border-red-500" : ""
                  }
                  rows={3}
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
                <p className="text-xs text-muted-foreground">
                  Slug digunakan untuk URL. Dibuat otomatis dari nama kategori.
                </p>
                {validationErrors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.slug}
                  </p>
                )}
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
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard/categories")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
