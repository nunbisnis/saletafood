"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton } from "@/components";
import { ChevronRight } from "lucide-react";

interface AllProductsGridProps {
  products: any[];
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Semua Produk</h2>
          <p className="text-muted-foreground mt-2">
            Jelajahi berbagai pilihan makanan dan minuman lezat kami
          </p>
        </div>
        <Link
          href="/produk"
          className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
        >
          Lihat Semua Produk
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

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

      <div className="mt-8 text-center">
        {hasMoreProducts ? (
          <Button
            onClick={showMoreProducts}
            variant="outline"
            size="lg"
            className="px-8"
            disabled={isLoading}
          >
            {isLoading ? "Memuat..." : "Lihat Lebih Banyak"}
          </Button>
        ) : (
          <Button asChild>
            <Link href="/produk">Lihat Semua Produk</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
