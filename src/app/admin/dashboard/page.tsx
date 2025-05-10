import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  DashboardStats,
  ProductsTable,
  DashboardActions,
  ProductFiltersWithSuspense,
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

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>;
}) {
  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    redirect("/admin/login");
  }

  // Get user details
  const user = await currentUser();

  // Get search and filter parameters
  const params = await searchParams;
  const searchQuery = params.search || "";
  const filterValue = params.filter || "";

  // Fetch products from the database
  const { products: dbProducts } = await getProducts(undefined, searchQuery);

  // Map database products to the format expected by the components
  let products = dbProducts
    ? dbProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price, // Price is already serialized in getProducts
        category: product.category.name,
        status: mapProductStatus(product.status),
        slug: product.slug,
      }))
    : [];

  // Apply filtering if specified
  if (filterValue && filterValue !== "all") {
    products = products.filter((product) => product.status === filterValue);
  }

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
              Edit Title Beranda
            </a>
          </Button>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Manajemen Produk</h2>
          <ProductFiltersWithSuspense />
        </div>

        <ProductsTable products={products} />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <p className="text-muted-foreground">
            {products.length > 0
              ? `Menampilkan 1-${products.length} dari ${products.length} produk`
              : "Tidak ada produk yang ditemukan"}
            {searchQuery && ` untuk pencarian "${searchQuery}"`}
            {filterValue &&
              filterValue !== "all" &&
              ` dengan filter "${filterValue}"`}
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
