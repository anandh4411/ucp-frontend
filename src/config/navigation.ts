import {
  MessageSquare,
  Megaphone,
  FolderOpen,
  Calendar,
  Users,
  Home,
  Activity,
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
      path: "/dashboard/users",
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

export const footerNavItems: SidebarItem[] = [];

// Military-style logo
const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return React.createElement("img", {
    src: "/logo.png",
    alt: "UCP Logo",
    className: "w-full",
    ...props,
  });
};

export const brandingConfig = {
  iconComponent: LogoIcon,
  name: "Unit Comn Portal",
};
