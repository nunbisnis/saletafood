// Define a proper type for the product based on Prisma schema
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: "AVAILABLE" | "OUT_OF_STOCK" | "LOW_STOCK";
  rating?: number | null;
  reviews?: number | null;
  slug: string;
  categoryId: string;
  ingredients: string[];
  tags: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}
