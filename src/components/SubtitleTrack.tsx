import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENE_AUDIO_MARKERS } from "../audio/assets";
import { useVoiceAmplitude } from "../hooks/useVoiceAmplitude";
import { COLORS } from "../utils/colors";
import { BODY_FONT } from "../utils/fonts";
import { getSceneStartsMap, SCENE_DURATIONS } from "../utils/timing";

const SCENE_STARTS = getSceneStartsMap();

export const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { amplitude } = useVoiceAmplitude();

  const active = SCENE_AUDIO_MARKERS.find((marker) => {
    const start = SCENE_STARTS[marker.id] + 15;
    const end = start + SCENE_DURATIONS[marker.id as keyof typeof SCENE_DURATIONS] - 40;
    return frame >= start && frame <= end;
  });

  if (!active) return null;

  const start = SCENE_STARTS[active.id] + 15;
  const p = spring({
    frame: frame - start,
    fps,
    config: { damping: 18, stiffness: 220 },
  });

  const scale = 1 + amplitude * 0.06;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 40px",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          border: `1px solid ${COLORS.hairline}`,
          borderRadius: 14,
          padding: "14px 28px",
          boxShadow: COLORS.shadowPop,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${scale})`,
          maxWidth: 900,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: BODY_FONT,
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.ink,
            textAlign: "center",
            direction: "rtl",
            lineHeight: 1.4,
          }}
        >
          {active.subtitle}
        </p>
      </div>
    </div>
  );
};
