"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { ProductCardSkeleton } from "@/components";

// Use a more generic type that works with both data sources
interface ProductType {
  id: string | number;
  name: string;
  description: string;
  price: number;
  images?: string[];
  image?: string;
  status: string;
  slug: string;
  category?: any;
  categoryId?: string;
}

interface ProductGridProps {
  products: ProductType[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setDisplayProducts(products);
      setIsLoading(false);
    } else {
      // If products array is empty, we'll still show loading state briefly
      const timer = setTimeout(() => {
        setDisplayProducts(products || []);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [products]);

  // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // If no products after loading, return empty div
  if (!displayProducts || displayProducts.length === 0) {
    return <div className="mb-12"></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {displayProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-border/40"
        >
          <Link href={`/detail/${product.slug}`} className="block">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : product.image || "/placeholder-image.jpg" // Fallback to placeholder if both are undefined
                }
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {(product.status === "LOW_STOCK" ||
                product.status === "Stok Menipis") && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Stok Menipis
                </div>
              )}
              {(product.status === "OUT_OF_STOCK" ||
                product.status === "Habis") && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Habis
                </div>
              )}
            </div>
          </Link>

          <CardHeader className="pb-2">
            <Link href={`/detail/${product.slug}`} className="block">
              <CardTitle className="text-lg hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
            </Link>

            <CardDescription className="line-clamp-2 text-sm">
              {product.description}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-between pt-0">
            {product.price !== 0 && (
              <span className="text-lg font-bold text-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </span>
            )}
            <Button
              size="sm"
              className="gap-1"
              disabled={
                product.status === "OUT_OF_STOCK" || product.status === "Habis"
              }
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Keranjang</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
