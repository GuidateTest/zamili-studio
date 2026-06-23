import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  GENERATED_REEL_DURATION,
  GENERATED_REEL_SCENES,
  getSceneStartFrame,
} from "./reel-config";

const TRANSITION_SFX = [
  "assets/sfx/cinematic-impact.mp3",
  "assets/sfx/notification-pop.mp3",
  "assets/sfx/fast-whoosh.mp3",
  "assets/sfx/digital-click.mp3",
  "assets/sfx/transition-sweep.mp3",
] as const;

const transitionStarts = GENERATED_REEL_SCENES.slice(1).map((_, i) =>
  getSceneStartFrame(i + 1),
);

type ReelAudioProps = {
  music?: boolean;
};

export const ReelAudio: React.FC<ReelAudioProps> = ({ music = true }) => {
  const frame = useCurrentFrame();

  if (!music) return null;

  const fadeIn = interpolate(frame, [0, 40], [0, 0.26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [GENERATED_REEL_DURATION - 120, GENERATED_REEL_DURATION],
    [0.26, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const volume = Math.min(fadeIn, fadeOut || fadeIn);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Audio src={staticFile("audio/music.wav")} volume={volume} loop />

      {transitionStarts.map((start, i) => (
        <Sequence key={i} from={start} durationInFrames={22}>
          <Audio src={staticFile(TRANSITION_SFX[i] ?? TRANSITION_SFX[0])} volume={0.42} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
