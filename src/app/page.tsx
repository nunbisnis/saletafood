import {
  HeroSection,
  CategoriesSection,
  CTASection,
} from "@/components/pages/home";
import { AllProductsGrid, PopularProducts } from "@/components/pages/produk";
import { getProducts } from "@/actions/product-actions";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  // Fetch products from the database
  const { products: dbProducts } = await getProducts();

  return (
    <div className="flex flex-col min-h-screen ">
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-0">
        <Suspense fallback={<div>Loading products...</div>}>
          <AllProductsGrid
            products={dbProducts || []}
            initialLimit={8}
            incrementAmount={4}
          />
        </Suspense>
        <div className="mt-10 mb-4 text-center">
          <Link href="/produk" className="inline-block">
            <div className="border border-primary/20 hover:border-primary/40 rounded-full px-6 py-2.5 text-primary font-medium text-sm transition-all duration-200 hover:bg-primary/5">
              Lihat Semua Produk
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-slate-50/50 py-6 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PopularProducts />
        </div>
      </div>
      <CategoriesSection />
      <CTASection />
    </div>
  );
}
