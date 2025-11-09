// src/features/submissions-lite/components/institution-submission-view-modal.tsx
import {
  Calendar,
  User,
  Hash,
  Layers,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Submission } from "../data/schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-3 w-3" />,
          className: "border-amber-300 bg-amber-50 text-amber-700",
        };
      case "submitted":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          className: "border-green-300 bg-green-50 text-green-700",
        };
      case "expired":
        return {
          icon: <XCircle className="h-3 w-3" />,
          className: "border-red-300 bg-red-50 text-red-700",
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          className: "border-gray-300 bg-gray-50 text-gray-700",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Date formatting utility
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function InstitutionSubmissionViewModal({
  open,
  onOpenChange,
  submission,
}: Props) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Submission Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Person Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{submission.personName}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <div className="font-medium">
                  {submission.category || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">ID Number:</span>
                <div className="font-mono font-medium">
                  {submission.idNumber || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status and Phase Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Status & Phase
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Current Status:
                </span>
                <StatusBadge status={submission.status} />
              </div>

              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Assigned Phase:
                </span>
                {submission.phaseName ? (
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border-blue-300 bg-blue-50 text-blue-700"
                  >
                    <Layers className="h-3 w-3" />
                    {submission.phaseName}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-gray-600">
                    No Phase Assigned
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Login Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Login Information</h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Login Code:
                </span>
                <code className="bg-background px-2 py-1 rounded text-sm font-mono border">
                  {submission.loginCode}
                </code>
              </div>
            </div>
          </div>

          <Separator />

          {/* Image Section - Fixed TypeScript error */}
          {submission.imageUrl && (
            <>
              <div className="space-y-4">
                <h4 className="font-medium">Submitted Image</h4>
                <div className="border rounded-lg p-4 text-center">
                  <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3 relative">
                    <img
                      src={submission.imageUrl}
                      alt={`${submission.personName}'s ID photo`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const imgElement = e.currentTarget;
                        const fallbackElement =
                          imgElement.nextElementSibling as HTMLElement;

                        imgElement.style.display = "none";
                        if (fallbackElement) {
                          fallbackElement.style.display = "flex";
                        }
                      }}
                    />
                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-muted-foreground">
                      <User className="h-8 w-8 mb-2" />
                      <span className="text-xs">Image not available</span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(submission.imageUrl, "_blank")}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    View Full Size →
                  </button>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>

            <div className="space-y-3 pl-6">
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium text-right">
                  {formatDate(submission.createdAt)}
                </span>
              </div>

              {submission.addedToPhaseAt && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    Added to Phase:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {formatDate(submission.addedToPhaseAt)}
                  </span>
                </div>
              )}

              {submission.submittedAt && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    Submitted:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {formatDate(submission.submittedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Institution Info */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-900 font-medium text-sm">
              <Building2 className="h-4 w-4" />
              {submission.institutionName}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
