import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UiCategory } from "@/types/category";
import { renderCategoryIcon } from "@/lib/icon-utils";

interface CategoryGridProps {
  categories: (UiCategory & { count: number })[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/produk/${category.slug}`}
          className="block group"
        >
          <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/40 h-full flex flex-col">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={category.image || "/placeholder-image.jpg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div
                className={cn(
                  "absolute top-4 left-4 p-2 rounded-full",
                  category.bgColor
                )}
              >
                {renderCategoryIcon(category, "h-6 w-6")}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {category.count} item
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {category.description || ""}
              </p>
              <div className="mt-auto">
                <span className="text-primary font-medium flex items-center text-sm group-hover:underline">
                  Lihat Produk
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
