// src/features/dashboard/components/progress-dashboard.tsx
import { Users, FileCheck2, Clock, Building2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "./circular-progress";
import { PhaseCards } from "./phase-cards";
import { InstitutionProgress, PhaseCard } from "../data/schema";
import { orderedStatuses } from "../config/status-config";

interface Props {
  progress: InstitutionProgress;
  phases: PhaseCard[];
  onViewSubmissions?: () => void;
  onCreatePhase?: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ProgressDashboard({
  progress,
  phases,
  onViewSubmissions,
}: Props) {
  // Calculate phase counts by status
  const phasesByStatus = phases.reduce((acc, phase) => {
    acc[phase.status] = (acc[phase.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate completion rate (delivered phases)
  const deliveredPhases = phasesByStatus["delivered"] || 0;
  const phaseCompletionRate =
    progress.totalPhases > 0
      ? Math.round((deliveredPhases / progress.totalPhases) * 100)
      : 0;

  // Calculate submission rate
  const submissionRate =
    progress.totalSubmissions > 0
      ? Math.round(
          (progress.completedSubmissions / progress.totalSubmissions) * 100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Header with Institution Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-[500] tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {progress.institutionName}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>Last activity</div>
            <div className="font-medium">
              {formatDate(progress.lastActivity)}
            </div>
          </div>
        </div>

        {/* Selected Template Display */}
        {progress.selectedTemplate && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded border-2 border-dashed border-blue-300 flex items-center justify-center">
                  <span className="text-blue-600 text-xs">🆔</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-900">
                    Selected Template: {progress.selectedTemplate.name}
                  </div>
                  <div className="text-sm text-blue-700">
                    {progress.selectedTemplate.description}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-300"
                >
                  {progress.selectedTemplate.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Overall Progress */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <CircularProgress percentage={progress.completionPercentage} />
            <div className="text-center space-y-1">
              <div className="text-sm font-medium">
                {progress.completedSubmissions} of {progress.totalSubmissions}{" "}
                submissions
              </div>
              <div className="text-xs text-muted-foreground">
                {progress.pendingSubmissions} pending completion
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Phase Stats with All Statuses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-medium">
              Phase Progress
            </CardTitle>
            <FileCheck2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Phases */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{progress.totalPhases}</span>
              <span className="text-sm text-muted-foreground">
                Total Phases
              </span>
            </div>

            {/* Phase Breakdown by Production Status */}
            <div className="space-y-2">
              {orderedStatuses.map((statusConfig) => {
                const count = phasesByStatus[statusConfig.value] || 0;
                const StatusIcon = statusConfig.icon;

                // Only show statuses that have phases
                if (count === 0) return null;

                return (
                  <div
                    key={statusConfig.value}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm">{statusConfig.label}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}

              {/* Show message if no phases */}
              {progress.totalPhases === 0 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No phases created yet
                </div>
              )}
            </div>

            {/* Phase Progress Bar */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivered</span>
                <span className="font-medium">
                  {deliveredPhases} / {progress.totalPhases}
                </span>
              </div>
              <Progress value={phaseCompletionRate} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {phaseCompletionRate}% complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Submission Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-medium">
              Submissions Status
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Submissions */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {progress.totalSubmissions}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Submissions
              </span>
            </div>

            {/* Submission Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {progress.completedSubmissions}
                  </div>
                  <div className="text-xs text-green-600">
                    {submissionRate}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">Pending</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {progress.pendingSubmissions}
                  </div>
                  <div className="text-xs text-amber-600">
                    {100 - submissionRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{submissionRate}%</span>
              </div>
              <Progress value={submissionRate} className="h-2" />
            </div>

            {/* View Submissions Link */}
            {onViewSubmissions && (
              <button
                onClick={onViewSubmissions}
                className="w-full mt-3 text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All Submissions →
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phases Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-[500] tracking-tight">Your Phases</h2>
          <Badge variant="outline" className="text-xs">
            {progress.totalPhases} phase{progress.totalPhases !== 1 ? "s" : ""}{" "}
            total
          </Badge>
        </div>

        <PhaseCards phases={phases} />

        {phases.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-muted-foreground">
                <FileCheck2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No phases created yet</h3>
                <p className="text-sm">
                  Your admin will create phases for your institution when ready
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
