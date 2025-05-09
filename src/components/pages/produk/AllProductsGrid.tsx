"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton } from "@/components";
import { Search } from "lucide-react";

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
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

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
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Semua Produk"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {searchQuery
            ? `Ditemukan ${products.length} produk untuk pencarian Anda`
            : "Jelajahi berbagai pilihan makanan dan minuman lezat kami"}
        </p>
      </div>

      {products.length > 0 ? (
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
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">
            Tidak ada produk ditemukan
          </h3>
          <p className="text-muted-foreground mb-6">
            Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian
            Anda.
          </p>
          <Button asChild variant="outline">
            <Link href="/produk">Lihat Semua Produk</Link>
          </Button>
        </div>
      )}

      {products.length > 0 && (
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
          ) : searchQuery ? (
            <Button asChild>
              <Link href="/produk">Lihat Semua Produk</Link>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
