import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Siap Memesan?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Nikmati makanan lezat diantar langsung ke rumah Anda
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/produk">Pesan Sekarang</Link>
        </Button>
      </div>
    </section>
  );
}
