"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

// Define the category type
type Category = {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
  productsCount?: number;
};

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
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
                  Nama Kategori
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Jumlah Produk
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Gambar
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">
                    <Link
                      href={`/admin/dashboard/categories/edit/${category.slug}`}
                      className="hover:underline text-primary"
                    >
                      {category.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">{category.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    {category.productsCount || 0}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {category.image ? (
                      <div className="h-8 w-8 relative">
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/categories/edit/${category.slug}`}
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
                        onClick={() => handleDeleteClick(category)}
                        disabled={
                          category.productsCount
                            ? category.productsCount > 0
                            : false
                        }
                        title={
                          category.productsCount && category.productsCount > 0
                            ? "Tidak dapat menghapus kategori yang memiliki produk"
                            : "Hapus kategori"
                        }
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
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">
                  <Link
                    href={`/admin/dashboard/categories/edit/${category.slug}`}
                    className="hover:underline text-primary"
                  >
                    {category.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description || "No description"}
                </p>
              </div>
              {category.image ? (
                <div className="h-10 w-10 relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover rounded"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 flex items-center justify-center bg-muted rounded">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Slug: {category.slug}</p>
                <p className="text-muted-foreground">
                  Produk: {category.productsCount || 0}
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
                      href={`/admin/dashboard/categories/edit/${category.slug}`}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteClick(category)}
                    disabled={
                      category.productsCount
                        ? category.productsCount > 0
                        : false
                    }
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
                href={`/admin/dashboard/categories/edit/${category.slug}`}
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
      {selectedCategory && (
        <DeleteCategoryDialog
          isOpen={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
        />
      )}
    </>
  );
}
