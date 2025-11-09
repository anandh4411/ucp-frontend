// src/features/forms/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  textColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import { FormData } from "@/types/dto/form.dto";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Settings } from "lucide-react";

// Simple utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// const getStatusVariant = (status: string) => {
//   const variants = {
//     draft: "secondary",
//     published: "default",
//   } as const;
//   return variants[status as keyof typeof variants] || "secondary";
// };

// Create form columns function that accepts action handlers
export const createFormColumns = (
  onView: (form: FormData) => void,
  onEdit: (form: FormData) => void,
  onConfigure: (form: FormData) => void,
  onDelete: (form: FormData) => void
): ColumnDef<FormData>[] => {
  const formActions = [
    {
      label: "View Form",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Edit Form",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "Configure Fields",
      icon: Settings,
      onClick: onConfigure,
    },
    {
      label: "Delete Form",
      icon: Trash2,
      onClick: onDelete,
      className: "text-destructive",
      separator: true,
    },
  ];

  return [
    selectColumn<FormData>(),

    textColumn<FormData>("name", "Form Name", {
      className: "font-medium max-w-[200px]",
    }),

    customColumn<FormData>("institutionName", "Institution", (value) => (
      <div className="max-w-[180px] truncate text-sm" title={value}>
        {value}
      </div>
    )),

    customColumn<FormData>("description", "Description", (value) => (
      <div
        className="max-w-[200px] truncate text-muted-foreground"
        title={value || "No description"}
      >
        {value || "No description"}
      </div>
    )),

    customColumn<FormData>("fields", "Fields", (value) => (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {value?.length || 0} fields
        </Badge>
      </div>
    )),

    customColumn<FormData>("updatedAt", "Last Updated", (value) => (
      <div className="text-sm text-muted-foreground">{value ? formatDate(value) : 'N/A'}</div>
    )),

    actionsColumn<FormData>(formActions),
  ];
};

// Default export for backward compatibility
export const formColumns = createFormColumns(
  (form) => console.log("View:", form),
  (form) => console.log("Edit:", form),
  (form) => console.log("Configure:", form),
  (form) => console.log("Delete:", form)
);
