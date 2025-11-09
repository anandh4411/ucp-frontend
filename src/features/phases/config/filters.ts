// src/features/phases/config/filters.ts
import { Building2 } from "lucide-react";
import { orderedStatuses } from "./status-config";

export const phaseFilters = [
  {
    columnKey: "status",
    title: "Status",
    options: orderedStatuses.map((config) => ({
      value: config.value,
      label: config.label,
      icon: config.icon,
    })),
  },
  {
    columnKey: "institutionName",
    title: "Institution",
    options: [
      {
        value: "Springfield Elementary School",
        label: "Springfield Elementary",
        icon: Building2,
      },
      {
        value: "TechCorp Solutions",
        label: "TechCorp Solutions",
        icon: Building2,
      },
      {
        value: "Community Health Center",
        label: "Health Center",
        icon: Building2,
      },
    ],
  },
];
