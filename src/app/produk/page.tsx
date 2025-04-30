import { Metadata } from "next";
import { getProducts } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import { mapDbCategoryToUiCategory } from "@/types/category";
import { prisma } from "@/lib/db";
import {
  ProductBreadcrumb,
  ProductHero,
  AllProductsGrid,
  FeaturedCategories,
  PromoBanner,
  QuickLinks,
} from "@/components/pages/produk";

export const metadata: Metadata = {
  title: "Produk - SaletaFood",
  description:
    "Jelajahi produk lengkap kami dengan berbagai pilihan makanan dan minuman lezat",
};

export default async function ProdukPage() {
  // Fetch products from the database
  const { products: dbProducts } = await getProducts();

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
      <AllProductsGrid products={dbProducts || []} />
      <FeaturedCategories />
      <PromoBanner />
      <QuickLinks categories={categoriesWithCounts} />
    </div>
  );
}
