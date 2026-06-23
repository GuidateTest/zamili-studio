/**
 * Pexels video asset utility.
 * Run `npm run download:videos` to search, download, and update the manifest.
 * Scenes consume videos via `videoSrc()` from this module.
 */
export { PEXELS_VIDEOS, videoSrc, hasVideo, type VideoKey } from "./pexels-videos";

export const VIDEO_SCENE_MAP = {
  hook: "real-estate-agent-phone",
  followUp: "customer-texting",
  lostLead: "smartphone-notifications",
  automationIntro: "office-workspace",
  workflow: "businessman-working",
  dashboard: "property-investment",
  timer: "office-workspace",
  closing: "sales-call",
  cta: "dubai-skyline",
} as const;
