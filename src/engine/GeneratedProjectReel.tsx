import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLottie } from "../components/lottie/StudioLottie";
import { LeadPipeline } from "../components/real-estate/LeadPipeline";
import { VideoBackdrop } from "../components/VideoBackdrop";
import { ReelAudio } from "./ReelAudio";
import {
  GENERATED_REEL_SCENES,
  GENERATED_SCENE_DURATION,
  GENERATED_TRANSITION_FRAMES,
  type GeneratedProjectSettings,
} from "./reel-config";
import { buildReelScenes, type ReelSceneCopy } from "./reel-scene-copy";

export type { GeneratedProjectSettings } from "./reel-config";
export {
  GENERATED_REEL_DURATION,
  GENERATED_REEL_FPS,
  GENERATED_REEL_SCENES,
  GENERATED_SCENE_DURATION,
  GENERATED_TRANSITION_FRAMES,
} from "./reel-config";

type GeneratedProjectReelProps = {
  project?: GeneratedProjectSettings;
};

const fallbackPrompt =
  "Create a Reel explaining how AI automation helps business owners save time.";

const sceneAccent = ["#1a81ff", "#6366f1", "#22c55e", "#06b6d4", "#f59e0b", "#ffffff"];

const captionFontSize = (size?: GeneratedProjectSettings["captionSize"]) => {
  if (size === "lg") return 58;
  if (size === "sm") return 42;
  return 50;
};

const springConfig = (energy?: GeneratedProjectSettings["energy"]) => {
  if (energy === "energetic") return { damping: 14, stiffness: 180 };
  if (energy === "calm") return { damping: 22, stiffness: 90 };
  return { damping: 18, stiffness: 120 };
};

const SceneCard: React.FC<{
  index: number;
  scene: ReelSceneCopy;
  project: GeneratedProjectSettings;
}> = ({ index, scene, project }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = sceneAccent[index] ?? "#1a81ff";
  const entrance = spring({
    frame,
    fps,
    config: springConfig(project.energy),
  });
  const float = Math.sin((frame + index * 20) / 24) * 10;
  const titleSize = captionFontSize(project.captionSize);
  const premium = project.animations === "premium";
  const balanced = project.animations !== "minimal";
  const rtl = project.language === "ar";
  const showLottie = Boolean(scene.lottie) && balanced;
  const showPipeline = scene.id === "workflow" && balanced;

  return (
    <AbsoluteFill
      style={{
        color: "white",
        fontFamily: rtl ? "Tahoma, Arial, sans-serif" : "Inter, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <VideoBackdrop src={scene.video} zoom={premium} />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 24%, rgba(26,129,255,0.12))",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 80,
          borderRadius: 48,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(5,7,15,0.35)",
          boxShadow: `0 0 90px ${accent}33`,
          backdropFilter: "blur(2px)",
        }}
      />

      {premium && (
        <>
          <div
            style={{
              position: "absolute",
              width: 360,
              height: 360,
              borderRadius: "50%",
              right: -80,
              top: 220 + float,
              background: `${accent}22`,
              filter: "blur(12px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: 60,
              left: -70,
              bottom: 260 - float,
              rotate: "18deg",
              background: "rgba(99,102,241,0.18)",
            }}
          />
        </>
      )}

      {showLottie && (
        <StudioLottie
          name={scene.lottie!}
          startFrame={18}
          loop
          style={{
            position: "absolute",
            top: 120,
            right: rtl ? undefined : 72,
            left: rtl ? 72 : undefined,
            width: 120,
            height: 120,
            opacity: 0.9,
          }}
        />
      )}

      <Img
        src={staticFile("zamili-studios.png")}
        style={{
          position: "absolute",
          top: 86,
          left: rtl ? undefined : 90,
          right: rtl ? 90 : undefined,
          width: 190,
          height: "auto",
          objectFit: "contain",
          opacity: 0.92,
        }}
      />

      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          position: "absolute",
          top: 190,
          left: 90,
          right: 90,
          transform: `translateY(${interpolate(entrance, [0, 1], [50, 0])}px)`,
          opacity: entrance,
          textAlign: rtl ? "right" : "left",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "10px 18px",
            borderRadius: 999,
            color: accent,
            background: `${accent}1f`,
            border: `1px solid ${accent}55`,
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 34,
            letterSpacing: 0.6,
          }}
        >
          {scene.eyebrow}
        </div>
        <div
          style={{
            fontSize: titleSize,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: rtl ? 0 : -2.5,
            maxWidth: 820,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 31,
            lineHeight: 1.35,
            color: "rgba(255,255,255,0.82)",
            maxWidth: 780,
          }}
        >
          {scene.body}
        </div>

        {showPipeline && (
          <LeadPipeline delay={20} accent={accent} rtl={rtl} />
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 110,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {GENERATED_REEL_SCENES.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              background: i <= index ? accent : "rgba(255,255,255,0.14)",
              opacity: i === index ? 1 : 0.55,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const reelTransitions = (animations?: GeneratedProjectSettings["animations"]) => {
  const spring = springTiming({
    config: { damping: 20, stiffness: 200 },
    durationInFrames: GENERATED_TRANSITION_FRAMES,
  });
  const linear = linearTiming({ durationInFrames: GENERATED_TRANSITION_FRAMES });

  if (animations === "minimal") {
    return Array.from({ length: GENERATED_REEL_SCENES.length - 1 }, () => ({
      presentation: fade(),
      timing: linear,
    }));
  }

  return [
    { presentation: fade(), timing: linear },
    { presentation: slide({ direction: "from-bottom" }), timing: spring },
    { presentation: fade(), timing: spring },
    { presentation: slide({ direction: "from-right" }), timing: spring },
    { presentation: slide({ direction: "from-bottom" }), timing: spring },
  ];
};

export const GeneratedProjectReel: React.FC<GeneratedProjectReelProps> = ({
  project = { prompt: fallbackPrompt, music: true, animations: "premium" },
}) => {
  const scenes = buildReelScenes(project);
  const transitions = reelTransitions(project.animations);

  return (
    <AbsoluteFill>
      <ReelAudio music={project.music !== false} />

      <TransitionSeries>
        {scenes.flatMap((scene, index) => {
          const nodes = [
            <TransitionSeries.Sequence
              key={scene.id}
              durationInFrames={GENERATED_SCENE_DURATION}
            >
              <SceneCard index={index} scene={scene} project={project} />
            </TransitionSeries.Sequence>,
          ];

          if (index < scenes.length - 1) {
            nodes.push(
              <TransitionSeries.Transition
                key={`${scene.id}-transition`}
                {...transitions[index]}
              />,
            );
          }

          return nodes;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
