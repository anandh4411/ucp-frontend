import { Badge } from "@/components/ui/badge";

interface FilterBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function FilterBadge({
  children,
  variant = "secondary",
  className,
}: FilterBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={`rounded-sm px-1 font-normal ${className || ""}`}
    >
      {children}
    </Badge>
  );
}
