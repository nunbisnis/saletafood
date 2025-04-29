import { Product } from "@prisma/client";

/**
 * Parses the images field from a product
 * Handles different formats (string, array, etc.)
 */
export function parseProductImages(product: any): string[] {
  // Get the raw images data from the database
  const rawImages = product.images;

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

  return parsedImages;
}

/**
 * Serializes a product to avoid Decimal serialization issues
 */
export function serializeProduct(product: any) {
  // Convert Decimal to number to avoid serialization issues
  const serializedProduct = {
    ...product,
    price: parseFloat(product.price.toString()),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  // Parse the images field
  const parsedImages = parseProductImages(product);

  // Return the product with parsed images
  return {
    ...serializedProduct,
    images: parsedImages,
  };
}

/**
 * Serializes an array of products
 */
export function serializeProducts(products: any[]) {
  return products.map(serializeProduct);
}
