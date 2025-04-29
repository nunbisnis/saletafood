"use client";

import { CategoryTable } from "./CategoryTable";
import { CategoryForm } from "./CategoryForm";
import { Button } from "@/components/ui/button";

interface CategoryListProps {
  categories: any[];
  onCategoryDeleted: () => void;
  onCategoryAdded: () => void;
}

export function CategoryList({
  categories,
  onCategoryDeleted,
  onCategoryAdded,
}: CategoryListProps) {
  return (
    <div className="bg-card rounded-lg border p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Daftar Kategori</h2>
        <div className="w-full sm:w-auto flex gap-2">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Cari kategori..."
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Filter
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/20">
          <p className="text-muted-foreground mb-4">Belum ada kategori</p>
          <CategoryForm onSuccess={onCategoryAdded} />
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onCategoryDeleted={onCategoryDeleted}
        />
      )}
    </div>
  );
}
