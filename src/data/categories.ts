import {
  Beef,
  Pizza as PizzaIcon,
  Salad as SaladIcon,
  Cake,
  Wine,
  Cookie,
} from "lucide-react";

export interface Category {
  id: number;
  name: string;
  description: string;
  count?: number;
  image: string;
  icon: any; // Using any for simplicity with Lucide icons
  color: string;
  bgColor: string;
  slug?: string;
}

export const categories: Category[] = [];

// Function to get a category by name
export function getCategoryByName(name: string): Category | undefined {
  return categories.find(
    (category) => category.name.toLowerCase() === name.toLowerCase()
  );
}

// Function to get a category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(
    (category) => category.slug?.toLowerCase() === slug.toLowerCase()
  );
}
