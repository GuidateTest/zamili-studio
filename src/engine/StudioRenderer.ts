/** CLI render wrapper — use: npm run render:reel */
export const RENDER_COMMANDS = {
  reel: {
    composition: "AIProjectReel",
    output: "out/ai-project-reel.mp4",
  },
} as const;

export type RenderJob = {
  compositionId: string;
  outputPath: string;
  status: "idle" | "rendering" | "done" | "error";
  progress: number;
};

export const createRenderJob = (
  compositionId: keyof typeof RENDER_COMMANDS | string = "AIProjectReel",
): RenderJob => {
  const preset =
    compositionId === "AIProjectReel"
      ? RENDER_COMMANDS.reel
      : { composition: compositionId, output: `out/${compositionId}.mp4` };

  return {
    compositionId: preset.composition,
    outputPath: preset.output,
    status: "idle",
    progress: 0,
  };
};
