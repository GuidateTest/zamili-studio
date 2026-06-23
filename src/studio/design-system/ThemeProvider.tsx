import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { palette, type ThemeMode, type ThemeTokens } from "./tokens";

type ThemeContextValue = {
  mode: ThemeMode;
  tokens: ThemeTokens;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("zamili-theme") as ThemeMode) ?? "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("zamili-theme", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      tokens: palette[mode],
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      setMode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
