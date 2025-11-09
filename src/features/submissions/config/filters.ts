// src/features/submissions/config/filters.ts
import {
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Users,
  Layers,
} from "lucide-react";

export const submissionFilters = [
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
  {
    columnKey: "category",
    title: "Category",
    options: [
      { value: "Grade 5A", label: "Grade 5A", icon: Users },
      { value: "Grade 3B", label: "Grade 3B", icon: Users },
      { value: "Engineering", label: "Engineering", icon: Users },
      { value: "Medical Staff", label: "Medical Staff", icon: Users },
    ],
  },
  // New Phase filter
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
      {
        value: "Engineering Department Batch 1",
        label: "Engineering Department Batch 1",
        icon: Layers,
      },
      {
        value: "Medical Staff - Emergency Unit",
        label: "Medical Staff - Emergency Unit",
        icon: Layers,
      },
      { value: "no-phase", label: "No Phase Assigned", icon: Layers }, // Special filter for unassigned
    ],
  },
];
