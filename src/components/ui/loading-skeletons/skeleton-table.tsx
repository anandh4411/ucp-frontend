import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  className?: string;
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
  showHeader = true,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="flex items-center gap-4 p-4 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      )}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={cn(
                  "h-4",
                  colIndex === 0 ? "w-1/4" : "flex-1"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
