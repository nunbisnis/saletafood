import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/pages/admin";
import { getProductBySlug } from "@/actions/product-actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // Await the params object to get the slug
  const { slug } = await params;
  const { product, error } = await getProductBySlug(slug);

  if (error || !product) {
    notFound();
  }

  // Convert Decimal price to string to avoid serialization issues
  const serializedProduct = {
    ...product,
    price: product.price.toString(),
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Produk</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>

      <ProductForm productData={serializedProduct} isEditing={true} />
    </div>
  );
}
