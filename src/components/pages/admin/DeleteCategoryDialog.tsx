"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/category-actions";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  categoryId,
  categoryName,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCategory(categoryId);
      
      if (result.success) {
        toast({
          title: "Kategori berhasil dihapus",
          description: `${categoryName} telah dihapus dari database.`,
          variant: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Gagal menghapus kategori",
          description: result.error || "Terjadi kesalahan saat menghapus kategori.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Gagal menghapus kategori",
        description: "Terjadi kesalahan saat menghapus kategori.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Konfirmasi Hapus Kategori
          </DialogTitle>
          <DialogDescription>
            Kategori <span className="font-medium">{categoryName}</span> akan dihapus selamanya dan tidak bisa dikembalikan!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Kategori hanya dapat dihapus jika tidak memiliki produk terkait.
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus Kategori"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
