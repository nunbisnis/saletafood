// Define a proper type for the product based on Prisma schema
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: "AVAILABLE" | "OUT_OF_STOCK" | "LOW_STOCK";
  slug: string;
  categoryId: string;
  furtherDetails: string[];
  tags: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}
