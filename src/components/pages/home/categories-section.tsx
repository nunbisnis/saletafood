import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories } from "@/actions/category-actions";
import { prisma } from "@/lib/db";
import { mapDbCategoryToUiCategory } from "@/types/category";

export async function CategoriesSection() {
  // Fetch categories from the database
  const { categories: dbCategories } = await getCategories();

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    (dbCategories || []).map(async (category) => {
      const count = await prisma.product.count({
        where: {
          categoryId: category.id,
        },
      });

      // Map database category to UI category
      const uiCategory = mapDbCategoryToUiCategory(category);

      // Log the category data to verify iconName is being fetched
      console.log(`Category ${category.name} iconName:`, category.iconName);

      return {
        ...uiCategory,
        count,
      };
    })
  );

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
            href="/kategori"
            className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
          >
            Lihat Semua Kategori
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.slice(0, 3).map((category) => (
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
                    {/* Check if iconName exists and is a valid Lucide icon */}
                    {category.iconName &&
                    typeof category.iconName === "string" &&
                    LucideIcons[
                      category.iconName as keyof typeof LucideIcons
                    ] ? (
                      (() => {
                        // Log the icon name to verify it's being used
                        console.log(`Rendering icon: ${category.iconName}`);

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
                      })()
                    ) : (
                      // Fallback to ChevronRight if no valid icon
                      <ChevronRight
                        className={cn(
                          "h-6 w-6 text-gradient bg-gradient-to-r",
                          category.color
                        )}
                      />
                    )}
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
      </div>
    </section>
  );
}
