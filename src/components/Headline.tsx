import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../utils/colors";
import { BODY_FONT, DISPLAY_FONT } from "../utils/fonts";
import { useVoiceReactive } from "../hooks/useVoiceReactive";

type HeadlineProps = {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  sub?: string;
  stagger?: number;
};

export const Headline: React.FC<HeadlineProps> = ({
  text,
  startFrame = 0,
  fontSize = 52,
  color = COLORS.ink,
  sub,
  stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { amplitude } = useVoiceReactive();
  const words = text.split(" ");

  return (
    <div
      style={{
        textAlign: "center",
        padding: "0 56px",
        transform: `scale(${1 + amplitude * 0.025})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.2em",
          fontFamily: DISPLAY_FONT,
          fontSize,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -0.03,
        }}
      >
        {words.map((word, i) => {
          const p = spring({
            frame: frame - startFrame - i * stagger,
            fps,
            config: { damping: 18, stiffness: 200 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      {sub && (
        <p
          style={{
            fontFamily: BODY_FONT,
            fontSize: 22,
            color: COLORS.muted,
            marginTop: 20,
            opacity: interpolate(frame - startFrame - 20, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
};
