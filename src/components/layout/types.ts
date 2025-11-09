import React from "react";

// Sidebar Types
export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
  children?: SidebarItem[];
  badge?: string;
  externalUrl?: string;
}

// Search Types
export interface SearchCommand {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action?: () => void;
}

export interface SearchGroup {
  heading: string;
  commands: SearchCommand[];
}

// Notification Types
export interface Notification {
  id: string | number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon?: React.ReactNode;
  iconColor?: string;
  read: boolean;
}

// User Profile Types
export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface UserAccount {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  color?: string;
  isActive?: boolean;
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action?: () => void;
}

// Loader bar types
export interface NavigationState {
  status: "idle" | "pending" | "loading" | "error";
  location?: {
    pathname: string;
  };
}
