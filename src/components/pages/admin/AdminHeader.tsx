import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">SaletaFood Admin</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/admin/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/products"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Produk
          </Link>
          <Link
            href="/admin/dashboard/orders"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pesanan
          </Link>
          <Link
            href="/admin/dashboard/customers"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pelanggan
          </Link>
          <Link
            href="/admin/dashboard/settings"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pengaturan
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Lihat Situs
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
