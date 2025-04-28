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

export const categories: Category[] = [
  {
    id: 1,
    name: "Burger",
    description: "Burger lezat dengan berbagai pilihan",
    image: "https://cdn.pixabay.com/photo/2022/01/17/19/24/burger-6945571_1280.jpg",
    icon: Beef,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-100",
    slug: "burger"
  },
  {
    id: 2,
    name: "Pizza",
    description: "Pizza dengan topping premium",
    image: "https://cdn.pixabay.com/photo/2017/02/15/10/57/pizza-2068272_1280.jpg",
    icon: PizzaIcon,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-100",
    slug: "pizza"
  },
  {
    id: 3,
    name: "Salad",
    description: "Salad segar dan sehat",
    image: "https://cdn.pixabay.com/photo/2016/08/18/18/40/salad-1603608_1280.jpg",
    icon: SaladIcon,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-100",
    slug: "salad"
  },
  {
    id: 4,
    name: "Dessert",
    description: "Pencuci mulut manis dan lezat",
    image: "https://cdn.pixabay.com/photo/2018/05/01/18/21/eclair-3366430_1280.jpg",
    icon: Cake,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-100",
    slug: "dessert"
  },
  {
    id: 5,
    name: "Minuman",
    description: "Minuman segar dan menyegarkan",
    image: "https://cdn.pixabay.com/photo/2016/10/22/20/34/wine-1761613_1280.jpg",
    icon: Wine,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-100",
    slug: "minuman"
  },
  {
    id: 6,
    name: "Camilan",
    description: "Camilan ringan untuk menemani hari Anda",
    image: "https://cdn.pixabay.com/photo/2016/11/11/02/05/potato-chips-1815760_1280.jpg",
    icon: Cookie,
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-100",
    slug: "camilan"
  },
];

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
