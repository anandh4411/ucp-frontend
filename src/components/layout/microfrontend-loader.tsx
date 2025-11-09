import { useEffect } from "react";
import { startProgress, completeProgress } from "./app-loader-bar";

interface MicrofrontendLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function MicrofrontendLoader({
  className = "",
  size = "md",
  message = "Loading...",
}: MicrofrontendLoaderProps) {
  useEffect(() => {
    startProgress();
    return () => {
      setTimeout(() => completeProgress(), 50);
    };
  }, []);

  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full gap-4 ${className}`}
    >
      <div
        className={`animate-spin border-primary border-t-transparent rounded-full ${sizeClasses[size]}`}
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}
