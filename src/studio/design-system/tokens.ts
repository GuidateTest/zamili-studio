/** Zamili Studio design tokens — Linear × Stripe × Notion aesthetic */

export type ThemeMode = "dark" | "light";

export const palette = {
  dark: {
    bg: "#09090b",
    bgElevated: "#111113",
    bgSubtle: "#18181b",
    bgHover: "#1f1f23",
    surface: "#141416",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.14)",
    text: "#fafafa",
    textSecondary: "#d4d4d8",
    textMuted: "#71717a",
    primary: "#1a81ff",
    primaryHover: "#4da3ff",
    primarySoft: "rgba(26, 129, 255, 0.12)",
    secondary: "#6366f1",
    secondarySoft: "rgba(99, 102, 241, 0.12)",
    accent: "#1e3a8a",
    accentSoft: "rgba(30, 58, 138, 0.2)",
    success: "#22c55e",
    successSoft: "rgba(34, 197, 94, 0.12)",
    warning: "#f59e0b",
    warningSoft: "rgba(245, 158, 11, 0.12)",
    error: "#ef4444",
    errorSoft: "rgba(239, 68, 68, 0.12)",
    gradient: "linear-gradient(135deg, #1a81ff 0%, #6366f1 50%, #1e3a8a 100%)",
    gradientSubtle: "linear-gradient(180deg, rgba(26,129,255,0.08) 0%, transparent 60%)",
    shadow: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)",
    shadowLg: "0 24px 64px rgba(0,0,0,0.5)",
    glow: "0 0 40px rgba(26, 129, 255, 0.15)",
  },
  light: {
    bg: "#fafaf9",
    bgElevated: "#ffffff",
    bgSubtle: "#f4f4f5",
    bgHover: "#e4e4e7",
    surface: "#ffffff",
    border: "rgba(0,0,0,0.08)",
    borderStrong: "rgba(0,0,0,0.12)",
    text: "#09090b",
    textSecondary: "#3f3f46",
    textMuted: "#71717a",
    primary: "#1a81ff",
    primaryHover: "#1570e0",
    primarySoft: "rgba(26, 129, 255, 0.08)",
    secondary: "#6366f1",
    secondarySoft: "rgba(99, 102, 241, 0.08)",
    accent: "#1e3a8a",
    accentSoft: "rgba(30, 58, 138, 0.08)",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.08)",
    warning: "#d97706",
    warningSoft: "rgba(217, 119, 6, 0.08)",
    error: "#dc2626",
    errorSoft: "rgba(220, 38, 38, 0.08)",
    gradient: "linear-gradient(135deg, #1a81ff 0%, #6366f1 50%, #1e3a8a 100%)",
    gradientSubtle: "linear-gradient(180deg, rgba(26,129,255,0.06) 0%, transparent 60%)",
    shadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
    shadowLg: "0 24px 64px rgba(0,0,0,0.1)",
    glow: "0 0 40px rgba(26, 129, 255, 0.1)",
  },
} as const;

export type ThemeTokens = (typeof palette)[ThemeMode];

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const font = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

export const motion = {
  spring: { type: "spring" as const, stiffness: 400, damping: 30 },
  smooth: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
} as const;
