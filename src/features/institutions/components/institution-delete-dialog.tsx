// src/features/institutions/components/institution-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteInstitution } from "@/api/hooks/institutions";
import { InstitutionData } from "@/types/dto/institution.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: InstitutionData;
}

export function InstitutionDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [value, setValue] = useState("");
  const deleteInstitution = useDeleteInstitution();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name || !currentRow.uuid) return;

    try {
      await deleteInstitution.mutateAsync(currentRow.uuid);
      onOpenChange(false);
      setValue("");
    } catch (error) {
      // Error is handled in the mutation hook with toast
      console.error("Failed to delete institution:", error);
    }
  };

  const handleClose = (open: boolean) => {
    setValue("");
    onOpenChange(open);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || deleteInstitution.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Institution
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the institution of type{" "}
            <span className="font-bold">
              {currentRow.type?.toUpperCase() || "N/A"}
            </span>{" "}
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Institution Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter institution name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back. All
              associated forms and submissions will also be affected.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
