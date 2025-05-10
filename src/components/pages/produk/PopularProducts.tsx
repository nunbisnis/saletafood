import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart } from "lucide-react";
import { getPopularProducts } from "@/actions/product-actions";
import { formatIDR } from "@/lib/currency-utils";
import { cn } from "@/lib/utils";

export async function PopularProducts() {
  // Fetch popular products (default is 3)
  const { products, error } = await getPopularProducts();

  // If there's an error or no products, don't render anything
  if (error || !products || products.length === 0) {
    return null;
  }

  // Ensure we have exactly 3 products for our layout
  const displayProducts = products.slice(0, 3);

  // If we have fewer than 3 products, don't show the component
  if (displayProducts.length < 3) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="#16A34A"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-lg font-semibold">Produk Terpopuler</h2>
        <span className="text-sm text-muted-foreground">
          Produk yang paling banyak dilihat
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayProducts.map((product, index) => (
          <ProductPopularCard
            key={product.id}
            product={product}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductPopularCardProps {
  product: any;
  rank: number;
}

function ProductPopularCard({ product, rank }: ProductPopularCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border/40 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
      <Link href={`/detail/${product.slug}`} className="block">
        <div className="relative h-[180px] w-full overflow-hidden">
          <Image
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/placeholder-image.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Rank indicator */}
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span className="text-xs font-semibold text-primary">{rank}</span>
          </div>

          {/* View count badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-white/90 text-primary shadow-sm text-xs px-1.5 py-0.5"
            >
              <Eye className="h-3 w-3" />
              <span>{product.viewCount}</span>
            </Badge>
          </div>

          {/* Status badges */}
          {product.status === "LOW_STOCK" && (
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="destructive"
                className="bg-yellow-500 text-white text-xs"
              >
                Stok Menipis
              </Badge>
            </div>
          )}
          {product.status === "OUT_OF_STOCK" && (
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="destructive"
                className="bg-red-500 text-white text-xs"
              >
                Habis
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="mb-0.5">
          <Link
            href={`/produk/${product.category.slug}`}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {product.category.name}
          </Link>
        </div>

        <Link href={`/detail/${product.slug}`} className="block">
          <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          {product.price !== 0 ? (
            <span className="text-sm font-semibold text-primary">
              {formatIDR(product.price)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Hubungi kami</span>
          )}

          <Link
            href={`https://wa.me/6285747375614?text=Halo%20SaletaFood%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
              product.name
            )}.%20Boleh%20minta%20informasi%20lebih%20lanjut%3F`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1 text-xs font-medium bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-colors",
              product.status === "OUT_OF_STOCK" &&
                "opacity-50 pointer-events-none"
            )}
          >
            <ShoppingCart className="h-3 w-3 flex-shrink-0" />
            <span>Pesan Sekarang</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
