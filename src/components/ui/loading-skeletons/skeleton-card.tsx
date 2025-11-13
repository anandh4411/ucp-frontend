import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className,
  showHeader = true,
  showFooter = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
      {showHeader && (
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3", i === lines - 1 ? "w-4/5" : "w-full")}
          />
        ))}
      </div>
      {showFooter && (
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      )}
    </div>
  );
}
