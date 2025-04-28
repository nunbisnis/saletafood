import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan - SaletaFood",
  description: "Halaman yang Anda cari tidak ditemukan di SaletaFood",
};

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <div className="relative h-48 w-full mb-6">
            <Image
              src="https://cdn.pixabay.com/photo/2016/12/20/05/24/pizza-1919746_1280.jpg"
              alt="Makanan Tidak Ditemukan"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <h1 className="text-6xl font-bold text-white">404</h1>
            </div>
          </div>
          <CardTitle className="text-2xl">Halaman Tidak Ditemukan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
