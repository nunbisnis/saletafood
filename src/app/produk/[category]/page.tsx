import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Star,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Filter,
} from "lucide-react";
import { ProductFilters } from "@/components/product/product-filters";
import { getProductsByCategory } from "@/data/products";
import { categories } from "@/data/categories";

type Props = {
  params: {
    category: string;
  };
  searchParams: {
    sort?: string;
    filter?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Find the category from our categories data
  const categoryName = decodeURIComponent(params.category);
  const category = categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan - SaletaFood",
    };
  }

  return {
    title: `${category.name} - SaletaFood`,
    description: `Jelajahi menu ${category.name} kami yang lezat. ${category.description}`,
  };
}

export default function CategoryPage({ params, searchParams }: Props) {
  // Get the category name from the URL
  const categoryName = decodeURIComponent(params.category);

  // Find the category from our categories data
  const category = categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }

  // Get products for this category
  let products = getProductsByCategory(category.name);

  // Apply sorting if specified
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price-low":
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products = [...products].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        products = [...products].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        break;
      default:
        break;
    }
  }

  // Apply filtering if specified
  if (searchParams.filter) {
    switch (searchParams.filter) {
      case "available":
        products = products.filter((p) => p.status === "Tersedia");
        break;
      case "low-stock":
        products = products.filter((p) => p.status === "Stok Menipis");
        break;
      case "out-of-stock":
        products = products.filter((p) => p.status === "Habis");
        break;
      default:
        break;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Beranda
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li>
            <Link
              href="/produk"
              className="text-muted-foreground hover:text-primary"
            >
              Produk
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-foreground font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container px-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${category.bgColor}`}>
                <category.icon
                  className={`h-8 w-8 text-gradient bg-gradient-to-r ${category.color}`}
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {category.name}
                </h1>
                <p className="text-white/80 max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Produk {category.name}</h2>
          <p className="text-muted-foreground">
            Menampilkan {products.length} item
          </p>
        </div>

        <ProductFilters />
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-border/40"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.status === "Stok Menipis" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Stok Menipis
                    </div>
                  )}
                  {product.status === "Habis" && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Habis
                    </div>
                  )}
                </div>
              </Link>

              <CardHeader className="pb-2">
                <Link href={`/products/${product.slug}`} className="block">
                  <CardTitle className="text-lg hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </Link>

                {product.rating && (
                  <div className="flex items-center mt-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({product.reviews} ulasan)
                    </span>
                  </div>
                )}

                <CardDescription className="line-clamp-2 text-sm">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between pt-0">
                <span className="text-lg font-bold text-primary">
                  Rp{product.price.toFixed(3)}
                </span>
                <Button
                  size="sm"
                  className="gap-1"
                  disabled={product.status === "Habis"}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Keranjang</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4 text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-xl font-medium">
              Tidak ada produk yang ditemukan
            </h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Tidak ada produk yang cocok dengan filter yang Anda pilih.
          </p>
          <Button asChild variant="outline">
            <Link href={`/produk/${categoryName.toLowerCase()}`}>
              Reset Filter
            </Link>
          </Button>
        </div>
      )}

      {/* Navigation to other categories */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-bold mb-6">Kategori Lainnya</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories
            .filter(
              (cat) => cat.name.toLowerCase() !== categoryName.toLowerCase()
            )
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/produk/${cat.name.toLowerCase()}`}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
              >
                <div className={`p-3 rounded-full ${cat.bgColor} mb-2`}>
                  <cat.icon
                    className={`h-6 w-6 text-gradient bg-gradient-to-r ${cat.color}`}
                  />
                </div>
                <span className="text-sm font-medium text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
        </div>
      </div>

      {/* Back to Produk */}
      <div className="mt-12 text-center">
        <Button variant="outline" asChild>
          <Link href="/produk" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali ke Semua Produk
          </Link>
        </Button>
      </div>
    </div>
  );
}
