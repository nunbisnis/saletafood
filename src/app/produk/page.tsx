import { Metadata } from "next";
import { getProducts } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import { mapDbCategoryToUiCategory } from "@/types/category";
import { prisma } from "@/lib/db";
import { Suspense } from "react";
import {
  ProductBreadcrumb,
  ProductHero,
  AllProductsGrid,
  QuickLinks,
} from "@/components/pages/produk";

export const metadata: Metadata = {
  title: "Produk - Saleta Food",
  description:
    "Jelajahi produk lengkap kami dengan berbagai pilihan makanan dan minuman lezat",
};

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;

  // Get search query from URL if it exists
  const searchQuery = resolvedSearchParams.search || "";

  // Fetch products from the database with search parameter
  const { products: dbProducts } = await getProducts(undefined, searchQuery);

  // Fetch categories from the database
  const { categories: dbCategories } = await getCategories();

  // Get product counts for each category and map to UI format
  const categoriesWithCounts = await Promise.all(
    (dbCategories || []).map(async (category) => {
      // Count products in this category
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
      <ProductBreadcrumb />
      <ProductHero />
      <Suspense fallback={<div>Loading products...</div>}>
        <AllProductsGrid products={dbProducts || []} />
      </Suspense>
      <QuickLinks categories={categoriesWithCounts} />
    </div>
  );
}
