import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "assets", "videos");
const ENV_PATH = path.join(ROOT, ".env");

const SEARCHES = [
  { key: "real-estate-agent-phone", query: "real estate agent phone" },
  { key: "smartphone-notifications", query: "smartphone notifications" },
  { key: "customer-texting", query: "customer texting" },
  { key: "businessman-working", query: "businessman working" },
  { key: "office-workspace", query: "office workspace" },
  { key: "dubai-skyline", query: "Dubai skyline" },
  { key: "luxury-apartment-dubai", query: "luxury apartment Dubai" },
  { key: "property-investment", query: "property investment" },
  { key: "sales-call", query: "sales call" },
  { key: "dubai-real-estate", query: "Dubai real estate" },
];

const loadEnv = () => {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error(".env file not found. Add PEXELS_API_KEY=your_key");
  }
  const lines = fs.readFileSync(ENV_PATH, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key === "PEXELS_API_KEY") return rest.join("=").trim();
  }
  throw new Error("PEXELS_API_KEY not found in .env");
};

const pickBestFile = (videoFiles) => {
  const mp4s = videoFiles.filter((f) => f.file_type === "video/mp4");
  const sorted = mp4s.sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
  const portrait = sorted.find((f) => (f.height ?? 0) > (f.width ?? 0));
  return portrait ?? sorted[0];
};

const downloadFile = async (url, dest) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
};

const searchVideo = async (apiKey, query) => {
  const params = new URLSearchParams({
    query,
    per_page: "5",
    orientation: "portrait",
  });
  const res = await fetch(
    `https://api.pexels.com/videos/search?${params.toString()}`,
    { headers: { Authorization: apiKey } },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pexels search failed (${query}): ${res.status} ${body}`);
  }
  const data = await res.json();
  if (!data.videos?.length) {
    const fallback = await fetch(
      `https://api.pexels.com/videos/search?${new URLSearchParams({ query, per_page: "5" }).toString()}`,
      { headers: { Authorization: apiKey } },
    );
    const fallbackData = await fallback.json();
    if (!fallbackData.videos?.length) return null;
    return fallbackData.videos[0];
  }
  return data.videos[0];
};

const main = async () => {
  const apiKey = loadEnv();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = {};

  for (const { key, query } of SEARCHES) {
    const dest = path.join(OUT_DIR, `${key}.mp4`);
    console.log(`Searching: "${query}" → ${key}.mp4`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 100_000) {
      console.log(`  ✓ Already exists, skipping download`);
      manifest[key] = {
        file: `${key}.mp4`,
        query,
        staticPath: `assets/videos/${key}.mp4`,
      };
      continue;
    }

    const video = await searchVideo(apiKey, query);
    if (!video) {
      console.warn(`  ⚠ No results for "${query}"`);
      continue;
    }

    const file = pickBestFile(video.video_files);
    if (!file?.link) {
      console.warn(`  ⚠ No MP4 file for "${query}"`);
      continue;
    }

    console.log(`  ↓ Downloading ${file.width}x${file.height}...`);
    await downloadFile(file.link, dest);

    manifest[key] = {
      file: `${key}.mp4`,
      query,
      pexelsId: video.id,
      photographer: video.user?.name,
      staticPath: `assets/videos/${key}.mp4`,
    };
    console.log(`  ✓ Saved ${key}.mp4`);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`\nDone. ${Object.keys(manifest).length} videos in manifest.`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
