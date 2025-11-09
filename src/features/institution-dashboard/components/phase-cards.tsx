// src/features/dashboard/components/phase-cards.tsx
import { Calendar, Users, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PhaseCard } from "../data/schema";
import { getStatusConfig } from "../config/status-config";

interface Props {
  phases: PhaseCard[];
}

// Date formatting utility
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const calculateProgress = (current: number, target?: number) => {
  if (!target || target === 0) return 0;
  return Math.round((current / target) * 100);
};

export function PhaseCards({ phases }: Props) {
  if (phases.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No phases created yet</h3>
            <p className="text-sm">
              Your admin will create phases for your institution when ready
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {phases.map((phase) => {
        const statusConfig = getStatusConfig(phase.status);
        const StatusIcon = statusConfig.icon;
        const progress = calculateProgress(
          phase.submissionCount,
          phase.targetCount
        );

        // Determine if phase is completed
        const isCompleted = phase.status === "delivered";
        const isInTransit = phase.status === "on-transit";

        return (
          <Card key={phase.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                {/* Title and Description */}
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">
                    {phase.name}
                  </CardTitle>
                  {phase.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {phase.description}
                    </p>
                  )}
                </div>

                {/* Status Badge - Now below title/description */}
                <Badge
                  variant="outline"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold w-fit ${statusConfig.className}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submissions</span>
                  <span className="font-medium">
                    {phase.submissionCount}
                    {phase.targetCount && ` / ${phase.targetCount}`}
                  </span>
                </div>
                {phase.targetCount ? (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">
                      {progress}% complete
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{phase.submissionCount}</span>
                    <span className="text-muted-foreground">total</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(phase.createdAt)}</span>
                </div>

                {phase.startedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Started {formatDate(phase.startedAt)}</span>
                  </div>
                )}

                {phase.completedAt && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Delivered {formatDate(phase.completedAt)}</span>
                  </div>
                )}
              </div>

              {/* Status-specific messages */}
              <div
                className={`p-3 rounded-md border ${statusConfig.className
                  .replace("border-", "border-")
                  .replace("bg-", "bg-")
                  .replace("text-", "text-")}`}
              >
                {phase.status === "file-processing" && (
                  <p className="text-xs">
                    Your files are being processed and validated.
                  </p>
                )}

                {phase.status === "design-completed" && (
                  <p className="text-xs">
                    Design phase completed! Your ID cards have been finalized
                    and approved.
                  </p>
                )}

                {phase.status === "printing-ongoing" && (
                  <p className="text-xs">
                    Your ID cards are currently being printed.
                  </p>
                )}

                {phase.status === "lanyard-attachment" && (
                  <p className="text-xs">
                    Lanyards are being attached to your ID cards. Almost ready
                    for packaging!
                  </p>
                )}

                {phase.status === "packaging-process" && (
                  <p className="text-xs">
                    Your ID cards are being carefully packaged for delivery.
                  </p>
                )}

                {isInTransit && (
                  <p className="text-xs">
                    Your package is on its way! Track your delivery for
                    real-time updates.
                  </p>
                )}

                {isCompleted && (
                  <p className="text-xs">
                    Delivered successfully! Your ID cards have been received.
                    Thank you!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
