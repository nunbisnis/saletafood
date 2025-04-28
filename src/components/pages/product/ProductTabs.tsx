import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/data/products";
import { Star } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
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
  );
}
