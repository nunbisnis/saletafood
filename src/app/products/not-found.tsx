import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk Tidak Ditemukan - SaletaFood",
  description: "Produk yang Anda cari tidak ditemukan di SaletaFood",
};

export default function ProductNotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <div className="relative h-48 w-full mb-6">
            <Image
              src="https://cdn.pixabay.com/photo/2017/06/29/20/09/mexican-2456038_1280.jpg"
              alt="Produk Tidak Ditemukan"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">Oops!</h1>
            </div>
          </div>
          <CardTitle className="text-2xl">Produk Tidak Ditemukan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Maaf, produk yang Anda cari tidak dapat ditemukan. Produk mungkin telah dihapus atau belum tersedia.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button size="lg" asChild className="w-full">
            <Link href="/menu">Lihat Menu Kami</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
