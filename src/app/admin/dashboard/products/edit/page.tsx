"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductEditForm } from "@/components/pages/admin";
import { getProductById } from "@/actions/product-actions";
import { Toaster } from "@/components/ui/toaster";

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError("ID produk tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const { product: dbProduct, error: fetchError } = await getProductById(
          id
        );

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
    }

    fetchProduct();
  }, [id]);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Produk</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center py-20">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2.5"></div>
            <div className="h-10 bg-gray-200 rounded w-32 mx-auto mt-6"></div>
          </div>
        </div>
      ) : error ? (
        <div className="w-full flex flex-col justify-center items-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push("/admin/dashboard")}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      ) : !product ? (
        <div className="w-full flex flex-col justify-center items-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Produk Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Produk yang Anda cari tidak ditemukan.
            </p>
            <Button onClick={() => router.push("/admin/dashboard")}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <ProductEditForm product={product} />
      )}
      <Toaster />
    </div>
  );
}
