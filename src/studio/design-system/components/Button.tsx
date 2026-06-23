import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { radius } from "../tokens";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  style,
  disabled,
  onClick,
  type = "button",
}) => {
  const { tokens } = useTheme();

  const sizes = {
    sm: { padding: "6px 12px", fontSize: 13 },
    md: { padding: "10px 18px", fontSize: 14 },
    lg: { padding: "14px 24px", fontSize: 15 },
  };

  const variants = {
    primary: {
      background: tokens.primary,
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: tokens.bgSubtle,
      color: tokens.text,
      border: `1px solid ${tokens.border}`,
    },
    ghost: {
      background: "transparent",
      color: tokens.textSecondary,
      border: "none",
    },
    danger: {
      background: tokens.errorSoft,
      color: tokens.error,
      border: `1px solid ${tokens.error}33`,
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      type={type}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: radius.md,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.15s",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {icon}
      {children}
    </motion.button>
  );
};
