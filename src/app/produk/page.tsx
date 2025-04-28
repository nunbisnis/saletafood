import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ProductSearch } from "@/components/product/product-search";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = {
  title: "Produk - SaletaFood",
  description:
    "Jelajahi produk lengkap kami dengan berbagai pilihan makanan dan minuman lezat",
};

export default function ProdukPage() {
  // Update category counts from actual product data
  const categoriesWithCounts = categories.map((category) => {
    const count = getProductsByCategory(category.name).length;
    return {
      ...category,
      count: count || 0,
    };
  });

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
          <li className="text-foreground font-medium">Produk</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-12">
        <Image
          src="https://cdn.pixabay.com/photo/2017/02/15/10/39/food-2068217_1280.jpg"
          alt="Produk SaletaFood"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container px-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Produk SaletaFood
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Jelajahi berbagai pilihan makanan dan minuman lezat kami
              </p>

              {/* Search Bar */}
              <ProductSearch />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Kategori Produk</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category) => (
            <Link
              key={category.id}
              href={`/produk/${category.name.toLowerCase()}`}
              className="block group"
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/40 h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className={`absolute top-4 left-4 p-2 rounded-full ${category.bgColor}`}
                  >
                    <category.icon
                      className={`h-6 w-6 text-gradient bg-gradient-to-r ${category.color}`}
                    />
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {category.count} item
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="mt-auto">
                    <span className="text-primary font-medium flex items-center text-sm group-hover:underline">
                      Lihat Produk
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Produk Populer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Burger Featured */}
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <Image
              src="https://cdn.pixabay.com/photo/2019/01/29/18/05/burger-3962996_1280.jpg"
              alt="Burger"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Burger Spesial
              </h3>
              <p className="text-white/80 mb-4 max-w-xs">
                Nikmati burger juicy dengan berbagai pilihan topping
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link href="/produk/burger">Lihat Produk Burger</Link>
              </Button>
            </div>
          </div>

          {/* Pizza Featured */}
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <Image
              src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg"
              alt="Pizza"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Pizza Premium
              </h3>
              <p className="text-white/80 mb-4 max-w-xs">
                Pizza dengan adonan tipis dan topping premium
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link href="/produk/pizza">Lihat Produk Pizza</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-16">
        <Image
          src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg"
          alt="Promo SaletaFood"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 flex items-center">
          <div className="container px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Promo Spesial Bulan Ini
              </h2>
              <p className="text-white/90 mb-6">
                Dapatkan diskon 20% untuk pembelian produk apa saja dengan
                minimal pembelian Rp100.000
              </p>
              <Button variant="secondary" size="lg">
                Pesan Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {categoriesWithCounts.map((category) => (
          <Link
            key={category.id}
            href={`/produk/${category.name.toLowerCase()}`}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className={`p-3 rounded-full ${category.bgColor} mb-2`}>
              <category.icon
                className={`h-6 w-6 text-gradient bg-gradient-to-r ${category.color}`}
              />
            </div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
