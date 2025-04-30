"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter and sort values from URL
  const currentFilter = searchParams.get("filter") || "all";
  const currentSort = searchParams.get("sort") || "default";

  // Update URL with new filter value
  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }

    router.push(`?${params.toString()}`);
  };

  // Update URL with new sort value
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Filter */}
      <div className="flex items-center">
        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
        <Select defaultValue={currentFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Produk</SelectItem>
            <SelectItem value="available">Tersedia</SelectItem>
            <SelectItem value="low-stock">Stok Menipis</SelectItem>
            <SelectItem value="out-of-stock">Habis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center">
        <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
        <Select defaultValue={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
            <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
            <SelectItem value="name-asc">Nama: A-Z</SelectItem>
            <SelectItem value="name-desc">Nama: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
