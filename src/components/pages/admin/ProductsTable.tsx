import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Edit, Trash2, MoreHorizontal, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

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
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden w-full">
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
                <tr key={product.id} className="border-t hover:bg-muted/50">
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
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
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

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden w-full">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
              <StatusBadge status={product.status} />
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <p className="text-muted-foreground">ID: {product.id}</p>
                <p className="font-medium">Rp{product.price.toFixed(3)}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/dashboard/products/${product.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/admin/dashboard/products/${product.id}`}>
                Detail
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
