import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: Theme;
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  systemTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = localStorage.getItem("theme") as Theme;
      return stored || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });
  
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(getSystemTheme());
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = {
    theme,
    systemTheme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        // Handle localStorage errors silently
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export function useThemeClass() {
  const { theme, systemTheme } = useTheme();
  return theme === "system" ? systemTheme : theme;
}