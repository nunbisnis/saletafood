"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditCategoryPageComponent } from "@/components/pages/admin";
import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Component that uses useSearchParams
function EditCategoryContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <EditCategoryPageComponent id={id} />;
}

export default function EditCategoryPage() {
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

      <Suspense
        fallback={
          <div className="w-full flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Memuat data kategori...
            </p>
          </div>
        }
      >
        <EditCategoryContent />
      </Suspense>
      <Toaster />
    </div>
  );
}
