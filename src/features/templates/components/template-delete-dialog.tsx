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
import { useDeleteTemplate } from "@/api/hooks/templates";
import { TemplateData } from "@/types/dto/template.dto";

interface TemplateDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: TemplateData;
}

export const TemplateDeleteDialog = ({
  open,
  onOpenChange,
  currentRow,
}: TemplateDeleteDialogProps) => {
  const deleteTemplate = useDeleteTemplate();

  const handleConfirm = async () => {
    if (!currentRow.uuid) return;

    try {
      await deleteTemplate.mutateAsync(currentRow.uuid);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Template</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the template "{currentRow.name}"? This
            action cannot be undone and will remove the template permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteTemplate.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteTemplate.isPending ? "Deleting..." : "Delete Template"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
