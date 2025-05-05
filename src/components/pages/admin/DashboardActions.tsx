"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw, TagsIcon, Settings } from "lucide-react";

export function DashboardActions() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    // Refresh the current route
    router.refresh();

    // Reset the refreshing state after a short delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none flex items-center justify-center"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCcw
          className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span>{isRefreshing ? "Memuat..." : "Refresh"}</span>
      </Button>
      <Button size="sm" className="flex-1 sm:flex-none" asChild>
        <Link
          href="/admin/dashboard/products/new"
          className="flex items-center justify-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Tambah Produk</span>
        </Link>
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="flex-1 sm:flex-none"
        asChild
      >
        <Link
          href="/admin/dashboard/categories"
          className="flex items-center justify-center"
        >
          <TagsIcon className="h-4 w-4 mr-2" />
          <span>Kelola Kategori</span>
        </Link>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex-1 sm:flex-none"
        asChild
      >
        <Link
          href="/admin/dashboard/settings"
          className="flex items-center justify-center"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span>Pengaturan</span>
        </Link>
      </Button>
    </div>
  );
}
