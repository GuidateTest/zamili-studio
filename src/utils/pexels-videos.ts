import { staticFile } from "remotion";

export type VideoKey = string;

export const PEXELS_VIDEOS: Record<
  string,
  {
    file: string;
    query: string;
    staticPath: string;
    pexelsId?: number;
    photographer?: string;
  }
> = {};

export const videoSrc = (key: VideoKey): string => {
  const entry = PEXELS_VIDEOS[key];
  if (!entry) {
    throw new Error(`Video key "${key}" not found in manifest`);
  }
  return staticFile(entry.staticPath);
};

export const hasVideo = (key: VideoKey): boolean => Boolean(PEXELS_VIDEOS[key]);
