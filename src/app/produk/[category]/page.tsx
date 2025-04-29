import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductFilters } from "@/components/layout/product-filters";
import { getProductsByCategory } from "@/data/products";
import { categories } from "@/data/categories";
import {
  ProductBreadcrumb,
  CategoryHeader,
  CategoryInfo,
  ProductGrid,
  EmptyProductState,
  OtherCategories,
  BackToProducts,
} from "@/components/pages/produk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  // Find the category from our categories data
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const categoryData = categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!categoryData) {
    return {
      title: "Kategori Tidak Ditemukan - SaletaFood",
    };
  }

  return {
    title: `${categoryData.name} - SaletaFood`,
    description: `Jelajahi menu ${categoryData.name} kami yang lezat. ${categoryData.description}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  // Get the category name from the URL
  const { category } = await params;
  const categoryName = decodeURIComponent(category);

  // Find the category from our categories data
  const categoryData = categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  // If category doesn't exist, show 404
  if (!categoryData) {
    notFound();
  }

  // Get products for this category
  let products = getProductsByCategory(categoryData.name);

  // Get search params
  const searchParamsData = await searchParams;

  // Apply sorting if specified
  if (searchParamsData.sort) {
    switch (searchParamsData.sort) {
      case "price-low":
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products = [...products].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        products = [...products].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        break;
      default:
        break;
    }
  }

  // Apply filtering if specified
  if (searchParamsData.filter) {
    switch (searchParamsData.filter) {
      case "available":
        products = products.filter((p) => p.status === "Tersedia");
        break;
      case "low-stock":
        products = products.filter((p) => p.status === "Stok Menipis");
        break;
      case "out-of-stock":
        products = products.filter((p) => p.status === "Habis");
        break;
      default:
        break;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductBreadcrumb category={categoryData.name} />
      <CategoryHeader category={categoryData} />

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <CategoryInfo name={categoryData.name} productCount={products.length} />
        <ProductFilters />
      </div>

      {/* Products Grid or Empty State */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyProductState categoryName={categoryName} />
      )}

      <OtherCategories categories={categories} currentCategory={categoryName} />
      <BackToProducts />
    </div>
  );
}
