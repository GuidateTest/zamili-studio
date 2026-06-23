import { useTheme } from "../design-system/ThemeProvider";
import { spacing } from "../design-system/tokens";

type PlaceholderViewProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  description,
  icon,
}) => {
  const { tokens } = useTheme();

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xxl,
        textAlign: "center",
      }}
    >
      {icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: tokens.primarySoft,
            color: tokens.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          {icon}
        </div>
      )}
      <h1 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 700 }}>{title}</h1>
      <p style={{ margin: 0, color: tokens.textMuted, maxWidth: 420, lineHeight: 1.6, fontSize: 15 }}>
        {description}
      </p>
    </div>
  );
};
