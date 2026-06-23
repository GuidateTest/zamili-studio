import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "competitors");

const LOGOS = [
  { key: "manychat", url: "https://logo.clearbit.com/manychat.com" },
  { key: "hootsuite", url: "https://logo.clearbit.com/hootsuite.com" },
  { key: "buffer", url: "https://logo.clearbit.com/buffer.com" },
  { key: "canva", url: "https://logo.clearbit.com/canva.com" },
  { key: "later", url: "https://logo.clearbit.com/later.com" },
  { key: "chatgpt", url: "https://logo.clearbit.com/openai.com" },
];

const download = async (url, dest) => {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
};

const main = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  for (const { key, url } of LOGOS) {
    const dest = path.join(OUT, `${key}.png`);
    try {
      console.log(`↓ ${key}`);
      await download(url, dest);
      manifest[key] = `competitors/${key}.png`;
      console.log(`  ✓`);
    } catch (e) {
      console.warn(`  ⚠ ${key}: ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
};

main();
