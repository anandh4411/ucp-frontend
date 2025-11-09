// src/features/submissions/components/institution-stats.tsx
import { Users, CheckCircle, Clock, XCircle, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Submission } from "../data/schema";

interface Props {
  submissions: Submission[];
}

export function InstitutionStats({ submissions }: Props) {
  const stats = {
    total: submissions.length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    pending: submissions.filter((s) => s.status === "pending").length,
    expired: submissions.filter((s) => s.status === "expired").length,
    withPhase: submissions.filter((s) => s.phaseId).length,
    withoutPhase: submissions.filter((s) => !s.phaseId).length,
  };

  const StatsBadge = ({
    type,
    count,
    label,
    icon: Icon,
  }: {
    type: "total" | "submitted" | "pending" | "expired" | "phase";
    count: number;
    label: string;
    icon: any;
  }) => {
    const getConfig = (type: string) => {
      switch (type) {
        case "total":
          return "border-blue-300 bg-blue-50 text-blue-700";
        case "submitted":
          return "border-green-300 bg-green-50 text-green-700";
        case "pending":
          return "border-amber-300 bg-amber-50 text-amber-700";
        case "expired":
          return "border-red-300 bg-red-50 text-red-700";
        case "phase":
          return "border-purple-300 bg-purple-50 text-purple-700";
        default:
          return "border-gray-300 bg-gray-50 text-gray-700";
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">{label}:</span>
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${getConfig(
            type
          )}`}
        >
          <Icon className="h-3 w-3" />
          {count}
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">Your Submissions Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track the progress of ID card submissions for your institution
        </p>
      </div>

      <div className="flex items-center space-x-6 flex-wrap gap-y-3">
        <StatsBadge
          type="total"
          count={stats.total}
          label="Total"
          icon={Users}
        />
        <StatsBadge
          type="submitted"
          count={stats.submitted}
          label="Submitted"
          icon={CheckCircle}
        />
        <StatsBadge
          type="pending"
          count={stats.pending}
          label="Pending"
          icon={Clock}
        />
        {stats.expired > 0 && (
          <StatsBadge
            type="expired"
            count={stats.expired}
            label="Expired"
            icon={XCircle}
          />
        )}
        <StatsBadge
          type="phase"
          count={stats.withPhase}
          label="In Phases"
          icon={Layers}
        />
        {stats.withoutPhase > 0 && (
          <StatsBadge
            type="phase"
            count={stats.withoutPhase}
            label="No Phase"
            icon={Layers}
          />
        )}
      </div>
    </div>
  );
}
