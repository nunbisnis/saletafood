import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardStats, ProductsTable } from "@/components/pages/admin";

// Sample product data
const products = [
  {
    id: 1,
    name: "Burger Ayam Pedas",
    price: 89.99,
    category: "Burger",
    status: "Tersedia",
  },
  {
    id: 2,
    name: "Pizza Sayur Supreme",
    price: 129.99,
    category: "Pizza",
    status: "Tersedia",
  },
  {
    id: 3,
    name: "Burger Sapi Klasik",
    price: 99.99,
    category: "Burger",
    status: "Stok Menipis",
  },
  {
    id: 4,
    name: "Salmon Panggang",
    price: 159.99,
    category: "Makanan Utama",
    status: "Tersedia",
  },
  {
    id: 5,
    name: "Brownies Coklat",
    price: 49.99,
    category: "Dessert",
    status: "Habis",
  },
];

export default async function AdminDashboardPage() {
  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    redirect("/admin/login");
  }

  // Get user details
  const user = await currentUser();

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang, {user?.firstName || "Admin"}!
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/products/new">Tambah Produk Baru</Link>
        </Button>
      </div>

      <DashboardStats products={products} />

      <h2 className="text-2xl font-bold mb-6">Manajemen Produk</h2>

      <ProductsTable products={products} />
    </div>
  );
}
