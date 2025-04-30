// Define a proper type for the category based on Prisma schema
export interface DbCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
  iconName: string | null;
  createdAt: Date;
  updatedAt: Date;
  products?: any[]; // We don't need the full product type here
}

// Define a type for the UI components that need icon and styling properties
export interface UiCategory {
  id: string | number;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
  icon: any; // For Lucide icons
  iconName: string | null; // Store the icon name
  color: string;
  bgColor: string;
  count?: number;
}

// Helper function to map database category to UI category
export function mapDbCategoryToUiCategory(dbCategory: DbCategory): UiCategory {
  // Define color mappings
  const colorMappings = [
    { color: "from-orange-500 to-red-600", bgColor: "bg-orange-100" },
    { color: "from-red-500 to-pink-600", bgColor: "bg-red-100" },
    { color: "from-green-500 to-emerald-600", bgColor: "bg-green-100" },
    { color: "from-purple-500 to-indigo-600", bgColor: "bg-purple-100" },
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-100" },
    { color: "from-amber-500 to-yellow-600", bgColor: "bg-amber-100" },
  ];

  // Get a consistent index based on the category id
  // Use the sum of character codes to ensure consistency
  let sum = 0;
  for (let i = 0; i < dbCategory.id.length; i++) {
    sum += dbCategory.id.charCodeAt(i);
  }
  const colorIndex = sum % colorMappings.length;

  // Get the color and bgColor
  const color = colorMappings[colorIndex].color;
  const bgColor = colorMappings[colorIndex].bgColor;

  // Default icon function
  let icon = () => null;

  return {
    ...dbCategory,
    description: dbCategory.description || "",
    image: dbCategory.image || "/placeholder-image.jpg",
    icon, // This will be replaced at runtime in the component
    iconName: dbCategory.iconName,
    color,
    bgColor,
  };
}
