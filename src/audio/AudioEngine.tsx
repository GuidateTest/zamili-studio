import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AUDIO, TRANSITION_SFX_FILES } from "./assets";
import {
  CTA_START_FRAME,
  getSceneStartsMap,
  getTransitionStarts,
  SCENE_DURATIONS,
  SCENE_ORDER,
  TOTAL_DURATION_FRAMES,
  TRANSITION_FRAMES,
  isVoiceoverActive,
} from "../utils/timing";

const SCENE_STARTS = getSceneStartsMap();

const musicVolume = (frame: number): number => {
  const voActive = isVoiceoverActive(frame);
  const transitionStarts = getTransitionStarts();

  let transitionBoost = 0;
  for (const start of transitionStarts) {
    const boost = interpolate(
      frame,
      [start - 6, start, start + TRANSITION_FRAMES, start + TRANSITION_FRAMES + 16],
      [0, 0.22, 0.22, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    transitionBoost = Math.max(transitionBoost, boost);
  }

  const ctaPeak = interpolate(
    frame,
    [CTA_START_FRAME, CTA_START_FRAME + 50, TOTAL_DURATION_FRAMES],
    [0, 0.35, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const base = voActive ? 0.12 : 0.28;
  return Math.min(0.75, base + transitionBoost + ctaPeak);
};

export const AudioEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = musicVolume(frame);
  const transitionStarts = getTransitionStarts();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Background music — ducked during voiceover */}
      <Audio src={AUDIO.music} volume={vol} loop />

      {/* ElevenLabs Arabic voiceover — one segment per scene, synced to cuts */}
      {SCENE_ORDER.map((sceneId) => (
        <Sequence
          key={sceneId}
          from={SCENE_STARTS[sceneId] + 8}
          durationInFrames={SCENE_DURATIONS[sceneId]}
        >
          <Audio
            src={staticFile(`assets/audio/segments/${sceneId}.mp3`)}
            volume={1}
          />
        </Sequence>
      ))}

      {/* Transition SFX — synced to scene cuts */}
      {transitionStarts.map((start, i) => (
        <Sequence key={i} from={start} durationInFrames={TRANSITION_FRAMES + 24}>
          <Audio src={TRANSITION_SFX_FILES[i] ?? TRANSITION_SFX_FILES[0]} volume={0.75} />
        </Sequence>
      ))}

      {/* Scene accent SFX */}
      <Sequence from={transitionStarts[0] ?? 0} durationInFrames={30}>
        <Audio src={AUDIO.sfx.cinematicImpact} volume={0.65} />
      </Sequence>
      <Sequence from={(transitionStarts[1] ?? 0) + 40} durationInFrames={25}>
        <Audio src={AUDIO.sfx.notificationPop} volume={0.5} />
      </Sequence>
      <Sequence from={transitionStarts[3] ?? 900} durationInFrames={25}>
        <Audio src={AUDIO.sfx.digitalClick} volume={0.55} />
      </Sequence>
      <Sequence from={CTA_START_FRAME} durationInFrames={35}>
        <Audio src={AUDIO.sfx.successChime} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Dev fallback when voiceover.mp3 is missing */
export const hasVoiceoverAsset = () => {
  try {
    return Boolean(staticFile("assets/audio/voiceover.mp3"));
  } catch {
    return false;
  }
};
