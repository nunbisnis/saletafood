import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackToProducts() {
  return (
    <div className="mt-12 text-center">
      <Button variant="outline" asChild>
        <Link href="/produk" className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Semua Produk
        </Link>
      </Button>
    </div>
  );
}
