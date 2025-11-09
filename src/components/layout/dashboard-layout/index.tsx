import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/app-navbar";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { UserProfile, SidebarItem } from "@/components/layout/types";

export interface DashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  currentPath: string;
  showSidebar?: boolean;
  showNavbar?: boolean;
  sidebarComponent?: React.ReactNode;
  navbarComponent?: React.ReactNode;
  contentClassName?: string;

  // Required navigation props
  navigationItems: SidebarItem[];
  footerItems: SidebarItem[];
  branding: {
    logo: React.ReactNode;
    name: string;
  };
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  isPathActive: (path: string) => boolean;

  // Navbar configuration props (optional)
  welcomeMessage?: string;
  subText?: string;
  userProfile?: UserProfile;
  onProfileClick?: () => void;
}

// Default user profile
const defaultUserProfile: UserProfile = {
  name: "Admin User",
  email: "admin@example.com",
  avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showSidebar = true,
  showNavbar = true,
  sidebarComponent,
  navbarComponent,
  contentClassName,
  navigationItems,
  footerItems,
  branding,
  currentPath,
  className,
  onNavigate,
  onLogout,
  isPathActive,

  // Navbar props with defaults
  welcomeMessage = "Welcome back",
  subText = "It's the best time to manage your ID cards",
  userProfile = defaultUserProfile,
  onProfileClick,
  ...props
}) => {
  const smoothScrollRef = useSmoothScroll(false);

  // Create the sidebar with all required props
  const sidebar = sidebarComponent || (
    <AppSidebar
      navigationItems={navigationItems}
      footerItems={footerItems}
      branding={branding}
      currentPath={currentPath}
      onLogout={onLogout}
      onNavigate={onNavigate}
      isPathActive={isPathActive}
    />
  );

  // Create the navbar with simplified configuration
  const navbar = navbarComponent || (
    <Navbar
      welcomeMessage={welcomeMessage}
      subText={subText}
      userProfile={userProfile}
      onProfileClick={onProfileClick}
      onLogout={onLogout}
    />
  );

  return (
    <SidebarProvider>
      <div
        className={cn(
          "flex h-screen w-full bg-background text-foreground overflow-hidden",
          className
        )}
        {...props}
      >
        {showSidebar && sidebar}
        <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
          {showNavbar && (
            <div className="sticky top-0 z-40 bg-background">{navbar}</div>
          )}
          <main
            ref={smoothScrollRef}
            className={cn(
              "flex-1 w-full h-full overflow-auto bg-background p-6",
              contentClassName
            )}
          >
            <div className="w-full max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
