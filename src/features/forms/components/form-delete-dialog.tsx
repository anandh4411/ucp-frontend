// src/features/forms/components/form-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteForm } from "@/api/hooks/forms";
import { FormData } from "@/types/dto/form.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: FormData;
}

export function FormDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const deleteForm = useDeleteForm();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name || !currentRow.uuid) return;

    try {
      await deleteForm.mutateAsync(currentRow.uuid);
      onOpenChange(false);
      setValue("");
    } catch (error) {
      console.error("Failed to delete form:", error);
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
      disabled={value.trim() !== currentRow.name || deleteForm.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Form
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the form for{" "}
            <span className="font-bold">{currentRow.institutionName}</span> from
            the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Form Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter form name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back. All form
              configurations and field settings will be permanently lost.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
