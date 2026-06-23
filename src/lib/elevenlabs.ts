/**
 * ElevenLabs helpers — Node/scripts only. Never import from React components.
 */
import fs from "fs";
import path from "path";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const ROOT = path.join(__dirname, "..", "..");

export const PATHS = {
  env: path.join(ROOT, ".env"),
  voiceover: path.join(ROOT, "public", "assets", "audio", "voiceover.mp3"),
  voiceoverManifest: path.join(ROOT, "public", "assets", "audio", "voiceover-manifest.json"),
  voiceoverSegments: path.join(ROOT, "public", "assets", "audio", "segments"),
  sfxDir: path.join(ROOT, "public", "assets", "sfx"),
  sfxManifest: path.join(ROOT, "public", "assets", "sfx", "manifest.json"),
  music: path.join(ROOT, "public", "audio", "music.wav"),
} as const;

/** Multilingual voice — strong Arabic delivery on eleven_multilingual_v2 */
export const DEFAULT_VOICE_ID = "onwK4e9ZLuTAKqWW03F9";
export const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

export type VoiceStyle = "confident" | "educational" | "energetic" | "premium";

export const VOICE_SETTINGS: Record<
  VoiceStyle,
  { stability: number; similarityBoost: number; style: number; speed: number }
> = {
  confident: { stability: 0.42, similarityBoost: 0.82, style: 0.28, speed: 1.02 },
  educational: { stability: 0.55, similarityBoost: 0.78, style: 0.18, speed: 0.96 },
  energetic: { stability: 0.35, similarityBoost: 0.8, style: 0.45, speed: 1.08 },
  premium: { stability: 0.48, similarityBoost: 0.85, style: 0.32, speed: 1.0 },
};

export const VOICEOVER_SEGMENTS: {
  id: string;
  text: string;
  style: VoiceStyle;
}[] = [
  {
    id: "hook",
    text: "هل ما زلت تضيّع المال على أدوات متفرّقة؟ ManyChat، Hootsuite، Buffer، وأدوات الذكاء الاصطناعي… الفاتورة تكبر كل شهر.",
    style: "premium",
  },
  {
    id: "competitors",
    text: "المنافسون يفرضون الدفع حسب عدد جهات الاتصال. كلما كبرت قائمتك، زادت التكلفة — حتى لو رددت على ألفين فقط. مع Zamili، تدفع حسب التفاعل: تعليق، رسالة مباشرة، أو واتساب.",
    style: "educational",
  },
  {
    id: "reveal",
    text: "منصة واحدة. أتمتة كاملة. Zamili.",
    style: "confident",
  },
  {
    id: "automationFlow",
    text: "تعليق على إنستغرام… رد تلقائي في الخاص… زر رابط — كل شيء يعمل وحده.",
    style: "energetic",
  },
  {
    id: "platform",
    text: "تابع التحليلات، أنشئ المنشور، وانشره على حسابات متعددة — من نفس المكان.",
    style: "educational",
  },
  {
    id: "pricing",
    text: "ابتداءً من تسعة دولارات فقط في الشهر.",
    style: "premium",
  },
  {
    id: "cta",
    text: "تعال إلى Zamili… واحصل على مئة توكن مجانية الآن.",
    style: "confident",
  },
];

export const SFX_CATALOG: {
  file: string;
  text: string;
  durationSeconds: number;
}[] = [
  {
    file: "cinematic-impact.mp3",
    text: "Deep cinematic trailer impact hit, premium SaaS advertisement, short and punchy",
    durationSeconds: 1.2,
  },
  {
    file: "notification-pop.mp3",
    text: "Clean modern smartphone notification pop, subtle and professional",
    durationSeconds: 0.6,
  },
  {
    file: "fast-whoosh.mp3",
    text: "Fast clean UI whoosh transition sweep, minimal tech product video",
    durationSeconds: 0.7,
  },
  {
    file: "digital-click.mp3",
    text: "Soft digital UI click, modern app interface, crisp and minimal",
    durationSeconds: 0.5,
  },
  {
    file: "glitch-drop.mp3",
    text: "Short subtle digital glitch drop transition, futuristic SaaS",
    durationSeconds: 0.8,
  },
  {
    file: "success-chime.mp3",
    text: "Bright positive success chime, confirmation tone, premium app",
    durationSeconds: 1.0,
  },
  {
    file: "data-flow.mp3",
    text: "Smooth data flow digital texture, automation pipeline, airy and modern",
    durationSeconds: 1.5,
  },
  {
    file: "transition-sweep.mp3",
    text: "Elegant transition sweep whoosh, Apple-style product video, airy",
    durationSeconds: 0.9,
  },
];

export const loadEnv = (key: string): string => {
  if (!fs.existsSync(PATHS.env)) {
    throw new Error(".env not found. Copy .env.example and add ELEVENLABS_API_KEY.");
  }
  const lines = fs.readFileSync(PATHS.env, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq).trim() === key) {
      return trimmed.slice(eq + 1).trim();
    }
  }
  throw new Error(`${key} not found in .env`);
};

export const createElevenLabsClient = (): ElevenLabsClient => {
  const apiKey = loadEnv("ELEVENLABS_API_KEY");
  return new ElevenLabsClient({ apiKey });
};

export const streamToBuffer = async (
  stream: ReadableStream<Uint8Array>,
): Promise<Buffer> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
};

export const ensureDir = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true });
};

export const fileExists = (p: string, minBytes = 500) =>
  fs.existsSync(p) && fs.statSync(p).size >= minBytes;

export const parseArgs = () => {
  const args = process.argv.slice(2);
  return {
    force: args.includes("--force"),
    voiceId: args.find((a) => a.startsWith("--voice="))?.split("=")[1],
    modelId: args.find((a) => a.startsWith("--model="))?.split("=")[1],
  };
};
