import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/pages/admin";
import { getProductBySlug } from "@/actions/product-actions";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: {
    slug: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = params;
  const { product, error } = await getProductBySlug(slug);

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Produk</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>

      <ProductForm productData={product} isEditing={true} />
    </div>
  );
}
