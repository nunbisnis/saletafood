import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  product: Product;
  relatedProducts: Product[];
}

export function RelatedProducts({ product, relatedProducts }: RelatedProductsProps) {
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Produk Terkait</h2>
        <Link
          href={`/produk/${product.category.toLowerCase()}`}
          className="text-primary font-medium flex items-center hover:underline"
        >
          Lihat Semua
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
