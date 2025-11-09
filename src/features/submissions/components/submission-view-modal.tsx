// src/features/submissions/components/submission-view-modal.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { SubmissionData } from "@/types/dto/submission.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: SubmissionData | null;
}

export function SubmissionViewModal({
  open,
  onOpenChange,
  submission,
}: Props) {
  if (!submission) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP 'at' p");
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      pending: "secondary",
      submitted: "default",
      expired: "destructive",
    } as const;
    return variants[status as keyof typeof variants] || "secondary";
  };

  const copyCode = () => {
    if (submission.loginCode) {
      navigator.clipboard.writeText(submission.loginCode);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Submission Details - {submission.personName}
          </DialogTitle>
          <DialogDescription>
            View submission information and status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-sm">{submission.personName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Institution
                </label>
                <p className="text-sm">{submission.institutionName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Class/Department
                </label>
                <p className="text-sm">{submission.category || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID Number
                </label>
                <p className="text-sm font-mono">
                  {submission.idNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status & Code */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status & Code</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Login Code
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="bg-muted px-3 py-1 rounded text-sm font-mono">
                    {submission.loginCode}
                  </code>
                  <Button variant="ghost" size="sm" onClick={copyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(submission.status || 'pending')}>
                    {(submission.status || 'pending').charAt(0).toUpperCase() +
                      (submission.status || 'pending').slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created On
                </label>
                <p className="text-sm">{submission.createdAt ? formatDate(submission.createdAt) : 'N/A'}</p>
              </div>
              {submission.submittedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Submitted On
                  </label>
                  <p className="text-sm">
                    {formatDate(submission.submittedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Photo */}
          {submission.imageUrl && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Photo</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={submission.imageUrl}
                    alt={`${submission.personName}'s photo`}
                    className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                  />
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Photo
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={copyCode}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Code
          </Button>
          {submission.status === "pending" && (
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Resend Code
            </Button>
          )}
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
