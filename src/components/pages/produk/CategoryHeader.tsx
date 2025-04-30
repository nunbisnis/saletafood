import Image from "next/image";
import { UiCategory } from "@/types/category";
import { renderCategoryIcon } from "@/lib/icon-utils";

interface CategoryHeaderProps {
  category: UiCategory;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
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
              {renderCategoryIcon(category, "h-8 w-8")}
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
