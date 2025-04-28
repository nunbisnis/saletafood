import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Kategori Tidak Ditemukan - SaletaFood",
  description: "Kategori yang Anda cari tidak ditemukan di SaletaFood",
};

export default function CategoryNotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <div className="relative h-48 w-full mb-6">
            <Image
              src="https://cdn.pixabay.com/photo/2017/06/29/20/09/mexican-2456038_1280.jpg"
              alt="Kategori Tidak Ditemukan"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">Oops!</h1>
            </div>
          </div>
          <CardTitle className="text-2xl">Kategori Tidak Ditemukan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Maaf, kategori yang Anda cari tidak dapat ditemukan. Silakan pilih
            dari kategori yang tersedia.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/produk/${category.name.toLowerCase()}`}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className={`p-2 rounded-full ${category.bgColor} mb-2`}>
                  <category.icon
                    className={`h-5 w-5 text-gradient bg-gradient-to-r ${category.color}`}
                  />
                </div>
                <span className="text-xs font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button size="lg" asChild className="w-full">
            <Link href="/produk">Lihat Semua Produk</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
