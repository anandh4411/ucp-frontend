import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function SkeletonAvatar({
  className,
  size = "md",
  showDetails = false,
}: SkeletonAvatarProps) {
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <Skeleton className={cn("rounded-full shrink-0", sizeClasses[size])} />
      {showDetails && (
        <div className="space-y-2 min-w-0">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      )}
    </div>
  );
}
