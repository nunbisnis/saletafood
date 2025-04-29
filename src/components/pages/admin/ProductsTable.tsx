"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { deleteProduct } from "@/actions/product-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

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
  onProductDeleted?: () => void;
}

export function ProductsTable({
  products,
  onProductDeleted,
}: ProductsTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteProduct(productToDelete.id.toString());

      if (result.success) {
        toast({
          title: "Produk berhasil dihapus",
          description: `Produk ${productToDelete.name} telah dihapus.`,
        });
        setProductToDelete(null);
        if (onProductDeleted) {
          onProductDeleted();
        }
      } else {
        setDeleteError(result.error || "Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteError("Terjadi kesalahan saat menghapus produk");
    } finally {
      setIsDeleting(false);
    }
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
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-sm">{product.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    Rp{product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/products/${product.id}`}
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
                <h3 className="font-medium">{product.name}</h3>
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
                  Rp{product.price.toLocaleString("id-ID")}
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
                      href={`/admin/dashboard/products/${product.id}`}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 flex items-center"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Hapus</span>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin untuk menghapus produk &quot;
              {productToDelete?.name}&quot;?
              <div className="mt-2">
                Data akan hilang selamanya dan tidak dapat dikembalikan.
              </div>
              {deleteError && (
                <div className="mt-2 text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {deleteError}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
