import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedCategories() {
  return (
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
  );
}
