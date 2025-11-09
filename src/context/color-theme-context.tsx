import { createContext, useContext, useEffect, useState } from "react";

type ColorTheme = "military";

type ColorThemeProviderProps = {
  children: React.ReactNode;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
};

type ColorThemeProviderState = {
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

const initialState: ColorThemeProviderState = {
  colorTheme: "military",
  setColorTheme: () => null,
};

const ColorThemeProviderContext =
  createContext<ColorThemeProviderState>(initialState);

// Military theme with olive green, khaki, and army colors
const colorThemes = {
  military: {
    light: {
      primary: "oklch(0.45 0.12 145)", // Olive green
      primaryForeground: "oklch(0.98 0.01 145)",
      ring: "oklch(0.45 0.12 145)",
      sidebarPrimary: "oklch(0.35 0.10 145)", // Darker olive
      sidebarPrimaryForeground: "oklch(0.98 0.01 145)",
      sidebarRing: "oklch(0.45 0.12 145)",
      chart1: "oklch(0.45 0.12 145)", // Olive
      chart2: "oklch(0.55 0.10 75)", // Khaki/tan
      chart3: "oklch(0.40 0.08 130)", // Forest green
      chart4: "oklch(0.50 0.06 60)", // Desert sand
      chart5: "oklch(0.35 0.15 145)", // Deep olive
    },
    dark: {
      primary: "oklch(0.55 0.12 145)", // Lighter olive for dark mode
      primaryForeground: "oklch(0.15 0.02 145)",
      ring: "oklch(0.50 0.12 145)",
      sidebarPrimary: "oklch(0.45 0.12 145)",
      sidebarPrimaryForeground: "oklch(0.95 0.01 145)",
      sidebarRing: "oklch(0.50 0.12 145)",
      chart1: "oklch(0.55 0.12 145)",
      chart2: "oklch(0.60 0.10 75)",
      chart3: "oklch(0.50 0.08 130)",
      chart4: "oklch(0.55 0.06 60)",
      chart5: "oklch(0.45 0.15 145)",
    },
  },
};

export function ColorThemeProvider({
  children,
  defaultColorTheme = "military",
  storageKey = "ucp-ui-color-theme",
  ...props
}: ColorThemeProviderProps) {
  const [colorTheme, _setColorTheme] = useState<ColorTheme>(() => {
    try {
      const stored = localStorage.getItem(storageKey) as ColorTheme;
      return stored === "military" ? stored : defaultColorTheme;
    } catch {
      return defaultColorTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyColorTheme = (theme: ColorTheme) => {
      if (!colorThemes[theme]) return;

      const isDark = root.classList.contains("dark");
      const colors = colorThemes[theme][isDark ? "dark" : "light"];

      root.style.setProperty("--primary", colors.primary);
      root.style.setProperty("--primary-foreground", colors.primaryForeground);
      root.style.setProperty("--ring", colors.ring);
      root.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
      root.style.setProperty(
        "--sidebar-primary-foreground",
        colors.sidebarPrimaryForeground
      );
      root.style.setProperty("--sidebar-ring", colors.sidebarRing);

      root.style.setProperty("--chart-1", colors.chart1);
      root.style.setProperty("--chart-2", colors.chart2);
      root.style.setProperty("--chart-3", colors.chart3);
      root.style.setProperty("--chart-4", colors.chart4);
      root.style.setProperty("--chart-5", colors.chart5);
    };

    applyColorTheme(colorTheme);

    const observer = new MutationObserver(() => {
      applyColorTheme(colorTheme);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [colorTheme]);

  const setColorTheme = (theme: ColorTheme) => {
    try {
      localStorage.setItem(storageKey, theme);
      _setColorTheme(theme);
    } catch {
      _setColorTheme(theme);
    }
  };

  const value = {
    colorTheme,
    setColorTheme,
  };

  return (
    <ColorThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ColorThemeProviderContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeProviderContext);

  if (context === undefined)
    throw new Error("useColorTheme must be used within a ColorThemeProvider");

  return context;
};

export { colorThemes };
export type { ColorTheme };
