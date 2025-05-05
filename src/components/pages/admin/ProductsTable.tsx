"use client";

import { useState } from "react";
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
import { DeleteProductDialog } from "./DeleteProductDialog";

// Define the product type
type Product = {
  id: string | number;
  name: string;
  price: number;
  category: string;
  status: string;
  slug: string;
};

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Nama Produk
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Slug
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
                  <td className="px-4 py-3 text-sm font-medium">
                    <Link
                      href={`/admin/dashboard/products/edit/${product.slug}`}
                      className="hover:underline text-primary"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    {product.price === 0 ? (
                      <span>
                        Rp. <span className="underline">Negotiation</span>
                      </span>
                    ) : (
                      `Rp${product.price.toLocaleString("id-ID")}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/products/edit/${product.slug}`}
                          className="flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span>Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span>Hapus</span>
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
                <h3 className="font-medium">
                  <Link
                    href={`/admin/dashboard/products/edit/${product.slug}`}
                    className="hover:underline text-primary"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
              <StatusBadge status={product.status} />
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Slug: {product.slug}</p>
                <p className="font-medium">
                  {product.price === 0 ? (
                    <span>
                      Rp. <span className="underline">Negotiation</span>
                    </span>
                  ) : (
                    `Rp${product.price.toLocaleString("id-ID")}`
                  )}
                </p>
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
                    <Link
                      href={`/admin/dashboard/products/edit/${product.slug}`}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <div className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Hapus</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link
                href={`/admin/dashboard/products/edit/${product.slug}`}
                className="flex items-center justify-center"
              >
                <span>Edit</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {selectedProduct && (
        <DeleteProductDialog
          isOpen={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          productId={selectedProduct.id.toString()}
          productName={selectedProduct.name}
        />
      )}
    </>
  );
}
