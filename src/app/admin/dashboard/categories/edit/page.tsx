import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditCategoryPageComponent } from "@/components/pages/admin";
import { Toaster } from "@/components/ui/toaster";

export default function EditCategoryPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Kategori</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/categories">
            Kembali ke Daftar Kategori
          </Link>
        </Button>
      </div>

      <EditCategoryPageComponent id={id} />
      <Toaster />
    </div>
  );
}
