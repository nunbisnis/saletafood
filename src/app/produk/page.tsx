import { Metadata } from "next";
import { categories } from "@/data/categories";
import { getProducts } from "@/actions/product-actions";
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

  // Map database categories to the format expected by the components
  const categoriesWithCounts = categories.map((category) => {
    // Count products in this category
    const count =
      dbProducts?.filter(
        (p) => p.category.name.toLowerCase() === category.name.toLowerCase()
      ).length || 0;

    return {
      ...category,
      count: count,
    };
  });

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
