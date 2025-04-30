import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/pages/admin";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Tambah Kategori Baru - SaletaFood Admin",
  description: "Tambahkan kategori produk baru di SaletaFood",
};

export default async function NewCategoryPage() {
  // Check if user is authenticated
  const authResult = await auth();
  const user = await currentUser();

  if (!authResult.userId || !user) {
    redirect("/admin/login");
  }

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
          <h1 className="text-2xl font-bold tracking-tight">
            Tambah Kategori Baru
          </h1>
        </div>

        <CategoryForm />
      </div>
    </div>
  );
}
