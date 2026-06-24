import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const bg = {
  background:
    "radial-gradient(circle at 20% 20%, rgba(36, 171, 255, 0.35), transparent 34%), radial-gradient(circle at 80% 10%, rgba(118, 86, 255, 0.32), transparent 30%), linear-gradient(135deg, #050711 0%, #0a1020 52%, #020308 100%)",
};

const card = {
  border: "1px solid rgba(163, 190, 255, 0.18)",
  background: "rgba(8, 13, 28, 0.72)",
  boxShadow: "0 30px 90px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(18px)",
} as const;

const GlowOrb: React.FC<{ x: number; y: number; size: number; delay?: number }> = ({
  x,
  y,
  size,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin((frame + delay) / 18) * 0.5 + 0.5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 999,
        background: `radial-gradient(circle, rgba(68, 184, 255, ${0.55 + pulse * 0.25}), rgba(51, 98, 255, 0.1) 56%, transparent 72%)`,
        filter: "blur(2px)",
        transform: `scale(${0.86 + pulse * 0.22})`,
      }}
    />
  );
};

export const LandingHeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const orbit = frame * 2.4;

  return (
    <AbsoluteFill style={{ ...bg, overflow: "hidden", fontFamily: "Inter, Arial" }}>
      <GlowOrb x={90} y={70} size={160} />
      <GlowOrb x={700} y={70} size={120} delay={32} />
      <GlowOrb x={720} y={360} size={190} delay={64} />

      <div
        style={{
          position: "absolute",
          inset: 54,
          borderRadius: 42,
          ...card,
          transform: `scale(${0.95 + intro * 0.05})`,
          opacity: intro,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            borderRadius: 32,
            border: "1px solid rgba(76, 147, 255, 0.16)",
            background:
              "linear-gradient(135deg, rgba(17, 31, 67, 0.82), rgba(5, 8, 19, 0.92))",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 78,
            top: 86,
            color: "white",
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: -1.6,
            lineHeight: 1.02,
          }}
        >
          Prompt.
          <br />
          Preview.
          <br />
          Render.
        </div>

        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 78,
            display: "flex",
            gap: 10,
          }}
        >
          {["AI script", "Voice", "Timeline", "MP4"].map((label, index) => (
            <div
              key={label}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                color: "#cfe5ff",
                fontSize: 14,
                background: `rgba(34, 129, 255, ${0.14 + index * 0.025})`,
                border: "1px solid rgba(87, 165, 255, 0.28)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            right: 82,
            top: 74,
            width: 318,
            height: 390,
            borderRadius: 38,
            background:
              "linear-gradient(180deg, rgba(22, 132, 255, 0.34), rgba(5, 9, 24, 0.94))",
            border: "1px solid rgba(148, 199, 255, 0.24)",
            boxShadow: "0 25px 80px rgba(0, 111, 255, 0.24)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 22,
              borderRadius: 28,
              background:
                "radial-gradient(circle at 50% 30%, rgba(82, 201, 255, 0.45), transparent 28%), linear-gradient(180deg, rgba(2, 5, 16, 0.1), rgba(2, 5, 16, 0.82))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          {Array.from({ length: 18 }).map((_, index) => {
            const angle = orbit + index * 20;
            const radius = 92 + (index % 3) * 22;
            const x = 159 + Math.cos((angle * Math.PI) / 180) * radius;
            const y = 184 + Math.sin((angle * Math.PI) / 180) * radius * 0.82;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 7 + (index % 4),
                  height: 7 + (index % 4),
                  borderRadius: 999,
                  background: index % 2 ? "#75ddff" : "#2b8cff",
                  boxShadow: "0 0 24px rgba(78, 187, 255, 0.8)",
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LandingWorkflowLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = (frame % 180) / 180;
  const x = interpolate(progress, [0, 0.33, 0.66, 1], [112, 360, 604, 788]);

  return (
    <AbsoluteFill style={{ ...bg, overflow: "hidden", fontFamily: "Inter, Arial" }}>
      <div style={{ position: "absolute", inset: 52, borderRadius: 38, ...card }} />
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 270,
          height: 2,
          background:
            "linear-gradient(90deg, rgba(48, 136, 255, 0.1), rgba(61, 188, 255, 0.9), rgba(124, 92, 255, 0.1))",
        }}
      />
      {["Prompt", "Agent", "Timeline", "Render"].map((label, index) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: 84 + index * 226,
            top: 184,
            width: 156,
            height: 156,
            borderRadius: 30,
            ...card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 22,
            boxShadow:
              index === Math.floor(progress * 4)
                ? "0 0 54px rgba(40, 157, 255, 0.5)"
                : card.boxShadow,
          }}
        >
          {label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: x,
          top: 254,
          width: 34,
          height: 34,
          borderRadius: 999,
          background: "#55d7ff",
          boxShadow: "0 0 38px rgba(85, 215, 255, 0.9)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 78,
          color: "#a9c4e8",
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        One local workflow from idea to export.
      </div>
    </AbsoluteFill>
  );
};

export const LandingRenderLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / 18) % 9;

  return (
    <AbsoluteFill style={{ ...bg, overflow: "hidden", fontFamily: "Inter, Arial" }}>
      <div style={{ position: "absolute", inset: 48, borderRadius: 40, ...card }} />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 70,
          color: "white",
          fontSize: 34,
          fontWeight: 850,
          letterSpacing: -1.2,
        }}
      >
        Render queue
      </div>
      <div
        style={{
          position: "absolute",
          right: 82,
          top: 78,
          color: "#75ddff",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        1080 × 1920 · MP4
      </div>
      <div
        style={{
          position: "absolute",
          left: 78,
          right: 78,
          top: 142,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => {
          const lit = index === active;
          return (
            <div
              key={index}
              style={{
                height: 98,
                borderRadius: 24,
                background: lit
                  ? "linear-gradient(135deg, rgba(55, 178, 255, 0.56), rgba(68, 71, 255, 0.38))"
                  : "rgba(255,255,255,0.045)",
                border: `1px solid ${lit ? "rgba(139, 220, 255, 0.58)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: lit ? "0 0 42px rgba(52, 176, 255, 0.32)" : "none",
                display: "flex",
                alignItems: "center",
                padding: 20,
                color: lit ? "white" : "#91a4c2",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Scene {index + 1}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          bottom: 74,
          height: 12,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${12 + ((frame % 180) / 180) * 88}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #258dff, #78e5ff)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
