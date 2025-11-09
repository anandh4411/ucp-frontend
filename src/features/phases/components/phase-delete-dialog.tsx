// src/features/phases/components/phase-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeletePhase } from "@/api/hooks/phases";
import { PhaseData } from "@/types/dto/phase.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: PhaseData;
}

export function PhaseDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const deletePhase = useDeletePhase();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name || !currentRow.uuid) return;

    try {
      await deletePhase.mutateAsync(currentRow.uuid);
      onOpenChange(false);
      setValue("");
    } catch (error) {
      console.error("Failed to delete phase:", error);
    }
  };

  const handleClose = (open: boolean) => {
    setValue("");
    onOpenChange(open);
  };

  const hasSubmissions = (currentRow.submissionCount || 0) > 0;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || deletePhase.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Phase
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the phase{" "}
            <span className="font-bold">"{currentRow.name}"</span>?
            <br />
            {hasSubmissions && (
              <>
                This phase currently has{" "}
                <span className="font-bold">{currentRow.submissionCount}</span>{" "}
                submissions associated with it.
                <br />
              </>
            )}
            This action cannot be undone.
          </p>

          <Label className="my-2">
            Phase Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter phase name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              {hasSubmissions
                ? "Deleting this phase will remove the phase association from all submissions, but the submissions themselves will remain in the system."
                : "This operation cannot be rolled back."}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
