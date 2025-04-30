import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/pages/admin";
import { ChevronLeft } from "lucide-react";
import { getCategoryBySlug } from "@/actions/category-actions";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Edit Kategori - SaletaFood Admin",
  description: "Edit kategori produk di SaletaFood",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Check if user is authenticated
  const authResult = await auth();
  const user = await currentUser();

  if (!authResult.userId || !user) {
    redirect("/admin/login");
  }

  // Await params before accessing its properties
  const { slug } = await params;

  // Fetch category data
  const { category, error } = await getCategoryBySlug(slug);

  if (error || !category) {
    redirect("/admin/dashboard/categories");
  }

  // Get product count for this category
  const productsCount = await prisma.product.count({
    where: {
      categoryId: category.id,
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href="/admin/dashboard/categories"
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Kembali</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Kategori</h1>
        </div>

        {productsCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
            <p className="text-sm">
              <strong>Info:</strong> Kategori ini memiliki {productsCount}{" "}
              produk terkait.
            </p>
          </div>
        )}

        <CategoryForm categoryData={category} isEditing={true} />
      </div>
    </div>
  );
}
