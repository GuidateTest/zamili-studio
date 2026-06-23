import type { GeneratedProjectSettings } from "./reel-config";
import { COMPOSITIONS } from "./ProjectComposer";

export const resolveCompositionId = (_project: GeneratedProjectSettings) => "AIProjectReel";

export const resolveComposition = (project: GeneratedProjectSettings) => {
  const id = resolveCompositionId(project);
  return COMPOSITIONS.find((c) => c.id === id) ?? COMPOSITIONS[0];
};

export const getCompositionById = (id: string) =>
  COMPOSITIONS.find((c) => c.id === id) ?? COMPOSITIONS[0];
