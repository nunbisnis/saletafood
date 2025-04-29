"use client";

import { getCategories } from "@/actions/category-actions";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import {
  AdminCategoriesHeader,
  CategoryList,
  CategoryPagination,
  CategoryLoadingState,
  CategoryErrorState,
} from "@/components/pages/admin";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { categories: dbCategories, error: fetchError } =
        await getCategories();

      if (fetchError) {
        setError(fetchError);
      } else {
        setCategories(dbCategories || []);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchCategories();
  };

  // Handle category deleted
  const handleCategoryDeleted = () => {
    fetchCategories();
  };

  // Handle category added
  const handleCategoryAdded = () => {
    fetchCategories();
  };

  // Show loading state
  if (loading && categories.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <AdminCategoriesHeader
          onRefresh={handleRefresh}
          onCategoryAdded={handleCategoryAdded}
        />
        <CategoryLoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <AdminCategoriesHeader
          onRefresh={handleRefresh}
          onCategoryAdded={handleCategoryAdded}
        />
        <CategoryErrorState error={error} onRetry={handleRefresh} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <AdminCategoriesHeader
        onRefresh={handleRefresh}
        onCategoryAdded={handleCategoryAdded}
      />

      <CategoryList
        categories={categories}
        onCategoryDeleted={handleCategoryDeleted}
        onCategoryAdded={handleCategoryAdded}
      />

      {categories.length > 0 && (
        <CategoryPagination totalItems={categories.length} />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
