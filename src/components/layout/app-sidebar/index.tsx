import React from "react";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarItem } from "../types";

interface AppSidebarProps {
  className?: string;
  currentPath: string;
  footerItems: SidebarItem[];
  navigationItems: SidebarItem[];
  branding: {
    logo: React.ReactNode;
    name: string;
  };
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  isPathActive: (path: string) => boolean;
}

export function AppSidebar({
  className = "",
  currentPath,
  footerItems,
  navigationItems,
  branding,
  onNavigate,
  onLogout,
  isPathActive,
}: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const handleMobileClose = () => setOpenMobile(false);

  const renderIcon = (Icon: React.ElementType) => (
    <Icon className="min-w-[18px] min-h-[18px]" width={18} height={18} />
  );

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border",
        className
      )}
    >
      <SidebarHeader className="py-4 transition-all duration-300 ease-in-out">
        <SidebarBrand logo={branding.logo} name={branding.name} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation
          items={navigationItems}
          currentPath={currentPath}
          isPathActive={isPathActive}
          onNavigate={onNavigate}
          onMobileClose={handleMobileClose}
        />
      </SidebarContent>

      <SidebarFooter className="pb-6">
        <SidebarMenu>
          {/* Footer navigation items using the same component */}
          {footerItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              isActive={isPathActive(item.path)}
              hasActiveChild={false} // Footer items don't have children
              isExpanded={false} // Footer items don't expand
              onToggleExpand={() => {}} // Not needed for footer
              onNavigate={onNavigate}
              onMobileClose={handleMobileClose}
              isPathActive={isPathActive}
            />
          ))}

          {/* Logout button */}
          {onLogout && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Logout"
                className="h-10 my-0.5 text-md px-3 cursor-pointer"
                onClick={onLogout}
              >
                {renderIcon(LogOut)}
                <span className="font-normal">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
