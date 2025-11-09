import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { fonts } from "@/config/fonts";
import { cn } from "@/lib/utils";
import { useFont } from "@/context/font-context";
import { useTheme } from "@/context/theme-context";
import { useColorTheme } from "@/context/color-theme-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const colorThemes = [
  "neutral",
  "rose",
  "red",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet",
] as const;

const appearanceFormSchema = z.object({
  font: z.enum(fonts, {
    invalid_type_error: "Select a font",
    required_error: "Please select a font.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

// Color theme preview colors for display
const colorThemePreview = {
  neutral: {
    primary: "#363636",
    secondary: "#f5f5f5",
  },
  rose: {
    primary: "#e11d48",
    secondary: "#fef2f2",
  },
  red: {
    primary: "#dc2626",
    secondary: "#fef2f2",
  },
  orange: {
    primary: "#ea580c",
    secondary: "#fff7ed",
  },
  green: {
    primary: "#16a34a",
    secondary: "#f0fdf4",
  },
  blue: {
    primary: "#2563eb",
    secondary: "#eff6ff",
  },
  yellow: {
    primary: "#ca8a04",
    secondary: "#fefce8",
  },
  violet: {
    primary: "#7c3aed",
    secondary: "#f5f3ff",
  },
};

// Theme Toggle Component
interface ThemeToggleProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Theme
      </label>
      <p className="text-sm text-muted-foreground">
        Select the theme for the dashboard.
      </p>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={theme === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeChange("light")}
          className="flex items-center"
        >
          <Sun className="h-4 w-4 mr-1" />
          <span>Light</span>
        </Button>
        <Button
          type="button"
          variant={theme === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeChange("dark")}
          className="flex items-center"
        >
          <Moon className="h-4 w-4 mr-1" />
          <span>Dark</span>
        </Button>
      </div>
    </div>
  );
};

// Color Theme Item Component
interface ColorThemeItemProps {
  colorTheme: string;
  isSelected: boolean;
  onSelect: (colorTheme: string) => void;
  primaryColor: string;
  secondaryColor: string;
}

const ColorThemeItem: React.FC<ColorThemeItemProps> = ({
  colorTheme,
  isSelected,
  onSelect,
  primaryColor,
  secondaryColor,
}) => {
  return (
    <div
      className={cn(
        "border-2 p-2 cursor-pointer transition-colors rounded-md",
        isSelected ? "border-primary" : "border-muted hover:border-accent"
      )}
      onClick={() => onSelect(colorTheme)}
    >
      <div
        className="space-y-2 rounded-sm p-2"
        style={{
          backgroundColor: secondaryColor,
        }}
      >
        <div
          className="h-6 w-full rounded-sm shadow-sm"
          style={{
            backgroundColor: primaryColor,
          }}
        />
        <div className="flex space-x-1">
          <div
            className="h-2 w-2/3 rounded-sm"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.6,
            }}
          />
          <div
            className="h-2 w-1/3 rounded-sm"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.3,
            }}
          />
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal capitalize text-xs">
        {colorTheme}
      </span>
    </div>
  );
};

// Main Appearance Form Component
export function AppearanceForm() {
  const { font, setFont } = useFont();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  const defaultValues: Partial<AppearanceFormValues> = {
    font,
  };

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  // Handle immediate font change
  const handleFontChange = (newFont: string) => {
    setFont(newFont as any);
  };

  // Handle immediate theme change
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  // Handle immediate color theme change
  const handleColorThemeChange = (newColorTheme: string) => {
    setColorTheme(newColorTheme as any);
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn(
                      "flex h-9 w-[200px] items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 appearance-none font-normal capitalize"
                    )}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFontChange(e.target.value);
                    }}
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDown className="absolute top-2.5 right-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
              <FormDescription className="font-manrope">
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      {/* Theme Toggle */}
      <ThemeToggle
        theme={theme as "light" | "dark"}
        onThemeChange={handleThemeChange}
      />

      {/* Color Theme Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Color Theme
        </label>
        <p className="text-sm text-muted-foreground">
          Select the color theme for the dashboard.
        </p>
        <div className="grid max-w-4xl grid-cols-4 gap-4 pt-2">
          {/* {colorThemes.map((theme) => (
            <ColorThemeItem
              key={theme}
              colorTheme={theme}
              isSelected={colorTheme === theme}
              onSelect={handleColorThemeChange}
              primaryColor={colorThemePreview[theme].primary}
              secondaryColor={colorThemePreview[theme].secondary}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}
