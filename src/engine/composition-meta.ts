import {
  GENERATED_REEL_DURATION,
  GENERATED_REEL_FPS,
  GENERATED_REEL_SCENES,
  GENERATED_SCENE_DURATION,
} from "./GeneratedProjectReel";
import type { GeneratedProjectSettings } from "./reel-config";

export type CompositionScene = {
  id: string;
  label: string;
  durationFrames: number;
  startFrame: number;
  endFrame: number;
};

export const getCompositionScenes = (project?: GeneratedProjectSettings): CompositionScene[] => {
  return GENERATED_REEL_SCENES.map((scene, index) => ({
    id: scene.id,
    label: scene.label,
    durationFrames: GENERATED_SCENE_DURATION,
    startFrame: index * GENERATED_SCENE_DURATION,
    endFrame: (index + 1) * GENERATED_SCENE_DURATION,
  }));
};

export const getCompositionDuration = (_project?: GeneratedProjectSettings) =>
  GENERATED_REEL_DURATION;

export const getCompositionFps = (_project?: GeneratedProjectSettings) =>
  GENERATED_REEL_FPS;

export const FPS = GENERATED_REEL_FPS;
export const TOTAL_DURATION_FRAMES = GENERATED_REEL_DURATION;

export const formatTimecode = (frame: number, fps = GENERATED_REEL_FPS) => {
  const totalSec = frame / fps;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const f = Math.floor(frame % fps);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

export const formatDuration = (frames: number, fps = GENERATED_REEL_FPS) =>
  formatTimecode(frames, fps).slice(0, 5);
