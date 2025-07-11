import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/pages/admin";

export default function NewProductPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>

      <ProductForm />
    </div>
  );
}
