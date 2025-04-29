"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/actions/product-actions";
import { Toaster } from "@/components/ui/toaster";
import { ProductEditForm, CategoryLoadingState, CategoryErrorState } from "@/components/pages/admin";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch product
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { product: dbProduct, error: fetchError } = await getProductById(id);

      if (fetchError) {
        setError(fetchError);
      } else if (!dbProduct) {
        setError("Produk tidak ditemukan");
      } else {
        setProduct(dbProduct);
        setError(null);
      }
    } catch (err) {
      setError("Gagal mengambil data produk");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product on component mount
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Handle refresh
  const handleRefresh = () => {
    fetchProduct();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <CategoryLoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <CategoryErrorState error={error} onRetry={handleRefresh} />
      </div>
    );
  }

  // Show not found state
  if (!product) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <CategoryErrorState error="Produk tidak ditemukan" onRetry={() => router.push("/admin/dashboard")} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <ProductEditForm product={product} />
      <Toaster />
    </div>
  );
}
