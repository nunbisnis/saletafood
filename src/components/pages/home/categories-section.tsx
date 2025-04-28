import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductsByCategory } from "@/data/products";
import { categories } from "@/data/categories";

export function CategoriesSection() {
  // Update category counts from actual product data
  const categoriesWithCounts = categories.map((category) => {
    const count = getProductsByCategory(category.name).length;
    return {
      ...category,
      count: count || category.count, // Use the actual count or fallback to the predefined count
    };
  });

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold">Jelajahi Kategori</h2>
            <p className="text-muted-foreground mt-2">
              Temukan berbagai pilihan makanan lezat
            </p>
          </div>
          <Link
            href="/produk"
            className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
          >
            Lihat Semua Kategori
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category) => (
            <Link
              key={category.id}
              href={`/produk/${category.name.toLowerCase()}`}
              className="block group"
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/40 h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={category.image}
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
                    <category.icon
                      className={cn(
                        "h-6 w-6 text-gradient bg-gradient-to-r",
                        category.color
                      )}
                    />
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
                    {category.description}
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
      </div>
    </section>
  );
}
