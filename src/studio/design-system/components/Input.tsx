import { useTheme } from "../ThemeProvider";
import { radius } from "../tokens";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input: React.FC<InputProps> = ({ label, style, ...props }) => {
  const { tokens } = useTheme();

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 500, color: tokens.textSecondary }}>
          {label}
        </span>
      )}
      <input
        {...props}
        style={{
          padding: "12px 16px",
          borderRadius: radius.md,
          border: `1px solid ${tokens.border}`,
          background: tokens.bgSubtle,
          color: tokens.text,
          fontSize: 14,
          fontFamily: "inherit",
          outline: "none",
          ...style,
        }}
      />
    </label>
  );
};
