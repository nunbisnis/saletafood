import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHeroSettings } from "@/actions/settings-actions";

export async function HeroSection() {
  // Fetch hero settings from the database
  const { title, description, imageUrl } = await getHeroSettings();

  return (
    <section className="relative h-[500px] w-full">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Image
        src={imageUrl}
        alt="SaletaFood Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">{description}</p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link
              href="https://wa.me/6285747375614?text=Halo%20SaletaFood%2C%20saya%20tertarik%20dengan%20produk%20Anda.%20Boleh%20minta%20informasi%20lebih%20lanjut%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Pesan Sekarang
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white/80"
          >
            <Link href="/produk" className="flex items-center justify-center">
              Lihat Produk
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
