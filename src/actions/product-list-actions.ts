"use server";

import { prisma } from "@/lib/db";
import { serializeProducts } from "./product-utils";

/**
 * Get all products with optional limit
 */
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

    const serializedProducts = serializeProducts(products);
    return { products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { error: "Failed to fetch products" };
  }
}

/**
 * Get products by category slug with optional limit
 */
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

    const serializedProducts = serializeProducts(products);
    return { products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return { error: "Failed to fetch products by category" };
  }
}

/**
 * Get featured products with optional limit
 */
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

    const serializedProducts = serializeProducts(products);
    return { products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return { error: "Failed to fetch featured products" };
  }
}
