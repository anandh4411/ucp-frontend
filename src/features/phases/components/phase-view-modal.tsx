// src/features/phases/components/phase-view-modal.tsx
import { Calendar, Users, Building2, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { PhaseData } from "@/types/dto/phase.dto";
import { getStatusConfig, orderedStatuses } from "../config/status-config";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: PhaseData;
}

// Status Badge Component - reused pattern
const StatusBadge = ({ status }: { status: string }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Date formatting utility
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function PhaseViewModal({ open, onOpenChange, phase }: Props) {
  if (!phase) return null;

  // Calculate progress based on status order
  const currentStatusConfig = getStatusConfig(phase.status || 'pending');
  const progress = (currentStatusConfig.order / orderedStatuses.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Phase Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{phase.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {phase.institutionName}
                </span>
              </div>
            </div>

            {phase.description && (
              <p className="text-sm text-muted-foreground">
                {phase.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Status and Progress */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">
                  Current Status
                </div>
                <StatusBadge status={phase.status || 'pending'} />
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Step {currentStatusConfig.order} of {orderedStatuses.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>
            </div>

            {/* Submissions Count */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Submissions</span>
              </div>
              <Badge variant="secondary" className="text-base">
                {phase.submissionCount || 0}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>

            <div className="space-y-3 pl-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium">
                  {formatDate(phase.createdAt)}
                </span>
              </div>

              {phase.startedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Started:
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(phase.startedAt)}
                  </span>
                </div>
              )}

              {phase.completedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Delivered:
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(phase.completedAt)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Last Updated:
                </span>
                <span className="text-sm font-medium">
                  {formatDate(phase.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
