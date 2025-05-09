import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductFilters } from "@/components/layout/product-filters";
import { getProductsByCategory } from "@/actions/product-actions";
import { getCategories, getCategoryBySlug } from "@/actions/category-actions";
import { mapDbCategoryToUiCategory } from "@/types/category";
import { Suspense } from "react";
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
  // Find the category from our database
  const { category } = await params;
  const categorySlug = decodeURIComponent(category);
  const { category: dbCategory } = await getCategoryBySlug(categorySlug);

  if (!dbCategory) {
    return {
      title: "Kategori Tidak Ditemukan - SaletaFood",
    };
  }

  // Convert database category to UI category
  const categoryData = mapDbCategoryToUiCategory(dbCategory);

  return {
    title: `${categoryData.name} - SaletaFood`,
    description: `Jelajahi menu ${categoryData.name} kami yang lezat. ${
      categoryData.description || ""
    }`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  // Get the category slug from the URL
  const { category } = await params;
  const categorySlug = decodeURIComponent(category);

  // Find the category from our database
  const { category: dbCategory } = await getCategoryBySlug(categorySlug);

  // If category doesn't exist, show 404
  if (!dbCategory) {
    notFound();
  }

  // Convert database category to UI category with required props
  const categoryData = mapDbCategoryToUiCategory(dbCategory);

  // Get products for this category
  const productsResult = await getProductsByCategory(categorySlug);

  if ("error" in productsResult) {
    console.error("Error fetching products:", productsResult.error);
    // Return empty products array if there's an error
    productsResult.products = [];
  }

  // Ensure we have a valid products array, even if empty
  let products = productsResult.products || [];

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
      default:
        break;
    }
  }

  // Apply filtering if specified
  if (searchParamsData.filter) {
    switch (searchParamsData.filter) {
      case "available":
        products = products.filter((p) => p.status === "AVAILABLE");
        break;
      case "low-stock":
        products = products.filter((p) => p.status === "LOW_STOCK");
        break;
      case "out-of-stock":
        products = products.filter((p) => p.status === "OUT_OF_STOCK");
        break;
      default:
        break;
    }
  }

  // Fetch all categories for the "Other Categories" section
  const { categories: dbCategories } = await getCategories();

  // Convert all database categories to UI categories
  const allCategories =
    dbCategories?.map((cat) => mapDbCategoryToUiCategory(cat)) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductBreadcrumb category={categoryData.name} />
      <CategoryHeader
        category={categoryData} // Now properly typed as UiCategory
      />

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <CategoryInfo name={categoryData.name} productCount={products.length} />
        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductFilters />
        </Suspense>
      </div>

      {/* Products Grid or Empty State */}
      {products.length > 0 ? (
        <ProductGrid products={products as any} /> // Type cast to avoid TypeScript errors
      ) : (
        <EmptyProductState categoryName={categoryData.name} />
      )}

      <OtherCategories
        categories={allCategories} // Now properly typed as UiCategory[]
        currentCategory={categoryData.name}
      />
      <BackToProducts />
    </div>
  );
}
