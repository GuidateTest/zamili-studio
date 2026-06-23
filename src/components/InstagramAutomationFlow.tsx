import { interpolate, useCurrentFrame } from "remotion";
import { MotionSlideIn } from "./motion/StudioMotion";
import { COLORS } from "../utils/colors";
import { BODY_FONT } from "../utils/fonts";
import { useVoiceReactive } from "../hooks/useVoiceReactive";

const STEPS = [
  {
    id: "comment",
    label: "Instagram Comment",
    body: '"Interested! How much?"',
    icon: "💬",
    accent: COLORS.instagram,
  },
  {
    id: "trigger",
    label: "Automation triggers",
    body: "Keyword detected → send DM",
    icon: "⚡",
    accent: COLORS.accent,
  },
  {
    id: "dm",
    label: "Auto DM sent",
    body: "Hey! Here's everything you need 👇",
    icon: "✉️",
    accent: COLORS.blue,
  },
  {
    id: "link",
    label: "Link button",
    body: "View property & book a call",
    icon: "🔗",
    accent: COLORS.success,
    isButton: true,
  },
];

export const InstagramAutomationFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { amplitude } = useVoiceReactive();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        padding: "0 32px",
        transform: `scale(${1 + amplitude * 0.02})`,
      }}
    >
      {STEPS.map((step, i) => {
        const delay = 20 + i * 45;
        const lineOpacity = interpolate(frame - delay - 15, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={step.id}>
            <MotionSlideIn delay={delay}>
              <div
                style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.hairline}`,
                  borderRadius: 18,
                  padding: "18px 22px",
                  boxShadow: COLORS.shadow,
                  borderLeft: `4px solid ${step.accent}`,
                }}
              >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{step.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: BODY_FONT,
                      fontSize: 13,
                      fontWeight: 600,
                      color: step.accent,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {step.label}
                  </div>
                  {step.isButton ? (
                    <div
                      style={{
                        marginTop: 10,
                        display: "inline-block",
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: COLORS.accent,
                        color: COLORS.textOnAccent,
                        fontFamily: BODY_FONT,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {step.body}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 17,
                        color: COLORS.ink,
                        marginTop: 6,
                        fontWeight: 500,
                      }}
                    >
                      {step.body}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </MotionSlideIn>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 2,
                  height: 24,
                  background: COLORS.hairline,
                  margin: "6px auto",
                  opacity: lineOpacity,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
