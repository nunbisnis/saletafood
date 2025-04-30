import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <p className="text-muted-foreground mb-6">{product.description}</p>

      <div className="flex items-center mb-8">
        <span className="text-3xl font-bold text-primary mr-4">
          Rp{product.price.toLocaleString("id-ID")}
        </span>
        {product.status === "AVAILABLE" && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Tersedia
          </span>
        )}
        {product.status === "LOW_STOCK" && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Stok Menipis
          </span>
        )}
        {product.status === "OUT_OF_STOCK" && (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Habis
          </span>
        )}
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {product.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          className="gap-2"
          size="lg"
          disabled={product.status === "OUT_OF_STOCK"}
        >
          <ShoppingCart className="h-5 w-5" />
          Tambah ke Keranjang
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11">
          <Heart className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
