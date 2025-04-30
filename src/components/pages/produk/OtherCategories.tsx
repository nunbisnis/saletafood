import Link from "next/link";
import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { UiCategory } from "@/types/category";

interface OtherCategoriesProps {
  categories: UiCategory[];
  currentCategory: string;
}

export function OtherCategories({
  categories,
  currentCategory,
}: OtherCategoriesProps) {
  // Function to render the appropriate icon
  const renderIcon = (category: UiCategory) => {
    if (
      category.iconName &&
      typeof category.iconName === "string" &&
      LucideIcons[category.iconName as keyof typeof LucideIcons]
    ) {
      // If iconName exists and is a valid Lucide icon, render it
      const IconComponent = LucideIcons[
        category.iconName as keyof typeof LucideIcons
      ] as React.ElementType;

      return (
        <IconComponent
          className={cn(
            "h-6 w-6 text-gradient bg-gradient-to-r",
            category.color
          )}
        />
      );
    } else if (typeof category.icon === "function") {
      // Fallback to icon function if available (for backward compatibility)
      return (
        <category.icon
          className={cn(
            "h-6 w-6 text-gradient bg-gradient-to-r",
            category.color
          )}
        />
      );
    } else {
      // Default fallback to ChevronRight if no valid icon is found
      return (
        <ChevronRight
          className={cn(
            "h-6 w-6 text-gradient bg-gradient-to-r",
            category.color
          )}
        />
      );
    }
  };

  return (
    <div className="border-t pt-8">
      <h3 className="text-xl font-bold mb-6">Kategori Lainnya</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories
          .filter(
            (cat) => cat.name.toLowerCase() !== currentCategory.toLowerCase()
          )
          .map((cat) => (
            <Link
              key={cat.id}
              href={`/produk/${cat.slug}`}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <div className={`p-3 rounded-full ${cat.bgColor} mb-2`}>
                {renderIcon(cat)}
              </div>
              <span className="text-sm font-medium text-center">
                {cat.name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
