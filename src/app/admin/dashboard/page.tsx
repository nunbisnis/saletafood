import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {products.filter((p) => p.status === "Habis").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {products.filter((p) => p.status === "Stok Menipis").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Manajemen Produk</h2>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Harga
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3 text-sm">{product.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    Rp{product.price.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "Tersedia"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Stok Menipis"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/dashboard/products/${product.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm">
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
