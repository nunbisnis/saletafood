import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Clock,
  Utensils,
  Flame,
  Leaf,
} from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
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
  );
}
