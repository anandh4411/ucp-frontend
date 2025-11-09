import {
  Building2,
  FileText,
  FileCheck2,
  Fingerprint,
  Layers,
  Users,
  Home,
  LayoutTemplate, // Add this for Templates
  Package, // Add this for Products
} from "lucide-react";
import { SidebarItem } from "@/components/layout/types";
import React from "react";

// Helper function to determine which nav items to return based on path
export const getNavItems = (currentPath: string): SidebarItem[] => {
  const isInstitutionChildRoute = currentPath.startsWith("/institutions/");

  if (isInstitutionChildRoute) {
    // Institution-specific navigation
    return [
      {
        label: "Dashboard",
        path: "/institutions/dashboard",
        icon: Home,
      },
      {
        label: "Submissions",
        path: "/institutions/submissions",
        icon: Users,
      },
    ];
  }

  // Default admin navigation
  return [
    {
      label: "Institutions",
      path: "/dashboard/institutions",
      icon: Building2,
    },
    {
      label: "Forms",
      path: "/dashboard/forms",
      icon: FileText,
    },
    {
      label: "Phases",
      path: "/dashboard/phases",
      icon: Layers,
    },
    {
      label: "Submissions",
      path: "/dashboard/submissions",
      icon: FileCheck2,
    },
    {
      label: "Templates",
      path: "/dashboard/templates",
      icon: LayoutTemplate, // Changed icon
    },
    {
      label: "Products",
      path: "/dashboard/products",
      icon: Package, // Changed icon
    },
  ];
};

export const footerNavItems: SidebarItem[] = [];

// Custom logo component
const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return React.createElement("img", {
    src: "/logo.png",
    alt: "Impressaa Logo",
    className: "w-full",
    ...props,
  });
};

export const brandingConfig = {
  iconComponent: LogoIcon,
  name: "Impressaa",
};
