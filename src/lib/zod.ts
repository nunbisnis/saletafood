import { z } from "zod";

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  images: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required"),
  status: z.enum(["AVAILABLE", "OUT_OF_STOCK", "LOW_STOCK"]),
  categoryId: z.string().min(1, "Category is required"),
  furtherDetails: z.array(z.string()),
  tags: z.array(z.string()),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
});

// Product form schema (client-side)
export const productFormSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  description: z.string().min(1, "Deskripsi produk harus diisi"),
  price: z.string().min(1, "Harga produk harus diisi"),
  images: z
    .array(z.string().url("URL gambar tidak valid"))
    .min(1, "Minimal satu gambar harus diisi"),
  status: z.enum(["AVAILABLE", "OUT_OF_STOCK", "LOW_STOCK"]),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  furtherDetails: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  image: z.string().url("Must be a valid URL").optional(),
});

// Category form schema (client-side)
export const categoryFormSchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug harus diisi")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus URL-friendly"),
  image: z.string().url("URL gambar tidak valid").optional(),
});

// User schemas
export const userSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

// Order schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

export const orderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
  total: z.number().positive("Total must be positive"),
  items: z.array(orderItemSchema),
});

// Type exports
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
