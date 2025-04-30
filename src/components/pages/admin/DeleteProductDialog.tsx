"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/product-actions";
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

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function DeleteProductDialog({
  isOpen,
  onClose,
  productId,
  productName,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(productId);
      
      if (result.success) {
        toast({
          title: "Produk berhasil dihapus",
          description: `${productName} telah dihapus dari database.`,
          variant: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Gagal menghapus produk",
          description: result.error || "Terjadi kesalahan saat menghapus produk.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk.",
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
            Konfirmasi Hapus Produk
          </DialogTitle>
          <DialogDescription>
            Produk <span className="font-medium">{productName}</span> akan dihapus selamanya dan tidak bisa dikembalikan!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Semua data produk termasuk gambar akan dihapus secara permanen dari sistem.
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
            {isDeleting ? "Menghapus..." : "Hapus Produk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
