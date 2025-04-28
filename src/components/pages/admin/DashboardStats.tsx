import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the product type
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: string;
};

interface DashboardStatsProps {
  products: Product[];
}

export function DashboardStats({ products }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{products.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {products.filter((p) => p.status === "Habis").length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {products.filter((p) => p.status === "Stok Menipis").length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
