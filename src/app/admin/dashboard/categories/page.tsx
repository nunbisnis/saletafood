import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CategoriesTable } from "@/components/pages/admin";
import { PlusCircle } from "lucide-react";
import { getCategories } from "@/actions/category-actions";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Manajemen Kategori - SaletaFood Admin",
  description: "Kelola kategori produk di SaletaFood",
};

export default async function CategoriesPage() {
  // Check if user is authenticated
  const authResult = await auth();
  const user = await currentUser();

  if (!authResult.userId || !user) {
    redirect("/admin/login");
  }

  // Fetch categories from the database
  const { categories: dbCategories } = await getCategories();

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    (dbCategories || []).map(async (category) => {
      const count = await prisma.product.count({
        where: {
          categoryId: category.id,
        },
      });
      return {
        ...category,
        productsCount: count,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Manajemen Kategori
            </h1>
            <p className="text-muted-foreground">
              Kelola kategori produk di SaletaFood
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              asChild
            >
              <Link href="/admin/dashboard">Kembali</Link>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" asChild>
              <Link
                href="/admin/dashboard/categories/new"
                className="flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Link>
            </Button>
          </div>
        </div>

        {/* Categories Table */}
        <div className="rounded-md border">
          <CategoriesTable categories={categoriesWithCounts || []} />
        </div>
      </div>
    </div>
  );
}
