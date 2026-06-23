export type GeneratedProjectSettings = {
  prompt: string;
  language?: "en" | "ar";
  energy?: "calm" | "balanced" | "energetic";
  location?: string;
  captionSize?: "sm" | "md" | "lg";
  animations?: "minimal" | "balanced" | "premium";
  music?: boolean;
};

export const GENERATED_REEL_FPS = 60;
export const GENERATED_SCENE_DURATION = 260;
export const GENERATED_TRANSITION_FRAMES = 18;

export const GENERATED_REEL_SCENES = [
  { id: "hook", label: "Market Hook" },
  { id: "pain", label: "Agent Pain" },
  { id: "automation", label: "AI Automation" },
  { id: "workflow", label: "Lead Flow" },
  { id: "proof", label: "Results" },
  { id: "cta", label: "Book Demo" },
] as const;

export const GENERATED_REEL_DURATION =
  GENERATED_REEL_SCENES.length * GENERATED_SCENE_DURATION -
  (GENERATED_REEL_SCENES.length - 1) * GENERATED_TRANSITION_FRAMES;

export const getSceneStartFrame = (index: number) =>
  index * (GENERATED_SCENE_DURATION - GENERATED_TRANSITION_FRAMES);
