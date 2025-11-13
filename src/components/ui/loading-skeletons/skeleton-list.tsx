import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonListItemProps {
  className?: string;
  showAvatar?: boolean;
  showBadge?: boolean;
}

export function SkeletonListItem({
  className,
  showAvatar = true,
  showBadge = false,
}: SkeletonListItemProps) {
  return (
    <div className={cn("flex items-center space-x-3 p-3", className)}>
      {showAvatar && <Skeleton className="h-10 w-10 rounded-full shrink-0" />}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          {showBadge && <Skeleton className="h-5 w-5 rounded-full" />}
        </div>
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  className?: string;
  items?: number;
  showAvatar?: boolean;
  showBadge?: boolean;
}

export function SkeletonList({
  className,
  items = 5,
  showAvatar = true,
  showBadge = false,
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem
          key={i}
          showAvatar={showAvatar}
          showBadge={showBadge}
        />
      ))}
    </div>
  );
}
