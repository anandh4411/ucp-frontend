import React from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { WelcomeMessage } from "./welcome-message";
import { useTheme } from "@/context/theme-context";
import { UserProfile } from "../types";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  // Welcome section
  welcomeMessage?: string;
  subText?: string;
  userProfile?: UserProfile;

  // Feature toggles
  showThemeToggle?: boolean;
  showSidebarTrigger?: boolean;

  // User profile configuration
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  // Welcome section
  welcomeMessage = "Welcome back",
  subText = "",
  userProfile = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },

  // Feature toggles
  showThemeToggle = true,
  showSidebarTrigger = true,

  // User profile configuration
  onProfileClick,
  onLogout,

  className,
  ...props
}: NavbarProps) {
  // Get theme from context in the parent (navbar)
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        "bg-background border-b border-border h-16 flex items-center px-3 sm:px-6 justify-between",
        className
      )}
      {...props}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {showSidebarTrigger && (
          <SidebarTrigger
            variant="outline"
            size="icon"
            className="size-8 flex-shrink-0"
          />
        )}

        {/* Separator - Hidden on mobile */}
        {showSidebarTrigger && <div className="h-7 w-px bg-primary/30 mx-1" />}

        {/* Welcome Message */}
        <WelcomeMessage
          welcomeMessage={welcomeMessage}
          subText={subText}
          userName={userProfile?.name}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        {/* Theme Toggle - Pass theme from context */}
        <ThemeToggle
          disabled={!showThemeToggle}
          theme={theme}
          onThemeChange={setTheme}
        />

        {/* User Profile */}
        <UserProfileDropdown
          userProfile={userProfile}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
