import { z } from "zod";

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description must be at most 300 characters"),
  price: z.coerce.number().min(0, "Price must be zero or positive"),
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
  description: z
    .string()
    .min(1, "Deskripsi produk harus diisi")
    .max(300, "Deskripsi produk maksimal 300 karakter"),
  price: z.string().min(0, "Harga produk harus diisi"),
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
  iconName: z.string().optional(),
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
  iconName: z.string().optional(),
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
  price: z.number().min(0, "Price must be zero or positive"),
});

export const orderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
  total: z.number().min(0, "Total must be zero or positive"),
  items: z.array(orderItemSchema),
});

// Type exports
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
