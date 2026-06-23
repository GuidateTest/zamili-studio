import { staticFile } from "remotion";

/** Public audio paths only — safe for Remotion components */
export const AUDIO = {
  voiceover: staticFile("assets/audio/voiceover.mp3"),
  music: staticFile("audio/music.wav"),
  sfx: {
    cinematicImpact: staticFile("assets/sfx/cinematic-impact.mp3"),
    notificationPop: staticFile("assets/sfx/notification-pop.mp3"),
    fastWhoosh: staticFile("assets/sfx/fast-whoosh.mp3"),
    digitalClick: staticFile("assets/sfx/digital-click.mp3"),
    glitchDrop: staticFile("assets/sfx/glitch-drop.mp3"),
    successChime: staticFile("assets/sfx/success-chime.mp3"),
    dataFlow: staticFile("assets/sfx/data-flow.mp3"),
    transitionSweep: staticFile("assets/sfx/transition-sweep.mp3"),
  },
} as const;

/** Synced to scene transitions (6) */
export const TRANSITION_SFX_FILES = [
  AUDIO.sfx.cinematicImpact,
  AUDIO.sfx.notificationPop,
  AUDIO.sfx.fastWhoosh,
  AUDIO.sfx.digitalClick,
  AUDIO.sfx.dataFlow,
  AUDIO.sfx.transitionSweep,
] as const;

/** Scene audio markers / Arabic subtitles (fallback when manifest not loaded) */
export const SCENE_AUDIO_MARKERS = [
  {
    id: "hook",
    comment: "VO: Stop losing money on scattered tools",
    subtitle:
      "هل ما زلت تضيّع المال على أدوات متفرّقة؟",
  },
  {
    id: "competitors",
    comment: "VO: Contacts vs interactions pricing",
    subtitle: "تدفع حسب التفاعل — لا حسب حجم قائمتك",
  },
  {
    id: "reveal",
    comment: "VO: One platform reveal",
    subtitle: "منصة واحدة. أتمتة كاملة.",
  },
  {
    id: "automationFlow",
    comment: "VO: Instagram comment → DM automation",
    subtitle: "تعليق → رد تلقائي → زر رابط",
  },
  {
    id: "platform",
    comment: "VO: Analytics + publish multi-account",
    subtitle: "تحليلات ونشر على حسابات متعددة",
  },
  {
    id: "pricing",
    comment: "VO: $9 starting price",
    subtitle: "ابتداءً من 9$ / شهر",
  },
  {
    id: "cta",
    comment: "VO: 100 free tokens CTA",
    subtitle: "احصل على 100 توكن مجانية",
  },
] as const;
