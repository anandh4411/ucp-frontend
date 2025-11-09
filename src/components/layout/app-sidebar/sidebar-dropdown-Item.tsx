import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SidebarItem } from "../types";

interface SidebarDropdownItemProps {
  item: SidebarItem;
  isActive: boolean;
  onNavigate: (path: string) => void;
  className?: string;
}

export function SidebarDropdownItem({
  item,
  isActive,
  onNavigate,
  className = "",
}: SidebarDropdownItemProps) {
  const renderIcon = (Icon: React.ElementType) => (
    <Icon className="min-w-[18px] min-h-[18px]" width={18} height={18} />
  );

  return (
    <DropdownMenuItem
      className={cn("pl-5 mt-2 cursor-pointer", className)}
      onClick={() => onNavigate(item.path)}
    >
      <div
        className={cn(
          "flex items-center w-full gap-2 py-1.5",
          isActive && "bg-primary/10"
        )}
      >
        {renderIcon(item.icon)}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && <span className="ml-auto text-xs">{item.badge}</span>}
      </div>
    </DropdownMenuItem>
  );
}
