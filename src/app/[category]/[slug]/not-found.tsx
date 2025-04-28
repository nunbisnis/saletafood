import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-muted">
              <PackageX className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-muted-foreground">
            Maaf, produk yang Anda cari tidak dapat ditemukan. Produk mungkin
            telah dihapus atau belum tersedia.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button size="lg" asChild className="w-full">
            <Link href="/produk">Lihat Produk Kami</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
