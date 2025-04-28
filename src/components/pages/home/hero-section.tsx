import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative h-[500px] w-full">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Image
        src="https://cdn.pixabay.com/photo/2017/04/04/01/08/fruits-2200001_1280.jpg"
        alt="Makanan Lezat"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Makanan Lezat Diantar
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Bahan segar, rasa luar biasa, diantar ke rumah Anda
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/produk">Pesan Sekarang</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white/10"
          >
            <Link href="/produk">Lihat Produk</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
