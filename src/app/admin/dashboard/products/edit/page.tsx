"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductEditForm, ProductFormSkeleton } from "@/components/pages/admin";
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

      console.log("Fetching product with ID:", id);

      try {
        const result = await getProductById(id);

        console.log("API response:", result);

        // Check if result is undefined or null
        if (!result) {
          setError("Gagal mengambil data produk: Respons tidak valid");
          console.error("getProductById returned undefined or null");
          setLoading(false);
          return;
        }

        const { product: dbProduct, error: fetchError } = result;

        if (fetchError) {
          console.error("Error fetching product:", fetchError);
          setError(fetchError);
        } else if (!dbProduct) {
          console.error("Product not found in response");
          setError("Produk tidak ditemukan");
        } else {
          console.log("Product found:", dbProduct);
          console.log("Product images:", dbProduct.images);

          // Ensure images is always an array
          const productWithImages = {
            ...dbProduct,
            images: Array.isArray(dbProduct.images) ? dbProduct.images : [],
          };

          console.log("Product with fixed images:", productWithImages);
          setProduct(productWithImages);
          setError(null);
        }
      } catch (err) {
        setError("Gagal mengambil data produk");
        console.error("Exception when fetching product:", err);
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
        <ProductFormSkeleton />
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
