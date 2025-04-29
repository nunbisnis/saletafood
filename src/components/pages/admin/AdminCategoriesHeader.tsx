"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw, PlusCircle } from "lucide-react";
import { CategoryForm } from "./categories/CategoryForm";
import Link from "next/link";

interface AdminCategoriesHeaderProps {
  onRefresh: () => void;
  onCategoryAdded: () => void;
}

export function AdminCategoriesHeader({
  onRefresh,
  onCategoryAdded,
}: AdminCategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Manajemen Kategori</h1>
        <p className="text-muted-foreground mt-1">
          Kelola kategori produk Anda
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          onClick={onRefresh}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button asChild size="sm" className="flex-1 sm:flex-none">
          <Link href="/admin/dashboard/categories/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Link>
        </Button>
        <CategoryForm onSuccess={onCategoryAdded} />
      </div>
    </div>
  );
}
