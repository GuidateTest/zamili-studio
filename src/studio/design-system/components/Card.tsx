import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { radius } from "../tokens";

type CardProps = {
  children: React.ReactNode;
  hover?: boolean;
  padding?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 20,
  onClick,
  style,
}) => {
  const { tokens } = useTheme();

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, boxShadow: tokens.shadowLg } : undefined}
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: radius.lg,
        padding,
        boxShadow: tokens.shadow,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
