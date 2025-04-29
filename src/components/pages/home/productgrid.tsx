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
import { getProducts } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";

// Helper function to map database status to UI status - used in the product cards
function mapProductStatus(status: string): string {
  switch (status) {
    case "AVAILABLE":
      return "Tersedia";
    case "LOW_STOCK":
      return "Stok Menipis";
    case "OUT_OF_STOCK":
      return "Habis";
    default:
      return "Tersedia";
  }
}

// No need for explicit interfaces as we're using the types inferred from the API responses

export async function ProductGrid() {
  const { products } = await getProducts();
  const { categories } = await getCategories();

  // Handle error or no products/categories
  const allProducts = products || [];
  const allCategories = categories || [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Kategori Produk</h2>
              <p className="text-muted-foreground mt-2">
                Jelajahi berbagai kategori produk kami
              </p>
            </div>
            <Link
              href="/produk"
              className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
            >
              Lihat Semua Kategori
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {allCategories.length > 0 ? (
              allCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/produk/${category.slug}`}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-3 rounded-full bg-primary/10 mb-2">
                    <div className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.productCount || 0} produk
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  Belum ada kategori tersedia
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Semua Produk</h2>
              <p className="text-muted-foreground mt-2">
                Temukan produk berkualitas dari kami
              </p>
            </div>
            <Link
              href="/produk"
              className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
            >
              Lihat Detail Produk
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.length > 0 ? (
              allProducts.slice(0, 8).map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-border/40"
                >
                  <Link href={`/detail/${item.slug}`} className="block">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.status === "LOW_STOCK" && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          {mapProductStatus(item.status)}
                        </div>
                      )}
                      {item.status === "OUT_OF_STOCK" && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {mapProductStatus(item.status)}
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardHeader className="pb-2">
                    <Link href={`/detail/${item.slug}`} className="block">
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
                      Rp{parseFloat(item.price.toString()).toFixed(3)}
                    </span>
                    <Button size="sm" className="gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden sm:inline">Keranjang</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada produk tersedia
                </p>
              </div>
            )}
          </div>

          {allProducts.length > 0 && (
            <div className="mt-12 text-center">
              <Button asChild>
                <Link href="/produk">Lihat Semua Produk</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
