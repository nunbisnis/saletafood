"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/category-actions";
import { categoryFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CategoryFormData = {
  name: string;
  description?: string;
  slug?: string;
  image?: string;
};

type CategoryFormProps = {
  onSuccess: () => void;
};

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
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
        description: "",
        slug: generateSlug(formData.name),
        image: "",
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
        // Reset form after successful submission
        setFormData({
          name: "",
        });

        // Close dialog and notify parent after 1.5 seconds
        setTimeout(() => {
          setOpen(false);
          onSuccess();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          + Kategori Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Cukup masukkan nama kategori untuk menambahkan kategori baru.
            </DialogDescription>
          </DialogHeader>

          {formSuccess && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Berhasil!</AlertTitle>
              <AlertDescription className="text-green-700">
                {formSuccess}
              </AlertDescription>
            </Alert>
          )}

          {formError && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
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
              <p className="text-xs text-muted-foreground">
                Cukup masukkan nama kategori, slug akan dibuat otomatis
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
