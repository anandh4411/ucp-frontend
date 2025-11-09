// src/features/phases/config/status-config.ts
import {
  FileUp,
  Palette,
  Printer,
  Ribbon,
  Package,
  Truck,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

export interface StatusConfig {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  className: string; // Tailwind classes for Badge
  order: number; // For sequential ordering
}

export const statusConfigs: Record<string, StatusConfig> = {
  "file-processing": {
    value: "file-processing",
    label: "File Processing",
    description: "Initial files are being processed and validated",
    icon: FileUp,
    className: "border-purple-300 bg-purple-50 text-purple-700",
    order: 1,
  },
  "design-completed": {
    value: "design-completed",
    label: "Design Completed",
    description: "ID card design has been finalized",
    icon: Palette,
    className: "border-indigo-300 bg-indigo-50 text-indigo-700",
    order: 2,
  },
  "printing-ongoing": {
    value: "printing-ongoing",
    label: "Printing Ongoing",
    description: "Cards are currently being printed",
    icon: Printer,
    className: "border-blue-300 bg-blue-50 text-blue-700",
    order: 3,
  },
  "lanyard-attachment": {
    value: "lanyard-attachment",
    label: "Lanyard Attachment",
    description: "Lanyards are being attached to cards",
    icon: Ribbon,
    className: "border-cyan-300 bg-cyan-50 text-cyan-700",
    order: 4,
  },
  "packaging-process": {
    value: "packaging-process",
    label: "Packaging",
    description: "Cards are being packaged for delivery",
    icon: Package,
    className: "border-amber-300 bg-amber-50 text-amber-700",
    order: 5,
  },
  "on-transit": {
    value: "on-transit",
    label: "On Transit",
    description: "Package is in transit to destination",
    icon: Truck,
    className: "border-orange-300 bg-orange-50 text-orange-700",
    order: 6,
  },
  delivered: {
    value: "delivered",
    label: "Delivered",
    description: "Cards have been successfully delivered",
    icon: CheckCircle,
    className: "border-green-300 bg-green-50 text-green-700",
    order: 7,
  },
};

// Helper to get config safely
export const getStatusConfig = (status: string): StatusConfig => {
  return statusConfigs[status] || statusConfigs["file-processing"];
};

// Get all statuses in order
export const orderedStatuses = Object.values(statusConfigs).sort(
  (a, b) => a.order - b.order
);
