"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { productSchema, type ProductFormData } from "@/lib/zod";

export async function editProduct(id: string, formData: ProductFormData) {
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
    revalidatePath(`/produk/${product.slug}`);
    revalidatePath("/produk");

    return { success: true, product: serializedProduct };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}
