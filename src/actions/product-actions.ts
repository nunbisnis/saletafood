"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema, type ProductFormData } from "@/lib/zod";

export async function getProducts(limit?: number) {
  try {
    const products = await prisma.product.findMany({
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { error: "Failed to fetch products" };
  }
}

export async function getProductsByCategory(
  categorySlug: string,
  limit?: number
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { products };
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return { error: "Failed to fetch products by category" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    return { product };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
  }
}

export async function createProduct(formData: ProductFormData) {
  // Validate input data
  const validationResult = productSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const validData = validationResult.data;

    const product = await prisma.product.create({
      data: {
        name: validData.name,
        description: validData.description,
        price: validData.price,
        image: validData.image,
        status: validData.status,
        categoryId: validData.categoryId,
        ingredients: validData.ingredients,
        tags: validData.tags,
        slug: validData.slug,
      },
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/produk");

    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: ProductFormData) {
  // Validate input data
  const validationResult = productSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const validData = validationResult.data;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: validData.name,
        description: validData.description,
        price: validData.price,
        image: validData.image,
        status: validData.status,
        categoryId: validData.categoryId,
        ingredients: validData.ingredients,
        tags: validData.tags,
        slug: validData.slug,
      },
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath(`/produk/${product.slug}`);
    revalidatePath("/produk");

    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  if (!id || typeof id !== "string") {
    return {
      success: false,
      error: "Invalid product ID",
    };
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { orderItems: { select: { id: true }, take: 1 } },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Check if product has order items
    if (product.orderItems.length > 0) {
      return {
        success: false,
        error: "Cannot delete product with existing orders",
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/produk");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getFeaturedProducts(limit?: number) {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
      },
      take: limit || 4,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { products };
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return { error: "Failed to fetch featured products" };
  }
}
