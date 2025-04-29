"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm, ProductFormSkeleton } from "@/components/pages/admin";
import { Toaster } from "@/components/ui/toaster";

export default function NewProductPage() {
  const [loading, setLoading] = useState(true);

  // Simulate loading for a better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>

      {loading ? <ProductFormSkeleton /> : <ProductForm />}
      <Toaster />
    </div>
  );
}
