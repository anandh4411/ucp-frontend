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
import { useDeleteProduct } from "@/api/hooks/products";
import { ProductData } from "@/types/dto/product.dto";

interface ProductDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData;
}

export const ProductDeleteDialog = ({
  isOpen,
  onClose,
  product,
}: ProductDeleteDialogProps) => {
  const deleteProduct = useDeleteProduct();

  const handleConfirm = async () => {
    if (!product.uuid) return;

    try {
      await deleteProduct.mutateAsync(product.uuid);
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the product "{product.name}"? This
            action cannot be undone and will remove the product permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteProduct.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteProduct.isPending ? "Deleting..." : "Delete Product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
