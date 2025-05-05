import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  DashboardStats,
  ProductsTable,
  DashboardActions,
} from "@/components/pages/admin";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/actions/product-actions";
import { Edit } from "lucide-react";

// Function to map database product status to UI status
function mapProductStatus(status: string): string {
  switch (status) {
    case "AVAILABLE":
      return "Tersedia";
    case "LOW_STOCK":
      return "Stok Menipis";
    case "OUT_OF_STOCK":
      return "Habis";
    default:
      return "Tersedia";
  }
}

export default async function AdminDashboardPage() {
  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    redirect("/admin/login");
  }

  // Get user details
  const user = await currentUser();

  // Fetch products from the database
  const { products: dbProducts } = await getProducts();

  // Map database products to the format expected by the components
  const products = dbProducts
    ? dbProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price, // Price is already serialized in getProducts
        category: product.category.name,
        status: mapProductStatus(product.status),
        slug: product.slug,
      }))
    : [];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang, {user?.firstName || "Admin"}!
          </p>
        </div>
        <DashboardActions />
      </div>

      {/* Stats Cards */}
      <DashboardStats products={products} />

      {/* Website Settings Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Pengaturan Website
            </h2>
            <p className="text-muted-foreground mt-1">
              Kelola konten dan tampilan website
            </p>
          </div>
          <Button asChild>
            <a href="/admin/dashboard/settings" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit Hero Section
            </a>
          </Button>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Manajemen Produk</h2>
          <div className="w-full sm:w-auto flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Filter
            </Button>
          </div>
        </div>

        <ProductsTable products={products} />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <p className="text-muted-foreground">
            Menampilkan 1-{products.length} dari {products.length} produk
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled>
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
