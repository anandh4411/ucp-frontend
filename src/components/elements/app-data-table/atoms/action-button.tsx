import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ActionButton({
  onClick,
  variant = "outline",
  size = "sm",
  disabled = false,
  children,
  className,
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
}
