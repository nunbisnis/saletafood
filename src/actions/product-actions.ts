"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { productSchema, type ProductFormData } from "@/lib/zod";
import { del } from "@vercel/blob";

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

    // Convert Decimal price to number to avoid serialization issues
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
    };

    return { product: serializedProduct };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
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

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
