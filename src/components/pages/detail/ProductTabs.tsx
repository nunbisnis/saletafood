import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Product } from "@/types/product";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  // Default rating value for consistency
  const defaultRating = 0;

  return (
    <Tabs defaultValue="ingredients" className="mb-16">
      <TabsList className="mb-6">
        <TabsTrigger value="ingredients">Bahan</TabsTrigger>
        <TabsTrigger value="reviews">Ulasan</TabsTrigger>
      </TabsList>

      <TabsContent value="ingredients" className="p-6 bg-muted/30 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Bahan-bahan</h3>
        {product.ingredients && product.ingredients.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {product.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Tidak ada informasi bahan yang tersedia untuk produk ini.
          </p>
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
                  i < Math.floor(product.rating || defaultRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-medium ml-2">
            {product.rating || defaultRating} dari 5
          </span>
          <span className="text-muted-foreground ml-2">
            ({product.reviews || 0} ulasan)
          </span>
        </div>
        <p className="text-muted-foreground">
          Belum ada ulasan yang ditampilkan. Jadilah yang pertama memberikan
          ulasan!
        </p>
      </TabsContent>
    </Tabs>
  );
}
