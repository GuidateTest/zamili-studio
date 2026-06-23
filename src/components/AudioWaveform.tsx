import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useVoiceAmplitude } from "../hooks/useVoiceAmplitude";
import { COLORS } from "../utils/colors";
import { FPS } from "../utils/timing";

export const AudioWaveform: React.FC = () => {
  const { samples, amplitude } = useVoiceAmplitude();
  const frame = useCurrentFrame();

  if (!samples.length) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 48,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: 48,
          opacity: 0.35 + amplitude * 0.65,
          transform: `scaleY(${1 + amplitude * 0.25})`,
        }}
      >
        {samples.map((v, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: Math.max(4, Math.abs(v) * 80),
              borderRadius: 2,
              background: COLORS.accent,
              opacity: 0.5 + Math.abs(v) * 0.5,
              transform: `translateY(${Math.sin(frame / FPS + i * 0.3) * amplitude * 2}px)`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
