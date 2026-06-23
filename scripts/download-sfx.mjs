import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "audio");

/** Royalty-free Mixkit SFX — https://mixkit.co/license/ */
const SOUNDS = {
  music: {
    url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    file: "music.mp3",
  },
  impact: {
    url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    file: "impact.mp3",
  },
  whoosh: {
    url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    file: "whoosh.mp3",
  },
  whoosh2: {
    url: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3",
    file: "whoosh-soft.mp3",
  },
  notification: {
    url: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3",
    file: "notification.mp3",
  },
  click: {
    url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    file: "click.mp3",
  },
  uiClick: {
    url: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    file: "ui-click.mp3",
  },
  success: {
    url: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
    file: "success.mp3",
  },
  digital: {
    url: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
    file: "digital.mp3",
  },
  rise: {
    url: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3",
    file: "rise.mp3",
  },
  cinematic: {
    url: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
    file: "cinematic.mp3",
  },
};

const download = async (url, dest) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
};

const main = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};

  for (const [key, { url, file }] of Object.entries(SOUNDS)) {
    const dest = path.join(OUT, file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`✓ ${file} exists`);
    } else {
      console.log(`↓ ${file}`);
      await download(url, dest);
      console.log(`  ✓ saved`);
    }
    manifest[key] = `audio/${file}`;
  }

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
