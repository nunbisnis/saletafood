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

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-border/40 pt-0">
      <Link href={`/detail/${product.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : product.image || "/placeholder-image.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.status === "LOW_STOCK" && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Stok Menipis
            </div>
          )}
          {product.status === "OUT_OF_STOCK" && (
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

      <CardFooter className="flex flex-col gap-3 pt-0">
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
          className="w-full"
          disabled={product.status === "OUT_OF_STOCK"}
          asChild
        >
          <Link
            href={`https://wa.me/6285747375614?text=Halo%20SaletaFood%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
              product.name
            )}.%20Boleh%20minta%20informasi%20lebih%20lanjut%3F`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1"
          >
            <ShoppingCart className="h-4 w-4 flex-shrink-0" />
            <span>Pesan Sekarang</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
