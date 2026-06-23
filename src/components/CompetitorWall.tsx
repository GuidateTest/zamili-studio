import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../utils/colors";
import { BODY_FONT } from "../utils/fonts";

const COMPETITORS = [
  { name: "ManyChat", color: "#0084FF", bg: "#E8F4FF" },
  { name: "Hootsuite", color: "#FF7525", bg: "#FFF3EB" },
  { name: "Buffer", color: "#231F20", bg: "#F5F5F5" },
  { name: "Canva", color: "#7D2AE8", bg: "#F3EBFF" },
  { name: "Later", color: "#002DE4", bg: "#EBEEFF" },
  { name: "ChatGPT", color: "#10A37F", bg: "#E8F8F3" },
];

export const CompetitorWall: React.FC<{ collapseFrom?: number }> = ({
  collapseFrom = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        justifyContent: "center",
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 32px",
      }}
    >
      {COMPETITORS.map((c, i) => {
        const enter = spring({
          frame: frame - 15 - i * 5,
          fps,
          config: { damping: 16, stiffness: 180 },
        });
        const collapse = spring({
          frame: frame - collapseFrom - i * 3,
          fps,
          config: { damping: 14, stiffness: 160 },
        });
        const scale = interpolate(collapse, [0, 1], [1, 0.3]);
        const opacity = interpolate(collapse, [0, 0.6, 1], [1, 0.6, 0]);

        return (
          <div
            key={c.name}
            style={{
              padding: "14px 22px",
              borderRadius: 14,
              background: c.bg,
              border: `1px solid ${COLORS.hairline}`,
              boxShadow: COLORS.shadow,
              opacity: enter * opacity,
              transform: `scale(${enter * scale}) translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: BODY_FONT,
                fontSize: 18,
                fontWeight: 700,
                color: c.color,
              }}
            >
              {c.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
