import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const safeJson = (file, fallback = {}) => {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const exists = (publicPath) => fs.existsSync(path.join(PUBLIC_DIR, publicPath));

const titleize = (value) =>
  String(value)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const extType = (file) => {
  const ext = path.extname(file).toLowerCase();
  if ([".mp4", ".mov", ".webm"].includes(ext)) return "video";
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) return "image";
  if ([".mp3", ".wav", ".ogg", ".m4a"].includes(ext)) return "audio";
  if (ext === ".json") return "animation";
  return "file";
};

const asset = ({ id, title, provider, type, category, publicPath, description, meta = {} }) => ({
  id,
  title,
  provider,
  type,
  category,
  publicPath,
  url: publicPath ? `/${publicPath.replace(/\\/g, "/")}` : null,
  exists: publicPath ? exists(publicPath) : false,
  description: description ?? "",
  meta,
});

export const listLocalAssets = () => {
  const items = [];

  const videos = safeJson(path.join(PUBLIC_DIR, "assets", "videos", "manifest.json"));
  for (const [id, entry] of Object.entries(videos)) {
    items.push(
      asset({
        id: `video-${id}`,
        title: titleize(entry.query ?? id),
        provider: "Pexels",
        type: "video",
        category: "stock",
        publicPath: entry.staticPath,
        description: entry.photographer ? `By ${entry.photographer}` : "Stock video",
        meta: entry,
      }),
    );
  }

  const sfx = safeJson(path.join(PUBLIC_DIR, "assets", "sfx", "manifest.json"));
  for (const [id, entry] of Object.entries(sfx)) {
    items.push(
      asset({
        id: `sfx-${id}`,
        title: titleize(id),
        provider: "ElevenLabs",
        type: "audio",
        category: "sound-effects",
        publicPath: `assets/sfx/${entry.file}`,
        description: entry.text,
        meta: entry,
      }),
    );
  }

  const voiceover = safeJson(path.join(PUBLIC_DIR, "assets", "audio", "voiceover-manifest.json"), null);
  if (voiceover) {
    items.push(
      asset({
        id: "voiceover-main",
        title: "Generated Voiceover",
        provider: "ElevenLabs",
        type: "voiceover",
        category: "voiceovers",
        publicPath: "assets/audio/voiceover.mp3",
        description: `${voiceover.scenes?.length ?? 0} scenes · ${Math.round(voiceover.durationSeconds ?? 0)}s`,
        meta: voiceover,
      }),
    );

    for (const scene of voiceover.scenes ?? []) {
      items.push(
        asset({
          id: `voiceover-scene-${scene.id}`,
          title: `${titleize(scene.id)} Voiceover`,
          provider: "ElevenLabs",
          type: "voiceover",
          category: "voiceovers",
          publicPath: `assets/audio/segments/${scene.id}.mp3`,
          description: scene.text,
          meta: scene,
        }),
      );
    }
  }

  const lotties = safeJson(path.join(PUBLIC_DIR, "assets", "lottie", "manifest.json"));
  for (const [id, entry] of Object.entries(lotties)) {
    const file = typeof entry === "string" ? entry : entry.file ?? `${id}.json`;
    items.push(
      asset({
        id: `lottie-${id}`,
        title: titleize(id),
        provider: "Local",
        type: "animation",
        category: "animations",
        publicPath: `assets/lottie/${file}`,
        description: "Lottie animation",
        meta: typeof entry === "object" ? entry : {},
      }),
    );
  }

  const zamili = safeJson(path.join(PUBLIC_DIR, "zamili", "manifest.json"));
  for (const [id, publicPath] of Object.entries(zamili)) {
    const type = extType(publicPath);
    items.push(
      asset({
        id: `brand-${id}`,
        title: titleize(id),
        provider: "Zamili",
        type,
        category:
          id.includes("logo") || id.includes("lang") || id.includes("services")
            ? "brand-assets"
            : "product-assets",
        publicPath,
        description: "Zamili product asset",
      }),
    );
  }

  for (const file of ["logo.png", "zamili-studios.png", "favicon.svg"]) {
    if (exists(file)) {
      items.push(
        asset({
          id: `root-${file}`,
          title: titleize(file),
          provider: "Zamili",
          type: extType(file),
          category: "brand-assets",
          publicPath: file,
          description: "Core brand asset",
        }),
      );
    }
  }

  return items;
};

const localSearch = ({ provider, type, category, query }) => {
  const q = query?.trim().toLowerCase();
  return listLocalAssets().filter((item) => {
    if (provider && provider !== "all" && item.provider.toLowerCase() !== provider.toLowerCase()) return false;
    if (type && type !== "all" && item.type !== type) return false;
    if (category && category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return `${item.title} ${item.description} ${item.provider} ${item.type} ${item.category}`.toLowerCase().includes(q);
  });
};

export const searchAssets = async ({ provider = "all", type = "all", category = "all", query = "" } = {}) => {
  const local = localSearch({ provider, type, category, query });
  const remote = [];
  const normalizedProvider = provider.toLowerCase();
  const q = query?.trim();

  if (q && (normalizedProvider === "pexels" || normalizedProvider === "all") && process.env.PEXELS_API_KEY) {
    remote.push(...(await searchPexelsVideos(q)));
  }

  if (
    (normalizedProvider === "elevenlabs" || normalizedProvider === "all") &&
    process.env.ELEVENLABS_API_KEY &&
    (!type || type === "all" || type === "voiceover")
  ) {
    remote.push(...(await listElevenLabsVoices(q)));
  }

  return {
    items: [...local, ...remote],
    providers: getProviders(),
    source: remote.length ? "local+api" : "local",
  };
};

const searchPexelsVideos = async (query) => {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=8`,
      {
        headers: { Authorization: process.env.PEXELS_API_KEY },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.videos ?? []).map((video) => {
      const file =
        video.video_files?.find((f) => f.quality === "hd" && f.width <= 1080)?.link ??
        video.video_files?.[0]?.link ??
        null;
      return {
        id: `pexels-api-${video.id}`,
        title: video.user?.name ? `${titleize(query)} · ${video.user.name}` : titleize(query),
        provider: "Pexels",
        type: "video",
        category: "stock",
        publicPath: null,
        url: file,
        exists: Boolean(file),
        description: video.url ?? "Pexels video result",
        meta: { pexelsId: video.id, duration: video.duration, thumbnail: video.image },
      };
    });
  } catch {
    return [];
  }
};

const listElevenLabsVoices = async (query = "") => {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const q = query.trim().toLowerCase();
    return (data.voices ?? [])
      .filter((voice) => !q || `${voice.name} ${voice.labels ? JSON.stringify(voice.labels) : ""}`.toLowerCase().includes(q))
      .slice(0, 12)
      .map((voice) => ({
        id: `elevenlabs-voice-${voice.voice_id}`,
        title: voice.name,
        provider: "ElevenLabs",
        type: "voiceover",
        category: "voiceovers",
        publicPath: null,
        url: voice.preview_url ?? null,
        exists: Boolean(voice.preview_url),
        description: voice.description ?? "ElevenLabs voice",
        meta: { voiceId: voice.voice_id, labels: voice.labels ?? {}, category: voice.category },
      }));
  } catch {
    return [];
  }
};

export const getProviders = () => [
  { id: "all", label: "All", connected: true },
  { id: "pexels", label: "Pexels", connected: Boolean(process.env.PEXELS_API_KEY) },
  { id: "pixabay", label: "Pixabay", connected: Boolean(process.env.PIXABAY_API_KEY) },
  { id: "elevenlabs", label: "ElevenLabs", connected: Boolean(process.env.ELEVENLABS_API_KEY) },
  { id: "freesound", label: "Freesound", connected: Boolean(process.env.FREESOUND_API_KEY) },
  { id: "zamili", label: "Zamili", connected: true },
  { id: "local", label: "Local", connected: true },
];

export const listBrandAssets = () =>
  localSearch({ category: "brand-assets" }).map((item) => ({
    ...item,
    brandRole: item.id.includes("logo") || item.publicPath?.includes("logo") ? "logo" : "asset",
  }));

export const listVoiceovers = () =>
  localSearch({ category: "voiceovers" }).sort((a, b) => {
    const aStart = a.meta?.startSeconds ?? -1;
    const bStart = b.meta?.startSeconds ?? -1;
    return aStart - bStart;
  });
