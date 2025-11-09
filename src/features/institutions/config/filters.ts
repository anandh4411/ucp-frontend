// src/features/institutions/config/filters.ts
import { Building2, Users, Building, Globe } from "lucide-react";

export const institutionFilters = [
  {
    columnKey: "type",
    title: "Type",
    options: [
      { value: "school", label: "School", icon: Building2 },
      { value: "office", label: "Office", icon: Building },
      { value: "organization", label: "Organization", icon: Users },
      { value: "other", label: "Other", icon: Globe },
    ],
  },
  {
    columnKey: "status",
    title: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];
