export const FPS = 60;
export const TRANSITION_FRAMES = 20;

export const SCENE_DURATIONS = {
  hook: 817,
  competitors: 1149,
  reveal: 305,
  automationFlow: 544,
  platform: 526,
  pricing: 190,
  cta: 307,
} as const;

export const SCENE_ORDER = [
  "hook",
  "competitors",
  "reveal",
  "automationFlow",
  "platform",
  "pricing",
  "cta",
] as const;

export type SceneId = (typeof SCENE_ORDER)[number];

export const TOTAL_DURATION_FRAMES =
  Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0) -
  TRANSITION_FRAMES * (SCENE_ORDER.length - 1);

export const getTransitionStarts = (): number[] => {
  const durations = SCENE_ORDER.map((id) => SCENE_DURATIONS[id]);
  const starts: number[] = [];
  let acc = 0;
  for (let i = 0; i < durations.length - 1; i++) {
    acc += durations[i];
    starts.push(acc - (i + 1) * TRANSITION_FRAMES);
  }
  return starts;
};

export const CTA_START_FRAME = (() => {
  const durations = SCENE_ORDER.map((id) => SCENE_DURATIONS[id]);
  let acc = 0;
  for (let i = 0; i < durations.length - 1; i++) acc += durations[i];
  return acc - (SCENE_ORDER.length - 1) * TRANSITION_FRAMES;
})();
