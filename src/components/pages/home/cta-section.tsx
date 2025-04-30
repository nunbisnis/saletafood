import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Siap Memesan?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Supplier food and beverage for Hotel
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link
            href="https://wa.me/6285747375614?text=Halo%20SaletaFood%2C%20saya%20tertarik%20dengan%20produk%20Anda.%20Boleh%20minta%20informasi%20lebih%20lanjut%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            Pesan Sekarang
          </Link>
        </Button>
      </div>
    </section>
  );
}
