import Image from "next/image";
import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { UiCategory } from "@/types/category";

interface CategoryHeaderProps {
  category: UiCategory;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  // Determine which icon to render based on iconName from database
  const renderIcon = () => {
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
            "h-8 w-8 text-gradient bg-gradient-to-r",
            category.color
          )}
        />
      );
    } else if (typeof category.icon === "function") {
      // Fallback to icon function if available (for backward compatibility)
      return (
        <category.icon
          className={cn(
            "h-8 w-8 text-gradient bg-gradient-to-r",
            category.color
          )}
        />
      );
    } else {
      // Default fallback to ChevronRight if no valid icon is found
      return (
        <ChevronRight
          className={cn(
            "h-8 w-8 text-gradient bg-gradient-to-r",
            category.color
          )}
        />
      );
    }
  };

  return (
    <div className="relative h-64 rounded-xl overflow-hidden mb-8">
      <Image
        src={category.image || "/placeholder-image.jpg"}
        alt={category.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
        <div className="container px-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${category.bgColor}`}>
              {renderIcon()}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {category.name}
              </h1>
              <p className="text-white/80 max-w-2xl">
                {category.description || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
