"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CategoryEditForm } from "@/components/pages/admin";
import { getCategoryById } from "@/actions/category-actions";
import { Toaster } from "@/components/ui/toaster";

export default function EditCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      if (!id) {
        setError("ID kategori tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const result = await getCategoryById(id);

        if (!result) {
          setError("Gagal mengambil data kategori: Respons tidak valid");
          setLoading(false);
          return;
        }

        const { category: dbCategory, error: fetchError } = result;

        if (fetchError) {
          console.error("Error fetching category:", fetchError);
          setError(fetchError);
        } else if (!dbCategory) {
          console.error("Category not found in response");
          setError("Kategori tidak ditemukan");
        } else {
          setCategory(dbCategory);
          setError(null);
        }
      } catch (err) {
        setError("Gagal mengambil data kategori");
        console.error("Exception when fetching category:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [id]);

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

      {loading ? (
        <div className="w-full flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Memuat data kategori...</p>
        </div>
      ) : error ? (
        <div className="w-full flex flex-col justify-center items-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push("/admin/dashboard/categories")}>
              Kembali ke Daftar Kategori
            </Button>
          </div>
        </div>
      ) : !category ? (
        <div className="w-full flex flex-col justify-center items-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Kategori Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Kategori yang Anda cari tidak ditemukan.
            </p>
            <Button onClick={() => router.push("/admin/dashboard/categories")}>
              Kembali ke Daftar Kategori
            </Button>
          </div>
        </div>
      ) : (
        <CategoryEditForm category={category} />
      )}
      <Toaster />
    </div>
  );
}
