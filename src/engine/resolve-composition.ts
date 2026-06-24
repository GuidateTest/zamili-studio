import type { GeneratedProjectSettings } from "./reel-config";
import { COMPOSITIONS } from "./ProjectComposer";

export const resolveCompositionId = () => "AIProjectReel";

export const resolveComposition = (project: GeneratedProjectSettings) => {
  void project;
  const id = resolveCompositionId();
  return COMPOSITIONS.find((c) => c.id === id) ?? COMPOSITIONS[0];
};

export const getCompositionById = (id: string) =>
  COMPOSITIONS.find((c) => c.id === id) ?? COMPOSITIONS[0];
