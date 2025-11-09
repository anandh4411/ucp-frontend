// src/features/submissions/config/institution-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { customColumn } from "@/components/elements/app-data-table/helpers/column-helpers";
import { Submission } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Circle,
  Layers,
} from "lucide-react";

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
          icon: <Circle className="h-3 w-3" />,
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

// Phase Badge Component (simplified, no add button)
const PhaseBadge = ({ phaseName }: { phaseName?: string }) => {
  if (!phaseName) {
    return (
      <Badge
        variant="outline"
        className="text-xs text-gray-600 border-gray-300 bg-gray-50"
      >
        No Phase
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border-blue-300 bg-blue-50 text-blue-700 max-w-[140px]"
      title={phaseName}
    >
      <Layers className="h-3 w-3" />
      <span className="truncate">{phaseName}</span>
    </Badge>
  );
};

// Date formatting utility
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Create institution submission columns (view-only)
export const createInstitutionSubmissionColumns = (
  onView: (submission: Submission) => void
): ColumnDef<Submission>[] => {
  return [
    customColumn<Submission>("personName", "Person Name", (value) => (
      <div className="font-medium max-w-[150px] truncate" title={value}>
        {value}
      </div>
    )),

    customColumn<Submission>("category", "Category/Class", (value) => (
      <div className="max-w-[120px] truncate" title={value || "N/A"}>
        {value || "N/A"}
      </div>
    )),

    customColumn<Submission>("idNumber", "ID Number", (value) => (
      <div
        className="font-mono text-sm max-w-[100px] truncate"
        title={value || "N/A"}
      >
        {value || "N/A"}
      </div>
    )),

    customColumn<Submission>(
      "phaseName",
      "Phase",
      (value) => <PhaseBadge phaseName={value} />,
      { filterable: true }
    ),

    customColumn<Submission>("loginCode", "Login Code", (value) => (
      <div className="flex items-center space-x-2">
        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
          {value}
        </code>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => navigator.clipboard.writeText(value)}
          title="Copy login code"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    )),

    customColumn<Submission>(
      "status",
      "Status",
      (value) => <StatusBadge status={value} />,
      { filterable: true }
    ),

    customColumn<Submission>("submittedAt", "Submitted Date", (value) => (
      <span className="text-sm text-muted-foreground">
        {value ? formatDate(value) : "Not submitted"}
      </span>
    )),

    customColumn<Submission>("createdAt", "Created", (value) => (
      <div className="text-sm text-muted-foreground">{formatDate(value)}</div>
    )),

    // Only view action - removed download button
    customColumn<Submission>("actions", "Actions", (_, row) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onView(row)}
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </Button>
    )),
  ];
};
