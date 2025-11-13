import React from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/dashboard-layout";
import {
  getNavItems,
  footerNavItems,
  brandingConfig,
} from "@/config/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { logout, userProfile } = useAuth();
  const location = useLocation();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.navigate({ to: "/sign-in" });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const isPathActive = (path: string) => {
    // Exact match for root
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "";
    }

    // Exact match for dashboard home
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }

    // For other paths, check if it starts with the path followed by / or is exact match
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const branding = {
    logo: <brandingConfig.iconComponent />,
    name: brandingConfig.name,
  };

  // Get navigation items based on current path and user role
  const mainNavItems = getNavItems(location.pathname, userProfile?.role);

  // User profile for navbar
  const navbarUserProfile = userProfile
    ? {
        name: userProfile.name,
        email: userProfile.email,
        avatarUrl: userProfile.avatar || undefined,
      }
    : undefined;

  // Get userId for notifications
  const userId = userProfile?.uuid;

  return (
    <DashboardLayoutComponent
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      navigationItems={mainNavItems}
      footerItems={footerNavItems}
      branding={branding}
      isPathActive={isPathActive}
      userProfile={navbarUserProfile}
      userId={userId}
      welcomeMessage={
        userProfile
          ? `Welcome back, ${userProfile.rank} ${userProfile.name}`
          : "Welcome back"
      }
      subText="Unit Communication Portal"
    >
      {children}
    </DashboardLayoutComponent>
  );
};
