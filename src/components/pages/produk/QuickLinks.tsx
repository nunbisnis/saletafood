import Link from "next/link";
import { UiCategory } from "@/types/category";
import { renderCategoryIcon } from "@/lib/icon-utils";

interface QuickLinksProps {
  categories: (UiCategory & { count: number })[];
}

export function QuickLinks({ categories }: QuickLinksProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/produk/${category.slug}`}
          className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
        >
          <div className={`p-3 rounded-full ${category.bgColor} mb-2`}>
            {renderCategoryIcon(category, "h-6 w-6")}
          </div>
          <span className="text-sm font-medium text-center">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
