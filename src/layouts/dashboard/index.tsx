import React from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/dashboard-layout";
import {
  getNavItems,
  footerNavItems,
  brandingConfig,
} from "@/config/navigation";
import { useLogout } from "@/api";
import { getCurrentUser } from "@/guards/useAuthGuard";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const router = useRouter();
  const user = getCurrentUser(); // Get current user

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };

  const handleLogout = () => {
    logout();
  };

  const isPathActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "";
    }
    return location.pathname.startsWith(path);
  };

  const branding = {
    logo: <brandingConfig.iconComponent />,
    name: brandingConfig.name,
  };

  // Get navigation items based on current path and user role
  const mainNavItems = getNavItems(location.pathname, user?.role);

  return (
    <DashboardLayoutComponent
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      navigationItems={mainNavItems}
      footerItems={footerNavItems}
      branding={branding}
      isPathActive={isPathActive}
    >
      {children}
    </DashboardLayoutComponent>
  );
};
