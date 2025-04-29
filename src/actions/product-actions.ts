// Re-export all product-related functions from their respective files
// This maintains backward compatibility with existing imports

export {
  getProducts,
  getProductsByCategory,
  getFeaturedProducts,
} from "./product-list-actions";

export { getProductBySlug, getProductById } from "./product-detail-actions";

export {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product-mutation-actions";

// Export utility functions if needed
export {
  parseProductImages,
  serializeProduct,
  serializeProducts,
} from "./product-utils";
