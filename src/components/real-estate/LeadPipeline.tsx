import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const STEPS = ["Lead in", "AI reply", "Tour set", "Close"];

type LeadPipelineProps = {
  delay?: number;
  accent?: string;
  rtl?: boolean;
};

export const LeadPipeline: React.FC<LeadPipelineProps> = ({
  delay = 24,
  accent = "#22c55e",
  rtl = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = rtl ? ["استفسار", "رد AI", "جولة", "إغلاق"] : STEPS;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginTop: 28,
      }}
    >
      {steps.map((label, i) => {
        const p = spring({
          frame: frame - delay - i * 10,
          fps,
          config: { damping: 16, stiffness: 140 },
        });
        return (
          <div
            key={label}
            style={{
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
              padding: "12px 18px",
              borderRadius: 14,
              border: `1px solid ${accent}66`,
              background: `${accent}18`,
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              letterSpacing: 0.2,
            }}
          >
            {label}
            {i < steps.length - 1 ? (
              <span style={{ marginInlineStart: 8, opacity: 0.55 }}>→</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
