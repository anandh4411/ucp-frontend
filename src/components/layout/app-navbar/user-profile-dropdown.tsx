import { LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserProfile } from "../types";

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface UserProfileDropdownProps {
  userProfile: UserProfile;
  onLogout?: () => void;
  className?: string;
}

export function UserProfileDropdown({
  userProfile,
  onLogout,
  className = "",
}: UserProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-2 sm:gap-3 rounded-md py-1 px-1 sm:px-2 hover:bg-muted transition-colors cursor-pointer",
            className
          )}
        >
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
            <AvatarImage
              src={userProfile.avatarUrl || undefined}
              alt={userProfile.name}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
              {getInitials(userProfile.name)}
            </AvatarFallback>
          </Avatar>
          {/* User details - Hidden on mobile */}
          <div className="hidden sm:block min-w-0">
            <div className="font-medium text-foreground text-sm truncate">
              {userProfile.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {userProfile.email}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Logout */}
        {onLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut className="hidden sm:inline">
                ⇧⌘Q
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
