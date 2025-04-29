"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
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

    // Convert Decimal to number to avoid serialization issues
    const serializedProducts = products.map((product) => {
      const base = {
        ...product,
        price: parseFloat(product.price.toString()),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };

      // Get the raw images data from the database
      const rawImages = (product as any).images;

      // Parse the images field - it might be a string, an array, or undefined
      let parsedImages: string[] = [];

      if (rawImages) {
        if (typeof rawImages === "string") {
          // If it's a JSON string, parse it
          try {
            parsedImages = JSON.parse(rawImages);
          } catch (e) {
            // If it's a single URL string, wrap it in an array
            if (rawImages.startsWith("http")) {
              parsedImages = [rawImages];
            }
          }
        } else if (Array.isArray(rawImages)) {
          // If it's already an array, use it
          parsedImages = [...rawImages];
        }
      }

      // Return the product with parsed images
      return {
        ...base,
        images: parsedImages,
      };
    });

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

    // Convert Decimal to number to avoid serialization issues
    const serializedProducts = products.map((product) => {
      const base = {
        ...product,
        price: parseFloat(product.price.toString()),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };

      // Get the raw images data from the database
      const rawImages = (product as any).images;

      // Parse the images field - it might be a string, an array, or undefined
      let parsedImages: string[] = [];

      if (rawImages) {
        if (typeof rawImages === "string") {
          // If it's a JSON string, parse it
          try {
            parsedImages = JSON.parse(rawImages);
          } catch (e) {
            // If it's a single URL string, wrap it in an array
            if (rawImages.startsWith("http")) {
              parsedImages = [rawImages];
            }
          }
        } else if (Array.isArray(rawImages)) {
          // If it's already an array, use it
          parsedImages = [...rawImages];
        }
      }

      // Return the product with parsed images
      return {
        ...base,
        images: parsedImages,
      };
    });

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

    // Convert Decimal to number to avoid serialization issues
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    // Get the raw images data from the database
    const rawImages = (product as any).images;
    console.log("Raw images from database (getProductBySlug):", rawImages);

    // Parse the images field - it might be a string, an array, or undefined
    let parsedImages: string[] = [];

    if (rawImages) {
      if (typeof rawImages === "string") {
        // If it's a JSON string, parse it
        try {
          parsedImages = JSON.parse(rawImages);
          console.log("Parsed images from JSON string:", parsedImages);
        } catch (e) {
          console.error("Error parsing images JSON:", e);
          // If it's a single URL string, wrap it in an array
          if (rawImages.startsWith("http")) {
            parsedImages = [rawImages];
            console.log("Treating raw images as a single URL:", parsedImages);
          }
        }
      } else if (Array.isArray(rawImages)) {
        // If it's already an array, use it
        parsedImages = [...rawImages];
        console.log("Raw images is already an array:", parsedImages);
      }
    }

    // Explicitly add the images field to ensure it's properly included
    const productWithImages = {
      ...serializedProduct,
      images: parsedImages,
    };

    return { product: productWithImages };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
  }
}

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

    // Convert Decimal to number to avoid serialization issues
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    // Get the raw images data from the database
    const rawImages = (product as any).images;
    console.log("Raw images from database:", rawImages);

    // Parse the images field - it might be a string, an array, or undefined
    let parsedImages: string[] = [];

    if (rawImages) {
      if (typeof rawImages === "string") {
        // If it's a JSON string, parse it
        try {
          parsedImages = JSON.parse(rawImages);
          console.log("Parsed images from JSON string:", parsedImages);
        } catch (e) {
          console.error("Error parsing images JSON:", e);
          // If it's a single URL string, wrap it in an array
          if (rawImages.startsWith("http")) {
            parsedImages = [rawImages];
            console.log("Treating raw images as a single URL:", parsedImages);
          }
        }
      } else if (Array.isArray(rawImages)) {
        // If it's already an array, use it
        parsedImages = [...rawImages];
        console.log("Raw images is already an array:", parsedImages);
      }
    }

    // Explicitly add the images field to ensure it's properly included
    const productWithImages = {
      ...serializedProduct,
      images: parsedImages,
    };

    console.log("Final product with images:", productWithImages.images);

    return { product: productWithImages };
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
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    return { success: true, product: serializedProduct };
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

    console.log("Updated product from database:", updatedProduct);
    console.log("Updated product images:", (updatedProduct as any).images);

    // Serialize the product object to avoid Decimal serialization issues
    const serializedProduct = {
      ...updatedProduct,
      price: parseFloat(updatedProduct.price.toString()),
      createdAt: updatedProduct.createdAt.toISOString(),
      updatedAt: updatedProduct.updatedAt.toISOString(),
    };

    // Get the raw images data from the database
    const rawImages = (updatedProduct as any).images;
    console.log("Raw images from database (updateProduct):", rawImages);

    // Parse the images field - it might be a string, an array, or undefined
    let parsedImages: string[] = [];

    if (rawImages) {
      if (typeof rawImages === "string") {
        // If it's a JSON string, parse it
        try {
          parsedImages = JSON.parse(rawImages);
          console.log("Parsed images from JSON string:", parsedImages);
        } catch (e) {
          console.error("Error parsing images JSON:", e);
          // If it's a single URL string, wrap it in an array
          if (rawImages.startsWith("http")) {
            parsedImages = [rawImages];
            console.log("Treating raw images as a single URL:", parsedImages);
          }
        }
      } else if (Array.isArray(rawImages)) {
        // If it's already an array, use it
        parsedImages = [...rawImages];
        console.log("Raw images is already an array:", parsedImages);
      }
    }

    // If we still don't have images, fallback to the form data
    if (
      parsedImages.length === 0 &&
      validData.images &&
      validData.images.length > 0
    ) {
      parsedImages = [...validData.images];
      console.log("Using images from form data:", parsedImages);
    }

    // Explicitly add the images field
    const productWithImages = {
      ...serializedProduct,
      images: parsedImages,
    };

    console.log("Returning product with images:", productWithImages.images);

    return { success: true, product: productWithImages };
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

    // Convert Decimal to number to avoid serialization issues
    const serializedProducts = products.map((product) => {
      const base = {
        ...product,
        price: parseFloat(product.price.toString()),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };

      // Get the raw images data from the database
      const rawImages = (product as any).images;

      // Parse the images field - it might be a string, an array, or undefined
      let parsedImages: string[] = [];

      if (rawImages) {
        if (typeof rawImages === "string") {
          // If it's a JSON string, parse it
          try {
            parsedImages = JSON.parse(rawImages);
          } catch (e) {
            // If it's a single URL string, wrap it in an array
            if (rawImages.startsWith("http")) {
              parsedImages = [rawImages];
            }
          }
        } else if (Array.isArray(rawImages)) {
          // If it's already an array, use it
          parsedImages = [...rawImages];
        }
      }

      // Return the product with parsed images
      return {
        ...base,
        images: parsedImages,
      };
    });

    return { products: serializedProducts };
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return { error: "Failed to fetch featured products" };
  }
}
