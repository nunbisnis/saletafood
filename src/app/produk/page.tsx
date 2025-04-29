import { Metadata } from "next";
import { categories } from "@/data/categories";
import { getProductsByCategory, products } from "@/data/products";
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

export default function ProdukPage() {
  // Update category counts from actual product data
  const categoriesWithCounts = categories.map((category) => {
    const count = getProductsByCategory(category.name).length;
    return {
      ...category,
      count: count || 0,
    };
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductBreadcrumb />
      <ProductHero />
      <AllProductsGrid products={products} />
      <FeaturedCategories />
      <PromoBanner />
      <QuickLinks categories={categoriesWithCounts} />
    </div>
  );
}
