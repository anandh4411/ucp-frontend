// src/features/submissions/config/institution-filters.ts
import { Clock, CheckCircle, XCircle, Layers, Users } from "lucide-react";

export const institutionSubmissionFilters = [
  {
    columnKey: "status",
    title: "Status",
    options: [
      { value: "pending", label: "Pending", icon: Clock },
      { value: "submitted", label: "Submitted", icon: CheckCircle },
      { value: "expired", label: "Expired", icon: XCircle },
    ],
  },
  {
    columnKey: "category",
    title: "Category/Class",
    options: [
      { value: "Grade 5A", label: "Grade 5A", icon: Users },
      { value: "Grade 3B", label: "Grade 3B", icon: Users },
      { value: "Grade 4A", label: "Grade 4A", icon: Users },
      { value: "Grade 5B", label: "Grade 5B", icon: Users },
      { value: "Grade 6B", label: "Grade 6B", icon: Users },
    ],
  },
  {
    columnKey: "phaseName",
    title: "Phase",
    options: [
      {
        value: "First Batch - Grade 5A",
        label: "First Batch - Grade 5A",
        icon: Layers,
      },
      {
        value: "Second Batch - Grades 3B & 4A",
        label: "Second Batch - Grades 3B & 4A",
        icon: Layers,
      },
      { value: "Remaining Classes", label: "Remaining Classes", icon: Layers },
      { value: "no-phase", label: "No Phase Assigned", icon: Layers },
    ],
  },
];
