"use client";

import { useEffect, useState } from "react";
import { getCategoryById } from "@/actions/category-actions";
import { Toaster } from "@/components/ui/toaster";
import { CategoryEditForm, CategoryLoadingState, CategoryErrorState } from "@/components/pages/admin";
import { useRouter } from "next/navigation";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch category
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const { category: dbCategory, error: fetchError } = await getCategoryById(id);

      if (fetchError) {
        setError(fetchError);
      } else if (!dbCategory) {
        setError("Kategori tidak ditemukan");
      } else {
        setCategory(dbCategory);
        setError(null);
      }
    } catch (err) {
      setError("Gagal mengambil data kategori");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category on component mount
  useEffect(() => {
    fetchCategory();
  }, [id]);

  // Handle refresh
  const handleRefresh = () => {
    fetchCategory();
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
  if (!category) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <CategoryErrorState error="Kategori tidak ditemukan" onRetry={() => router.push("/admin/dashboard/categories")} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <CategoryEditForm category={category} />
      <Toaster />
    </div>
  );
}
