// src/features/institutions/components/institution-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  badgeColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import { InstitutionData } from "@/types/dto/institution.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy");
};

const getStatusVariant = (isActive?: boolean): "default" | "secondary" | "destructive" | "outline" => {
  return isActive ? "default" : "secondary";
};

const getTypeDisplay = (type?: string) => {
  if (!type) return "N/A";
  const typeMap = {
    school: "School",
    office: "Office",
    organization: "Organization",
    other: "Other",
  };
  return typeMap[type as keyof typeof typeMap] || type;
};

// Create institution columns function that accepts action handlers
export const createInstitutionColumns = (
  onView: (institution: InstitutionData) => void,
  onEdit: (institution: InstitutionData) => void,
  onDelete: (institution: InstitutionData) => void
): ColumnDef<InstitutionData>[] => {
  const institutionActions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      className: "text-destructive",
      separator: true,
    },
  ];

  return [
    selectColumn<InstitutionData>(),

    customColumn<InstitutionData>("name", "Institution Name", (value) => (
      <div className="font-medium max-w-[200px] truncate" title={value || ""}>
        {value || "N/A"}
      </div>
    )),

    customColumn<InstitutionData>(
      "type",
      "Type",
      (value) => <Badge variant="outline">{getTypeDisplay(value)}</Badge>,
      { filterable: true }
    ),

    customColumn<InstitutionData>("contactPerson", "Contact Person", (value) => (
      <div className="max-w-[150px] truncate" title={value || ""}>
        {value || "N/A"}
      </div>
    )),

    customColumn<InstitutionData>("contactPhone", "Phone", (value) => (
      <div className="font-mono text-sm max-w-[120px] truncate" title={value || ""}>
        {value || "N/A"}
      </div>
    )),

    customColumn<InstitutionData>("contactEmail", "Email", (value) => (
      <div
        className="text-muted-foreground max-w-[150px] truncate"
        title={value || ""}
      >
        {value || "N/A"}
      </div>
    )),

    customColumn<InstitutionData>(
      "isAccessActive",
      "Status",
      (value) => (
        <Badge variant={getStatusVariant(value)}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
      {
        filterable: true,
        sortable: true,
      }
    ),

    actionsColumn<InstitutionData>(institutionActions),
  ];
};

// Default export for backward compatibility (if needed)
export const institutionColumns = createInstitutionColumns(
  (institution: InstitutionData) => console.log("View:", institution),
  (institution: InstitutionData) => console.log("Edit:", institution),
  (institution: InstitutionData) => console.log("Delete:", institution)
);
