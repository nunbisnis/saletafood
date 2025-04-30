import { Metadata } from "next";
import { getCategories } from "@/actions/category-actions";
import { prisma } from "@/lib/db";
import { mapDbCategoryToUiCategory } from "@/types/category";
import { CategoryGrid } from "@/components/pages/kategori/CategoryGrid";
import { PageHeader } from "@/components/pages/kategori/PageHeader";

export const metadata: Metadata = {
  title: "Kategori - SaletaFood",
  description: "Jelajahi semua kategori produk kami",
};

export default async function CategoriesPage() {
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

      return {
        ...uiCategory,
        count,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader />
      <CategoryGrid categories={categoriesWithCounts} />
    </div>
  );
}
