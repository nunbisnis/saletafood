import Link from "next/link";
import { Category } from "@/data/categories";

interface OtherCategoriesProps {
  categories: Category[];
  currentCategory: string;
}

export function OtherCategories({
  categories,
  currentCategory,
}: OtherCategoriesProps) {
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
              href={`/produk/${cat.name.toLowerCase()}`}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <div className={`p-3 rounded-full ${cat.bgColor} mb-2`}>
                <cat.icon
                  className={`h-6 w-6 text-gradient bg-gradient-to-r ${cat.color}`}
                />
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
