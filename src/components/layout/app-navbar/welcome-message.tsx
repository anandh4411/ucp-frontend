import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface WelcomeMessageProps {
  welcomeMessage?: string;
  subText?: string;
  userName?: string;
  userRank?: string;
  userRole?: string;
  className?: string;
}

export function WelcomeMessage({
  welcomeMessage = "Welcome back",
  subText,
  userName,
  userRank,
  userRole,
  className = "",
}: WelcomeMessageProps) {
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <div className="flex items-center gap-2 text-sm sm:text-lg font-semibold text-foreground truncate">
        <span className="hidden sm:inline">{welcomeMessage}</span>
        <span className="sm:hidden">Hi</span>
        {userName ? `, ${userRank ? `${userRank} ` : ""}${userName.split(" ")[0]}!` : "!"}
        {userRole && (
          <Badge variant="outline" className="hidden lg:inline-flex text-xs font-semibold border-primary/50 text-primary">
            {userRole.toUpperCase()}
          </Badge>
        )}
      </div>
      {subText && (
        <p className="hidden md:block text-xs text-muted-foreground truncate">
          {subText}
        </p>
      )}
    </div>
  );
}
