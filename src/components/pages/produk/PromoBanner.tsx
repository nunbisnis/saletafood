import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
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
              Dapatkan diskon 20% untuk pembelian produk apa saja dengan minimal
              pembelian Rp100.000
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link
                href="https://wa.me/6285747375614?text=Halo%20SaletaFood%2C%20saya%20tertarik%20dengan%20promo%20spesial%20bulan%20ini.%20Boleh%20minta%20informasi%20lebih%20lanjut%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Pesan Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
