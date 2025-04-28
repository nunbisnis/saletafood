import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface EmptyProductStateProps {
  categoryName: string;
}

export function EmptyProductState({ categoryName }: EmptyProductStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mb-4 text-muted-foreground">
        <Filter className="h-12 w-12 mx-auto mb-2" />
        <h3 className="text-xl font-medium">
          Tidak ada produk yang ditemukan
        </h3>
      </div>
      <p className="text-muted-foreground mb-6">
        Tidak ada produk yang cocok dengan filter yang Anda pilih.
      </p>
      <Button asChild variant="outline">
        <Link href={`/produk/${categoryName.toLowerCase()}`}>
          Reset Filter
        </Link>
      </Button>
    </div>
  );
}
