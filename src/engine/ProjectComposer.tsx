import { Composition } from "remotion";
import {
  GENERATED_REEL_DURATION,
  GENERATED_REEL_FPS,
  GeneratedProjectReel,
  type GeneratedProjectSettings,
} from "./GeneratedProjectReel";
import {
  LandingHeroLoop,
  LandingRenderLoop,
  LandingWorkflowLoop,
} from "../landing/LandingAnimations";

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
    defaultProps: { project: defaultReelProject },
  },
  {
    id: "LandingHeroLoop",
    component: LandingHeroLoop,
    durationInFrames: 180,
    fps: 30,
    width: 960,
    height: 540,
    label: "Landing Hero Loop",
  },
  {
    id: "LandingWorkflowLoop",
    component: LandingWorkflowLoop,
    durationInFrames: 180,
    fps: 30,
    width: 960,
    height: 540,
    label: "Landing Workflow Loop",
  },
  {
    id: "LandingRenderLoop",
    component: LandingRenderLoop,
    durationInFrames: 180,
    fps: 30,
    width: 960,
    height: 540,
    label: "Landing Render Loop",
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
        defaultProps={"defaultProps" in c ? c.defaultProps : undefined}
      />
    ))}
  </>
);

export const getDefaultComposition = () => COMPOSITIONS[0];
