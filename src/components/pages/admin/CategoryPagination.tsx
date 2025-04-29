"use client";

import { Button } from "@/components/ui/button";

interface CategoryPaginationProps {
  totalItems: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export function CategoryPagination({
  totalItems,
  currentPage = 1,
  itemsPerPage = 10,
}: CategoryPaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6 text-sm">
      <p className="text-muted-foreground">
        Menampilkan 1-{totalItems} dari {totalItems} kategori
      </p>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled>
          Sebelumnya
        </Button>
        <Button variant="outline" size="sm" disabled>
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
