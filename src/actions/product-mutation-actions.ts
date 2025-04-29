"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { productSchema, type ProductFormData } from "@/lib/zod";
import { parseProductImages, serializeProduct } from "./product-utils";

/**
 * Create a new product
 */
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

    // Create a data object without the images field first
    const createData = {
      name: validData.name,
      description: validData.description,
      price: validData.price,
      image: validData.image,
      status: validData.status,
      categoryId: validData.categoryId,
      ingredients: validData.ingredients,
      tags: validData.tags,
      slug: validData.slug,
    };

    // Create the product without the images field
    const product = await prisma.product.create({
      data: createData,
    });

    // Always update the images field, even if it's an empty array
    console.log("Setting images field:", validData.images);

    try {
      // Convert the array to a JSON string for the SQL query
      const imagesJson = JSON.stringify(validData.images || []);
      console.log("Images JSON for SQL query:", imagesJson);

      // Use Prisma's raw query to update the images field
      await prisma.$executeRawUnsafe(
        `UPDATE products SET images = '${imagesJson}' WHERE id = '${product.id}'`
      );

      console.log("Images field updated successfully");
    } catch (error) {
      console.error("Error updating images field:", error);
    }

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/produk");

    // Serialize the product object to avoid Decimal serialization issues
    const serializedProduct = serializeProduct(product);

    return { success: true, product: serializedProduct };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

/**
 * Update an existing product
 */
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

    // Create a data object without the images field first
    const updateData = {
      name: validData.name,
      description: validData.description,
      price: validData.price,
      image: validData.image,
      status: validData.status,
      categoryId: validData.categoryId,
      ingredients: validData.ingredients,
      tags: validData.tags,
      slug: validData.slug,
    };

    // Update the product without the images field
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: updateData,
    });

    // Always update the images field, even if it's an empty array
    console.log("Updating images field:", validData.images);

    try {
      // Convert the array to a JSON string for the SQL query
      const imagesJson = JSON.stringify(validData.images || []);
      console.log("Images JSON for SQL query:", imagesJson);

      // Use Prisma's raw query to update the images field
      await prisma.$executeRawUnsafe(
        `UPDATE products SET images = '${imagesJson}' WHERE id = '${id}'`
      );

      console.log("Images field updated successfully");
    } catch (error) {
      console.error("Error updating images field:", error);
    }

    revalidatePath("/admin/dashboard/products");
    revalidatePath(`/produk/${product.slug}`);
    revalidatePath("/produk");

    // Fetch the updated product to get the latest data including images
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!updatedProduct) {
      return { success: false, error: "Failed to fetch updated product" };
    }

    // Serialize the product with images
    const productWithImages = serializeProduct(updatedProduct);

    return { success: true, product: productWithImages };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

/**
 * Delete a product by ID
 */
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

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    });

    // Note: Vercel Blob doesn't have a direct delete method in the client-side SDK
    // If you need to delete the image, you would need to implement a separate API route
    // that uses the Vercel Blob Admin SDK to delete the image
    // For now, we'll just revalidate the paths

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/produk");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
