import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, AlertCircle } from "lucide-react";

// Define the product type
type Product = {
  id: string | number;
  name: string;
  price: number;
  category: string;
  status: string;
};

interface DashboardStatsProps {
  products: Product[];
}

export function DashboardStats({ products }: DashboardStatsProps) {
  const outOfStock = products.filter((p) => p.status === "Habis").length;
  const lowStock = products.filter((p) => p.status === "Stok Menipis").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 w-full">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{products.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {products.filter((p) => p.status === "Tersedia").length} produk
            tersedia
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{outOfStock}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {outOfStock > 0
              ? `${Math.round(
                  (outOfStock / products.length) * 100
                )}% dari total produk`
              : "Semua produk tersedia"}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{lowStock}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {lowStock > 0
              ? `${Math.round(
                  (lowStock / products.length) * 100
                )}% dari total produk`
              : "Semua produk memiliki stok cukup"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
