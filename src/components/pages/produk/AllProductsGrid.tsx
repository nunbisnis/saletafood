"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { ProductCard, ProductCardSkeleton } from "@/components/pages/product";

interface AllProductsGridProps {
  products: Product[];
  initialLimit?: number;
  incrementAmount?: number;
}

export function AllProductsGrid({
  products,
  initialLimit = 8,
  incrementAmount = 4,
}: AllProductsGridProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);

  const showMoreProducts = () => {
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setDisplayLimit((prev) => prev + incrementAmount);
      setIsLoading(false);
    }, 800);
  };

  const displayedProducts = products.slice(0, displayLimit);
  const hasMoreProducts = displayLimit < products.length;

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Kategori Produk</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Display loaded products */}
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Display skeleton loaders when loading more */}
        {isLoading &&
          Array.from({ length: incrementAmount }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {hasMoreProducts && (
        <div className="flex justify-center">
          <Button
            onClick={showMoreProducts}
            variant="outline"
            size="lg"
            className="px-8"
            disabled={isLoading}
          >
            {isLoading ? "Memuat..." : "Lihat Lebih Banyak"}
          </Button>
        </div>
      )}
    </div>
  );
}
