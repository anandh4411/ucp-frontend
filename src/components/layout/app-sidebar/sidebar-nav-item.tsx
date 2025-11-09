import React from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SidebarItem } from "../types";

interface SidebarNavItemProps {
  item: SidebarItem;
  isActive: boolean;
  hasActiveChild: boolean;
  isExpanded: boolean;
  onToggleExpand: (path: string) => void;
  onNavigate: (path: string) => void;
  onMobileClose: () => void;
  isPathActive: (path: string) => boolean;
}

export function SidebarNavItem({
  item,
  isActive,
  hasActiveChild,
  isExpanded,
  onToggleExpand,
  onNavigate,
  onMobileClose,
  isPathActive,
}: SidebarNavItemProps) {
  const { state } = useSidebar();
  const hasChildren = item.children && item.children.length > 0;
  const isCollapsed = state === "collapsed";
  const isItemActive = isActive || hasActiveChild;

  const renderIcon = (Icon: React.ElementType) => (
    <Icon className="min-w-[18px] min-h-[18px]" width={18} height={18} />
  );

  const NavBadge = ({ children }: { children: React.ReactNode }) => (
    <div className="ml-auto -mt-1 group-data-[collapsible=icon]:hidden">
      <Badge>{children}</Badge>
    </div>
  );

  const handleNavigation = (path: string) => {
    onNavigate(path);
    onMobileClose();
  };

  // Collapsed sidebar with children - render as dropdown
  if (hasChildren && isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={item.label}
              className={cn(
                "cursor-pointer h-10 my-0.5 text-md px-3",
                isItemActive &&
                  "bg-primary/10 text-primary font-normal hover:bg-primary/10"
              )}
            >
              {renderIcon(item.icon)}
              <span className="font-normal group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight
                size={16}
                className="ml-auto group-data-[collapsible=icon]:hidden transition-transform"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={4}
            className="w-56 pb-2"
          >
            <DropdownMenuLabel className="pl-5 flex items-center justify-between">
              <span>
                {item.label} {item.badge ? `(${item.badge})` : ""}
              </span>
              {item.externalUrl && (
                <button
                  className="p-1 hover:bg-primary/20 rounded-sm transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.externalUrl, "_blank");
                  }}
                >
                  <ExternalLink size={12} />
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.children?.map((child) => (
              <DropdownMenuItem
                key={child.path}
                className="pl-5 mt-2 cursor-pointer"
                onClick={() => handleNavigation(child.path)}
              >
                <div className="flex items-center w-full gap-2 py-1.5">
                  {renderIcon(child.icon)}
                  <span className="flex-1 truncate">{child.label}</span>
                  {child.badge && (
                    <span className="ml-auto text-xs">{child.badge}</span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  // Expanded sidebar with children
  if (hasChildren && !isCollapsed) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.label}
          className={cn(
            "cursor-pointer h-10 my-0.5 text-md px-3 w-full justify-between",
            isItemActive &&
              "bg-primary/10 text-primary font-normal hover:bg-primary/10"
          )}
          onClick={() => onToggleExpand(item.path)}
        >
          <div className="flex items-center gap-3">
            {renderIcon(item.icon)}
            <span className="font-normal">{item.label}</span>
          </div>
          <div className="flex items-center gap-1">
            {item.badge && <NavBadge>{item.badge}</NavBadge>}

            {/* External link icon */}
            {item.externalUrl && (
              <div
                className="p-1 hover:bg-primary/20 rounded-sm transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(item.externalUrl, "_blank");
                }}
                title={`Open ${item.label} in new tab`}
              >
                <ExternalLink size={14} className="text-foreground" />
              </div>
            )}

            {/* Expand chevron */}
            <div
              className="transition-transform duration-500 ease-in-out transform"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <ChevronRight size={16} />
            </div>
          </div>
        </SidebarMenuButton>

        {/* Sub-menu items with animation */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out pl-4",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
          style={{
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {item.children?.map((child, index) => (
            <SidebarMenuButton
              key={child.path}
              tooltip={child.label}
              className={cn(
                "h-9 my-0.5 text-sm px-3 transform transition-all duration-500 mt-2 cursor-pointer",
                isPathActive(child.path) &&
                  "bg-primary/10 text-primary font-normal hover:bg-primary/10",
                isExpanded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-2 opacity-0"
              )}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
              }}
              onClick={() => handleNavigation(child.path)}
            >
              <div className="flex items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-3">
                  {renderIcon(child.icon)}
                  <span className="font-normal">{child.label}</span>
                </div>
                {child.badge && <NavBadge>{child.badge}</NavBadge>}
              </div>
            </SidebarMenuButton>
          ))}
        </div>
      </SidebarMenuItem>
    );
  }

  // Items without children
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        className={cn(
          "h-10 my-0.5 text-md px-3 cursor-pointer",
          isItemActive &&
            "bg-primary/10 text-primary font-normal hover:bg-primary/10"
        )}
        onClick={() => handleNavigation(item.path)}
      >
        <div className="flex items-center gap-3 w-full justify-between">
          <div className="flex items-center gap-3">
            {renderIcon(item.icon)}
            <span className="font-normal">{item.label}</span>
          </div>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
