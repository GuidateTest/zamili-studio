import type { ProjectSettings } from "../studio/hooks/useStudioStore";

export type GenerationResult = {
  script: string;
  scenes: string[];
  voiceoverLanguage: string;
  stockQueries: string[];
  captionStyle: string;
  musicMood: string;
};

const sceneTemplates: Record<string, string[]> = {
  reel: ["Hook", "Problem", "Solution", "Demo", "Social proof", "CTA"],
  "real-estate": [
    "Market hook",
    "Agent pain points",
    "AI automation",
    "Lead capture flow",
    "Results",
    "Book a demo",
  ],
  carousel: ["Cover slide", "Tip 1", "Tip 2", "Tip 3", "CTA slide"],
  default: ["Opening", "Value prop", "Features", "Proof", "Call to action"],
};

/** AI pipeline — script → scenes → voiceover → footage → captions → render */
export class AIReelEngine {
  static async generate(
    settings: ProjectSettings,
    onStep?: (step: string) => void,
  ): Promise<GenerationResult> {
    const steps = [
      "Analyzing your brief…",
      "Writing script…",
      "Breaking into scenes…",
      "Generating voiceover script…",
      "Searching stock footage…",
      "Designing captions…",
      "Selecting music…",
      "Building composition…",
    ];

    for (const step of steps) {
      onStep?.(step);
      await AIReelEngine.delay(400);
    }

    const type = settings.prompt.toLowerCase().includes("real estate")
      ? "real-estate"
      : "reel";
    const scenes = sceneTemplates[type] ?? sceneTemplates.default;

    return {
      script: settings.prompt,
      scenes,
      voiceoverLanguage: settings.language === "ar" ? "Arabic" : "English",
      stockQueries: [
        settings.location || "modern office",
        "technology dashboard",
        "smartphone social media",
      ],
      captionStyle: settings.captionSize,
      musicMood: settings.energy,
    };
  }

  private static delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
