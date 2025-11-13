import {
  MessageSquare,
  Megaphone,
  FolderOpen,
  Calendar,
  Users,
  Home,
  Activity,
  Shield,
  Settings,
} from "lucide-react";
import { SidebarItem } from "@/components/layout/types";
import React from "react";

// Main navigation based on user role
export const getNavItems = (
  currentPath: string,
  userRole?: string
): SidebarItem[] => {
  // Common items for all users
  const commonItems: SidebarItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      label: "Messages",
      path: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      label: "Announcements",
      path: "/dashboard/announcements",
      icon: Megaphone,
    },
    {
      label: "Resources",
      path: "/dashboard/resources",
      icon: FolderOpen,
    },
    {
      label: "Calendar",
      path: "/dashboard/calendar",
      icon: Calendar,
    },
  ];

  // Admin/IT JCO specific items
  const adminItems: SidebarItem[] = [
    {
      label: "User Management",
      path: "/dashboard/user-management",
      icon: Users,
    },
    {
      label: "Analytics",
      path: "/dashboard/analytics",
      icon: Activity,
    },
  ];

  // Return based on role
  if (userRole === "adjt" || userRole === "it_jco") {
    return [...commonItems, ...adminItems];
  }

  return commonItems;
};

export const footerNavItems: SidebarItem[] = [
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export const brandingConfig = {
  iconComponent: Shield,
  name: "Unit Comn Portal",
};
