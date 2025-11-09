// src/features/submissions/components/submission-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteSubmission } from "@/api/hooks/submissions";
import { SubmissionData } from "@/types/dto/submission.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: SubmissionData;
}

export function SubmissionDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [value, setValue] = useState("");
  const deleteSubmission = useDeleteSubmission();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.personName || !currentRow.uuid) return;

    try {
      await deleteSubmission.mutateAsync(currentRow.uuid);
      onOpenChange(false);
      setValue("");
    } catch (error) {
      console.error("Failed to delete submission:", error);
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
      disabled={value.trim() !== currentRow.personName || deleteSubmission.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Submission
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the submission for{" "}
            <span className="font-bold">{currentRow.personName}</span>?
            <br />
            This action will permanently remove the submission with verification
            code{" "}
            <span className="font-bold font-mono bg-muted px-1 rounded">
              {currentRow.loginCode}
            </span>{" "}
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Person Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter person name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back. All
              associated data including uploaded images will be permanently
              deleted.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
