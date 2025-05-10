"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const currentFilter = searchParams.get("filter") || "all";
  
  // Update URL with new filter value
  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }

    // Keep the search parameter if it exists
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    router.push(`/admin/dashboard?${params.toString()}`);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    
    // Keep the filter parameter if it exists
    if (currentFilter !== "all") {
      params.set("filter", currentFilter);
    }
    
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  return (
    <div className="w-full sm:w-auto flex gap-2">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:flex-none">
        <Input
          type="text"
          placeholder="Cari produk..."
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
      
      <Select defaultValue={currentFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[120px] whitespace-nowrap">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Produk</SelectItem>
          <SelectItem value="Tersedia">Tersedia</SelectItem>
          <SelectItem value="Stok Menipis">Stok Menipis</SelectItem>
          <SelectItem value="Habis">Habis</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Wrapped component with Suspense for use in server components
export function ProductFiltersWithSuspense() {
  return (
    <Suspense fallback={
      <div className="w-full sm:w-auto flex gap-2">
        <div className="relative flex-1 sm:flex-none">
          <div className="w-full h-9 bg-gray-100 rounded-md animate-pulse"></div>
        </div>
        <div className="w-[120px] h-9 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    }>
      <ProductFilters />
    </Suspense>
  );
}
