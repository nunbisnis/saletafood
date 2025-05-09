"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { productSchema, type ProductFormData } from "@/lib/zod";
import { del } from "@vercel/blob";

export async function getProducts(limit?: number, search?: string) {
  try {
    // Add caching to improve performance
    const cacheKey = `products-${limit || "all"}-${search || ""}`;

    // Build where clause based on search parameter
    const whereClause: any = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { tags: { has: search } },
          ],
        }
      : undefined;

    // Use Prisma's findMany with efficient query
    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal price to number to avoid serialization issues
    const serializedProducts = products.map((product) => ({
      ...product,
      price: parseFloat(product.price.toString()),
    }));

    return { products: serializedProducts };
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
    // Add caching to improve performance
    const cacheKey = `products-category-${categorySlug}-${limit || "all"}`;

    // Use Prisma's findMany with efficient query and select only needed fields
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal price to number to avoid serialization issues
    const serializedProducts = products.map((product) => ({
      ...product,
      price: parseFloat(product.price.toString()),
    }));

    return { products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return { error: "Failed to fetch products by category" };
  }
}

export async function getProductBySlug(
  slug: string,
  incrementView: boolean = false
) {
  try {
    // Add caching to improve performance
    const cacheKey = `product-${slug}`;

    // Use Prisma's findUnique with efficient query and select only needed fields
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    // Increment view count if requested
    if (incrementView) {
      await incrementProductViewCount(product.id);
    }

    // Convert Decimal price to number to avoid serialization issues
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
      // If we just incremented the view, add 1 to the returned count
      viewCount: incrementView ? product.viewCount + 1 : product.viewCount,
    };

    return { product: serializedProduct };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
  }
}

/**
 * Increment the view count for a product
 */
export async function incrementProductViewCount(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { viewCount: { increment: 1 } },
    });

    // Revalidate paths that might display popular products
    revalidatePath("/");
    revalidatePath("/produk");

    return { success: true };
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return { error: "Failed to increment view count" };
  }
}

/**
 * Get popular products based on view count
 */
export async function getPopularProducts(limit: number = 3) {
  try {
    // Get products with the highest view counts
    const products = await prisma.product.findMany({
      where: {
        // Only include products with at least 1 view
        viewCount: { gt: 0 },
      },
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        viewCount: "desc",
      },
    });

    // If we don't have enough viewed products, get the most recent ones to fill the gap
    if (products.length < limit) {
      const additionalProducts = await prisma.product.findMany({
        where: {
          // Exclude products we already have
          id: { notIn: products.map((p) => p.id) },
        },
        take: limit - products.length,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Combine the two sets of products
      products.push(...additionalProducts);
    }

    // Convert Decimal price to number to avoid serialization issues
    const serializedProducts = products.map((product) => ({
      ...product,
      price: parseFloat(product.price.toString()),
    }));

    return { products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch popular products:", error);
    return { error: "Failed to fetch popular products" };
  }
}

export async function createProduct(formData: ProductFormData) {
  console.log("Server received form data:", formData);

  // Validate input data
  const validationResult = productSchema.safeParse(formData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    console.log("Validation failed with errors:", fieldErrors);

    return {
      success: false,
      error: "Validation failed",
      fieldErrors,
    };
  }

  console.log("Validation successful");

  try {
    const validData = validationResult.data;

    const product = await prisma.product.create({
      data: {
        name: validData.name,
        description: validData.description,
        price: validData.price,
        images: validData.images,
        status: validData.status,
        categoryId: validData.categoryId,
        furtherDetails: validData.furtherDetails,
        tags: validData.tags,
        slug: validData.slug,
      },
    });

    // Convert Decimal price to number to avoid serialization issues
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
    };

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/produk");
    revalidatePath("/");

    return { success: true, product: serializedProduct };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
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
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // For now, we'll skip the order items check since the schema doesn't have orderItems
    // If you add order functionality later, you can uncomment and update this code
    /*
    // Check if product has order items
    if (product.orderItems && product.orderItems.length > 0) {
      return {
        success: false,
        error: "Cannot delete product with existing orders",
      };
    }
    */

    // Delete images from Vercel Blob if they exist
    if (product.images && product.images.length > 0) {
      try {
        // Process each image URL
        for (const imageUrl of product.images) {
          // Only delete images from Vercel Blob (not external URLs)
          if (imageUrl.includes("vercel-blob.com")) {
            try {
              console.log(`Attempting to delete image: ${imageUrl}`);
              await del(imageUrl);
              console.log(`Successfully deleted image: ${imageUrl}`);
            } catch (blobError) {
              console.error(
                `Failed to delete image from Blob: ${imageUrl}`,
                blobError
              );
              // Continue with other images even if one fails
            }
          }
        }
      } catch (imageError) {
        console.error("Error processing images for deletion:", imageError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/produk");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
