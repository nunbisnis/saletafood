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
import { Star, ShoppingCart, ChevronRight } from "lucide-react";
import { getFeaturedProducts } from "@/data/products";

export function FeaturedItems() {
  const featuredItems = getFeaturedProducts();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold">Produk Unggulan</h2>
            <p className="text-muted-foreground mt-2">
              Pilihan terbaik dari chef kami
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-border/40"
            >
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.status === "Stok Menipis" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Stok Menipis
                    </div>
                  )}
                  {item.status === "Habis" && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Habis
                    </div>
                  )}
                </div>
              </Link>

              <CardHeader className="pb-2">
                <Link href={`/products/${item.slug}`} className="block">
                  <CardTitle className="text-lg hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>
                </Link>
                <div className="flex items-center mt-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating || 0)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({item.reviews} ulasan)
                  </span>
                </div>
                <CardDescription className="line-clamp-2 text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between pt-0">
                <span className="text-lg font-bold text-primary">
                  Rp{item.price.toFixed(3)}
                </span>
                <Button size="sm" className="gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Keranjang</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/produk">Lihat Semua Produk</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
