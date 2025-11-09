// src/features/phases/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import { PhaseData } from "@/types/dto/phase.dto";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Users } from "lucide-react";
import { getStatusConfig } from "./status-config";

// Status Badge Component - now uses centralized config
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
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// Create phase columns function
export const createPhaseColumns = (
  onView: (phase: PhaseData) => void,
  onEdit: (phase: PhaseData) => void,
  onDelete: (phase: PhaseData) => void,
  onViewSubmissions: (phase: PhaseData) => void
): ColumnDef<PhaseData>[] => {
  const phaseActions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Edit Phase",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "View Submissions",
      icon: Users,
      onClick: onViewSubmissions,
      separator: true,
    },
    {
      label: "Delete Phase",
      icon: Trash2,
      onClick: onDelete,
      className: "text-destructive",
    },
  ];

  return [
    selectColumn<PhaseData>(),

    customColumn<PhaseData>("name", "Phase Name", (value) => (
      <div className="font-medium max-w-[200px] truncate" title={value}>
        {value}
      </div>
    )),

    customColumn<PhaseData>("institutionName", "Institution", (value) => (
      <div className="max-w-[150px] truncate" title={value}>
        {value}
      </div>
    )),

    customColumn<PhaseData>(
      "status",
      "Status",
      (value) => <StatusBadge status={value || 'pending'} />,
      { filterable: true }
    ),

    customColumn<PhaseData>("submissionCount", "Submissions", (value) => (
      <div className="flex items-center gap-1.5">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium">{value || 0}</span>
      </div>
    )),

    customColumn<PhaseData>("startedAt", "Started Date", (value) => (
      <span className="text-sm text-muted-foreground">{formatDate(value)}</span>
    )),

    customColumn<PhaseData>("completedAt", "Completed Date", (value) => (
      <span className="text-sm text-muted-foreground">{formatDate(value)}</span>
    )),

    customColumn<PhaseData>("createdAt", "Created", (value) => (
      <div className="text-sm text-muted-foreground">{formatDate(value)}</div>
    )),

    actionsColumn<PhaseData>(phaseActions),
  ];
};
