import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader() {
  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <nav className="flex mb-4 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Beranda
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium">Kategori</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold">Semua Kategori</h1>
          <p className="text-muted-foreground mt-2">
            Jelajahi berbagai kategori produk kami
          </p>
        </div>
        <Link
          href="/produk"
          className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
        >
          Lihat Semua Produk
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
