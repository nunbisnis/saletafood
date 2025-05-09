import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHeroSettings } from "@/actions/settings-actions";
import { cn } from "@/lib/utils";

export async function HeroSection() {
  // Fetch hero settings from the database
  const { title, description, imageUrl } = await getHeroSettings();

  return (
    <section className="relative h-[60vh] md:h-[100vh] w-full">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Image
        src={imageUrl}
        alt="SaletaFood Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-center text-white px-4 md:px-0">
        <h1
          className={cn(
            "text-5xl md:text-7xl font-bold mb-4 md:mb-6 px-2 md:px-0",
            "animate-fade-up [animation-delay:100ms]"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-xl md:text-3xl mb-8 md:mb-10 max-w-3xl px-2 md:px-0",
            "animate-fade-up [animation-delay:300ms]"
          )}
        >
          {description}
        </p>
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto",
            "animate-fade-up [animation-delay:500ms]"
          )}
        >
          <Button
            size="lg"
            className="text-lg px-6 py-6 w-full sm:w-auto"
            asChild
          >
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
            className="bg-transparent text-white border-white hover:bg-white/80 text-lg px-6 py-6 w-full sm:w-auto"
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
