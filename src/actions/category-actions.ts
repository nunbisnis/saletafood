"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { categorySchema, type CategoryFormData } from "@/lib/zod";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    // Map the categories to include the product count
    const categoriesWithCount = categories.map((category) => ({
      ...category,
      productCount: category._count.products,
      _count: undefined,
    }));

    return { categories: categoriesWithCount };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { error: "Failed to fetch categories" };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return { error: "Category not found" };
    }

    return { category };
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return { error: "Failed to fetch category" };
  }
}

export async function createCategory(formData: CategoryFormData) {
  // Validate input data
  const validationResult = categorySchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const validData = validationResult.data;

    const category = await prisma.category.create({
      data: {
        name: validData.name,
        description: validData.description,
        slug: validData.slug,
        image: validData.image,
      },
    });

    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/produk");

    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: CategoryFormData) {
  // Validate input data
  const validationResult = categorySchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const validData = validationResult.data;

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: validData.name,
        description: validData.description,
        slug: validData.slug,
        image: validData.image,
      },
    });

    revalidatePath("/admin/dashboard/categories");
    revalidatePath(`/produk/kategori/${category.slug}`);
    revalidatePath("/produk");

    return { success: true, category };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  if (!id || typeof id !== "string") {
    return {
      success: false,
      error: "Invalid category ID",
    };
  }

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return {
        success: false,
        error: "Category not found",
      };
    }

    // Check if there are any products in this category
    const productsCount = await prisma.product.count({
      where: {
        categoryId: id,
      },
    });

    if (productsCount > 0) {
      return {
        success: false,
        error:
          "Cannot delete category with products. Please move or delete the products first.",
      };
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/produk");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
