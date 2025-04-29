"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { deleteCategory } from "@/actions/category-actions";
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

// Define the category type
type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
};

interface CategoryTableProps {
  categories: Category[];
  onCategoryDeleted: () => void;
}

export function CategoryTable({
  categories,
  onCategoryDeleted,
}: CategoryTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteCategory(categoryToDelete.id);

      if (result.success) {
        toast({
          title: "Kategori berhasil dihapus",
          description: `Kategori ${categoryToDelete.name} telah dihapus.`,
        });
        setCategoryToDelete(null);
        onCategoryDeleted();
      } else {
        setDeleteError(result.error || "Gagal menghapus kategori");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setDeleteError("Terjadi kesalahan saat menghapus kategori");
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
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Jumlah Produk
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{category.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-sm">{category.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    {category.productCount || 0}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/categories/edit?id=${category.id}`}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(category)}
                      >
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
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <p className="text-muted-foreground">ID: {category.id}</p>
                <p className="font-medium">{category.name}</p>
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
                      href={`/admin/dashboard/categories/edit?id=${category.id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug:</span>
                <span>{category.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Produk:</span>
                <span>{category.productCount || 0}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link
                  href={`/admin/dashboard/categories/edit?id=${category.id}`}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleDeleteClick(category)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori &ldquo;
              {categoryToDelete?.name}&rdquo;?
              {categoryToDelete?.productCount &&
              categoryToDelete.productCount > 0 ? (
                <div className="mt-2 text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Kategori ini memiliki {categoryToDelete.productCount} produk.
                  Anda perlu memindahkan atau menghapus produk terlebih dahulu.
                </div>
              ) : (
                <div className="mt-2">Tindakan ini tidak dapat dibatalkan.</div>
              )}
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
              disabled={
                isDeleting ||
                (categoryToDelete?.productCount
                  ? categoryToDelete.productCount > 0
                  : false)
              }
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
