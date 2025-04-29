import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewCategoryForm } from "@/components/pages/admin";
import { Toaster } from "@/components/ui/toaster";

export default function NewCategoryPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tambah Kategori Baru</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/categories">
            Kembali ke Daftar Kategori
          </Link>
        </Button>
      </div>

      <NewCategoryForm />
      <Toaster />
    </div>
  );
}
