import { type JSX } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: JSX.Element;
  }[];
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Find the current item to display in the select
  const currentItem = items.find((item) => item.href === pathname) || items[0];

  const handleSelect = (value: string) => {
    navigate({ to: value });
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="p-1 md:hidden">
        <Select value={pathname} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue>
              <div className="flex items-center gap-x-3">
                <span className="scale-110">{currentItem.icon}</span>
                <span className="text-sm font-medium">{currentItem.title}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex items-center gap-x-3 px-2 py-1">
                  <span className="scale-110">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Navigation */}
      <ScrollArea
        type="always"
        className="bg-background hidden w-full min-w-40 px-1 py-2 md:block"
      >
        <nav
          className={cn(
            "flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0",
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-accent hover:text-accent-foreground",
                "justify-start"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
