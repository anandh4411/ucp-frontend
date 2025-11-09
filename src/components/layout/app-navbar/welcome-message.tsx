import { cn } from "@/lib/utils";

interface WelcomeMessageProps {
  welcomeMessage?: string;
  subText?: string;
  userName?: string;
  className?: string;
}

export function WelcomeMessage({
  welcomeMessage = "Welcome back",
  subText,
  userName,
  className = "",
}: WelcomeMessageProps) {
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <div className="text-sm sm:text-lg font-semibold text-foreground truncate">
        <span className="hidden sm:inline">{welcomeMessage}</span>
        <span className="sm:hidden">Hi</span>
        {userName ? `, ${userName.split(" ")[0]}!` : "!"}
      </div>
      {subText && (
        <p className="hidden md:block text-xs text-muted-foreground truncate">
          {subText}
        </p>
      )}
    </div>
  );
}
