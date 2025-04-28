import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ShoppingCart,
  ChevronRight,
  Heart,
  Share2,
  Clock,
  Utensils,
  Flame,
  Leaf,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { categories } from "@/data/categories";

type Props = {
  params: {
    category: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan - SaletaFood",
    };
  }

  return {
    title: `${product.name} - SaletaFood`,
    description: product.description.substring(0, 160),
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Verify that the product is in the correct category
  const categoryParam = decodeURIComponent(params.category).toLowerCase();
  const productCategory = product.category.toLowerCase();

  if (categoryParam !== productCategory) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

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
          <li>
            <Link
              href={`/produk/${product.category.toLowerCase()}`}
              className="text-muted-foreground hover:text-primary"
            >
              {product.category}
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative">
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.status === "Stok Menipis" && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Stok Menipis
              </div>
            )}
            {product.status === "Habis" && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Habis
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              ({product.reviews} ulasan)
            </span>
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center mb-8">
            <span className="text-3xl font-bold text-primary mr-4">
              Rp{product.price.toFixed(3)}
            </span>
            {product.status === "Tersedia" && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Tersedia
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
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
              disabled={product.status === "Habis"}
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

          {/* Nutrition Facts */}
          {product.nutritionFacts && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                <div className="text-sm font-medium">
                  {product.nutritionFacts.calories}
                </div>
                <div className="text-xs text-muted-foreground">Kalori</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <Utensils className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <div className="text-sm font-medium">
                  {product.nutritionFacts.protein}g
                </div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <Leaf className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <div className="text-sm font-medium">
                  {product.nutritionFacts.carbs}g
                </div>
                <div className="text-xs text-muted-foreground">Karbohidrat</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                <div className="text-sm font-medium">
                  {product.nutritionFacts.fat}g
                </div>
                <div className="text-xs text-muted-foreground">Lemak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="ingredients" className="mb-16">
        <TabsList className="mb-6">
          <TabsTrigger value="ingredients">Bahan</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrisi</TabsTrigger>
          <TabsTrigger value="reviews">Ulasan</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="p-6 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Bahan-bahan</h3>
          {product.ingredients && (
            <ul className="list-disc pl-5 space-y-2">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="nutrition" className="p-6 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Informasi Nutrisi</h3>
          {product.nutritionFacts && (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span>Kalori</span>
                <span className="font-medium">
                  {product.nutritionFacts.calories} kkal
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Protein</span>
                <span className="font-medium">
                  {product.nutritionFacts.protein}g
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Karbohidrat</span>
                <span className="font-medium">
                  {product.nutritionFacts.carbs}g
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Lemak</span>
                <span className="font-medium">
                  {product.nutritionFacts.fat}g
                </span>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="p-6 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Ulasan Pelanggan</h3>
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium ml-2">
              {product.rating} dari 5
            </span>
            <span className="text-muted-foreground ml-2">
              ({product.reviews} ulasan)
            </span>
          </div>
          <p className="text-muted-foreground">
            Belum ada ulasan yang ditampilkan. Jadilah yang pertama memberikan
            ulasan!
          </p>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
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
              <Card
                key={item.id}
                className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-border/40"
              >
                <Link href={`/${item.category.toLowerCase()}/${item.slug}`} className="block">
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
                  <Link href={`/${item.category.toLowerCase()}/${item.slug}`} className="block">
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {item.name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="line-clamp-2 text-sm">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-between pt-0">
                  <span className="text-lg font-bold text-primary">
                    Rp{item.price.toFixed(3)}
                  </span>
                  <Button
                    size="sm"
                    className="gap-1"
                    disabled={item.status === "Habis"}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Keranjang</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
