import {
  HeroSection,
  CategoriesSection,
  CTASection,
} from "@/components/pages/home";
import { AllProductsGrid } from "@/components/pages/produk";
import { getProducts } from "@/actions/product-actions";

export default async function Home() {
  // Fetch products from the database
  const { products } = await getProducts(8);

  return (
    <div className="flex flex-col min-h-screen ">
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-0">
        <AllProductsGrid
          products={products || []}
          initialLimit={8}
          incrementAmount={4}
        />
      </div>
      <CategoriesSection />
      <CTASection />
    </div>
  );
}
