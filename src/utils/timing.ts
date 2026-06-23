import { SCENE_DURATIONS, SCENE_ORDER, TRANSITION_FRAMES, type SceneId } from "./timing-core";
import { VOICEOVER_DURATION_FRAMES as VO_FRAMES } from "../audio/voiceover-meta";

export * from "./timing-core";

export const VOICEOVER_DURATION_FRAMES = VO_FRAMES;

export const isVoiceoverActive = (frame: number) =>
  frame >= 8 && frame <= 8 + VOICEOVER_DURATION_FRAMES;

/** Per-scene audio marker frame ranges for comments / subtitles */
export const getSceneFrameRange = (sceneId: SceneId) => {
  const map = getSceneStartsMap();
  const start = map[sceneId];
  return { from: start, to: start + SCENE_DURATIONS[sceneId] };
};

export const getSceneStartsMap = (): Record<SceneId, number> => {
  const map = {} as Record<SceneId, number>;
  let cursor = 0;
  SCENE_ORDER.forEach((id, i) => {
    map[id] = cursor - i * TRANSITION_FRAMES;
    cursor += SCENE_DURATIONS[id];
  });
  return map;
};
