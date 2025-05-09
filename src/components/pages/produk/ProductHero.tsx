import Image from "next/image";
import { ProductSearch } from "@/components/layout/product-search";

export function ProductHero() {
  return (
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
              Produk Saleta Food
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
  );
}
