import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/actions/category-actions";
import { mapDbCategoryToUiCategory } from "@/types/category";

export async function FeaturedCategories() {
  // Fetch categories from the database
  const { categories: dbCategories } = await getCategories();

  // Map database categories to UI categories
  const categories =
    dbCategories?.map((cat) => mapDbCategoryToUiCategory(cat)) || [];

  // Get the first two categories, or use empty array if none exist
  const featuredCategories = categories.slice(0, 2);

  // If we don't have enough categories, return nothing
  if (featuredCategories.length < 2) {
    return null;
  }

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Produk Populer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredCategories.map((category) => (
          <div
            key={category.id}
            className="relative h-64 rounded-xl overflow-hidden group"
          >
            <Image
              src={category.image || "/placeholder-image.jpg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-white/80 mb-4 max-w-xs">
                {category.description ||
                  `Jelajahi produk ${category.name} kami`}
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link href={`/produk/${category.slug}`}>
                  Lihat Produk {category.name}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
