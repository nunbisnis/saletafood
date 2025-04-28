import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";

// Define the product type
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: string;
};

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Harga
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3 text-sm">{product.id}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  Rp{product.price.toFixed(3)}
                </td>
                <td className="px-4 py-3 text-sm">{product.category}</td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/dashboard/products/${product.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
