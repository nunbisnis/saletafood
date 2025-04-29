"use server";

import { prisma } from "@/lib/db";
import { serializeProduct } from "./product-utils";

/**
 * Get a product by its slug
 */
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

    const productWithImages = serializeProduct(product);
    return { product: productWithImages };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
  }
}

/**
 * Get a product by its ID
 */
export async function getProductById(id: string) {
  // Check if id is valid
  if (!id || typeof id !== "string") {
    console.error("Invalid product ID:", id);
    return { error: "Invalid product ID" };
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    const productWithImages = serializeProduct(product);
    return { product: productWithImages };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
  }
}
