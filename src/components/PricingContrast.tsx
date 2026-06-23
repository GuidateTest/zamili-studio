import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../utils/colors";
import { BODY_FONT, DISPLAY_FONT } from "../utils/fonts";

export const PricingContrast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vs = spring({ frame: frame - 80, fps, config: { damping: 16, stiffness: 140 } });

  return (
    <div style={{ padding: "0 48px", maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {/* ManyChat model */}
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.hairline}`,
            borderRadius: 20,
            padding: 28,
            boxShadow: COLORS.shadow,
            opacity: spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 160 } }),
            transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 160 } }), [0, 1], [24, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: BODY_FONT, fontSize: 14, color: COLORS.muted, fontWeight: 600 }}>
            Others charge by
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: 700, color: COLORS.danger, marginTop: 8 }}>
            Contacts
          </div>
          <div style={{ fontFamily: BODY_FONT, fontSize: 15, color: COLORS.muted, marginTop: 12, lineHeight: 1.5 }}>
            2,000 contacts = pay more as you grow — even if you only reply to a few.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: DISPLAY_FONT,
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.muted,
            opacity: vs,
          }}
        >
          vs
        </div>

        {/* Zamili model */}
        <div
          style={{
            background: COLORS.accentSoft,
            border: `2px solid ${COLORS.accent}`,
            borderRadius: 20,
            padding: 28,
            boxShadow: COLORS.shadowPop,
            opacity: spring({ frame: frame - 50, fps, config: { damping: 18, stiffness: 160 } }),
            transform: `translateY(${interpolate(spring({ frame: frame - 50, fps, config: { damping: 18, stiffness: 160 } }), [0, 1], [24, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: BODY_FONT, fontSize: 14, color: COLORS.accent, fontWeight: 600 }}>
            Zamili charges by
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: 700, color: COLORS.accent, marginTop: 8 }}>
            Interactions
          </div>
          <div style={{ fontFamily: BODY_FONT, fontSize: 15, color: COLORS.inkSoft, marginTop: 12, lineHeight: 1.5 }}>
            Comments · DMs · WhatsApp — pay for what you actually use.
          </div>
        </div>
      </div>
    </div>
  );
};
