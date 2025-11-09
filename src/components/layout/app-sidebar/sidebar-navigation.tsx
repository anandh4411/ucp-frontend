import { useState, useEffect } from "react";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarItem } from "../types";

interface SidebarNavigationProps {
  items: SidebarItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onMobileClose: () => void;
  isPathActive: (path: string) => boolean;
}

export function SidebarNavigation({
  items,
  currentPath,
  onNavigate,
  onMobileClose,
  isPathActive,
}: SidebarNavigationProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Toggle expanded state for items with children
  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Helper to check if any child route is active
  const hasActiveChild = (item: SidebarItem) => {
    return (
      item.children?.some((child: any) => isPathActive(child.path)) || false
    );
  };

  // Auto-expand items with active children on mount and when path changes
  useEffect(() => {
    items.forEach((item) => {
      if (item.children && hasActiveChild(item)) {
        setExpandedItems((prev) => ({
          ...prev,
          [item.path]: true,
        }));
      }
    });
  }, [currentPath, items]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarNavItem
            key={item.path}
            item={item}
            isActive={isPathActive(item.path)}
            hasActiveChild={hasActiveChild(item)}
            isExpanded={expandedItems[item.path] || false}
            onToggleExpand={toggleExpand}
            onNavigate={onNavigate}
            onMobileClose={onMobileClose}
            isPathActive={isPathActive}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
