type StudioLogoProps = {
  /** full = wordmark (zamili-studios.png), mark = icon only (logo.png) */
  variant?: "full" | "mark";
  height?: number;
  style?: React.CSSProperties;
  alt?: string;
};

/** Official Zamili Studio branding */
export const StudioLogo: React.FC<StudioLogoProps> = ({
  variant = "full",
  height = 36,
  style,
  alt = "Zamili Studio",
}) => {
  const src = variant === "full" ? "/zamili-studios.png" : "/logo.png";

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      style={{
        width: variant === "full" ? "auto" : height,
        maxWidth: variant === "full" ? 200 : height,
        objectFit: "contain",
        flexShrink: 0,
        display: "block",
        ...style,
      }}
    />
  );
};
