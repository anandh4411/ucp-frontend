import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  theme?: "light" | "dark" | "system";
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
  className?: string;
  disabled?: boolean;
}

export function ThemeToggle({
  theme = "light",
  onThemeChange,
  className = "",
  disabled = false,
}: ThemeToggleProps) {
  const toggleTheme = () => {
    if (onThemeChange) {
      const newTheme = theme === "light" ? "dark" : "light";
      onThemeChange(newTheme as "light" | "dark" | "system");
    }
  };

  const getThemeIcon = () => {
    return theme === "light" ? <Moon size={18} /> : <Sun size={18} />;
  };

  const getThemeTooltip = () => {
    return theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  };

  if (disabled) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`size-9 text-muted-foreground hover:text-foreground ${className}`}
      onClick={toggleTheme}
      title={getThemeTooltip()}
    >
      {getThemeIcon()}
    </Button>
  );
}
