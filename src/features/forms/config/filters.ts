// src/features/forms/config/filters.ts
import { Building2 } from "lucide-react";

export const formFilters = [
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
