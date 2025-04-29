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
import { createProduct } from "@/actions/product-actions";
import { editProduct } from "@/actions/edit-product-action";
import { getCategories } from "@/actions/category-actions";
import { productFormSchema } from "@/lib/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  image: string;
  status: "AVAILABLE" | "OUT_OF_STOCK" | "LOW_STOCK";
  categoryId: string;
  ingredients: string[];
  tags: string[];
  slug?: string;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        price: productData.price.toString(),
        image: productData.image,
        status: productData.status,
        categoryId: productData.categoryId,
        ingredients: productData.ingredients || [],
        tags: productData.tags || [],
        slug: productData.slug,
      };
    }

    return {
      name: "",
      description: "",
      price: "",
      image: "",
      status: "AVAILABLE",
      categoryId: "",
      ingredients: [],
      tags: [],
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
      const productFormData = {
        ...(formData as ProductFormData),
        price: parseFloat(formData.price || "0"),
        slug: formData.slug || generateSlug(formData.name || ""),
        ingredients: formData.ingredients || [],
        tags: formData.tags || [],
      };

      // Validate the form data
      const validationResult = productFormSchema.safeParse({
        ...productFormData,
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

      let result;

      // Submit the form data based on whether we're editing or creating
      if (isEditing && productData) {
        result = await editProduct(productData.id, productFormData);
        if (result.success) {
          setFormSuccess("Produk berhasil diperbarui!");

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 2000);
        } else {
          setFormError(result.error || "Gagal memperbarui produk");
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
            image: "",
            status: "AVAILABLE",
            categoryId: "",
            ingredients: [],
            tags: [],
          });

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 2000);
        } else {
          setFormError(result.error || "Gagal menambahkan produk");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        `Terjadi kesalahan saat ${
          isEditing ? "memperbarui" : "menambahkan"
        } produk`
      );
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
            <Label htmlFor="image">URL Gambar Produk</Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image || ""}
              onChange={handleChange}
              className={validationErrors.image ? "border-red-500" : ""}
            />
            {validationErrors.image && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.image}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Masukkan URL gambar produk. Untuk sementara, gunakan URL gambar
              dari internet.
            </p>
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
