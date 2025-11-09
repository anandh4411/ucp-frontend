import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export function StatusBadge({
  variant,
  value,
}: {
  variant: string;
  value: string;
}) {
  const config = {
    success: {
      icon: CheckCircle,
      className:
        "bg-green-50 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50 dark:hover:bg-green-950/50",
    },
    warning: {
      icon: Clock,
      className:
        "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50 dark:hover:bg-yellow-950/50",
    },
    destructive: {
      icon: XCircle,
      className:
        "bg-red-50 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/50",
    },
  };

  const { icon: Icon, className } =
    config[variant as keyof typeof config] || config.success;

  return (
    <Badge
      variant="outline"
      className={`px-2 py-1 font-medium gap-1 rounded-xl ${className}`}
    >
      <Icon className="h-3 w-3" />
      {value}
    </Badge>
  );
}
