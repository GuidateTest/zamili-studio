import { Composition } from "remotion";
import {
  GENERATED_REEL_DURATION,
  GENERATED_REEL_FPS,
  GeneratedProjectReel,
  type GeneratedProjectSettings,
} from "./GeneratedProjectReel";

const defaultReelProject = {
  prompt:
    "Create a Reel explaining how AI automation helps real estate agents save time and close more deals.",
  language: "en",
  energy: "balanced",
  location: "",
  captionSize: "md",
  animations: "premium",
  music: true,
} satisfies GeneratedProjectSettings;

/** Registers all video compositions for the render engine */
export const COMPOSITIONS = [
  {
    id: "AIProjectReel",
    component: GeneratedProjectReel,
    durationInFrames: GENERATED_REEL_DURATION,
    fps: GENERATED_REEL_FPS,
    width: 1080,
    height: 1920,
    label: "AI Project Reel",
  },
] as const;

export type CompositionId = (typeof COMPOSITIONS)[number]["id"];

export const ProjectComposer: React.FC = () => (
  <>
    {COMPOSITIONS.map((c) => (
      <Composition
        key={c.id}
        id={c.id}
        component={c.component}
        durationInFrames={c.durationInFrames}
        fps={c.fps}
        width={c.width}
        height={c.height}
        defaultProps={{ project: defaultReelProject }}
      />
    ))}
  </>
);

export const getDefaultComposition = () => COMPOSITIONS[0];
