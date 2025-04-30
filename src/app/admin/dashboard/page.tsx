import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DashboardStats,
  ProductsTable,
  DashboardActions,
} from "@/components/pages/admin";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import { TagsIcon, ChevronRight } from "lucide-react";

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

  // Fetch categories from the database
  const { categories: dbCategories } = await getCategories();

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

  // Count products in each category
  const categoriesWithCounts = dbCategories
    ? await Promise.all(
        dbCategories.map(async (category) => {
          const count = dbProducts
            ? dbProducts.filter((p) => p.category.id === category.id).length
            : 0;
          return {
            ...category,
            productsCount: count,
          };
        })
      )
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

      {/* Categories Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TagsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold">
              Manajemen Kategori
            </h2>
          </div>
          <Button asChild>
            <Link
              href="/admin/dashboard/categories"
              className="flex items-center gap-2"
            >
              Lihat Semua Kategori
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoriesWithCounts.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/admin/dashboard/categories/edit/${category.slug}`}
              className="block"
            >
              <div className="border rounded-lg p-4 hover:border-primary hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-primary">{category.name}</h3>
                  {category.image ? (
                    <div className="h-8 w-8 relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 flex items-center justify-center bg-muted rounded">
                      <TagsIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.productsCount} produk
                </p>
              </div>
            </Link>
          ))}

          <Link href="/admin/dashboard/categories/new" className="block">
            <div className="border border-dashed rounded-lg p-4 hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center h-full">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <TagsIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium text-center">Tambah Kategori Baru</p>
            </div>
          </Link>
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
