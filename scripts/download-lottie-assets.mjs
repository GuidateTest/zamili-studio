import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "assets", "lottie");

/** Free LottieFiles CDN animations — SaaS / UI premium feel */
const LOTTIES = [
  {
    id: "automation",
    file: "automation.json",
    url: "https://assets2.lottiefiles.com/packages/lf20_qp1spzqv.json",
    credit: "LottieFiles — AI/automation",
  },
  {
    id: "success",
    file: "success.json",
    url: "https://assets10.lottiefiles.com/packages/lf20_lk80fpsm.json",
    credit: "LottieFiles — success check",
  },
  {
    id: "sparkle",
    file: "sparkle.json",
    url: "https://assets3.lottiefiles.com/packages/lf20_u4yrau.json",
    credit: "LottieFiles — sparkle",
  },
  {
    id: "data-flow",
    file: "data-flow.json",
    url: "https://assets9.lottiefiles.com/packages/lf20_myejiggj.json",
    credit: "LottieFiles — data/network",
  },
  {
    id: "notification",
    file: "notification.json",
    url: "https://assets3.lottiefiles.com/packages/lf20_bhhvv.json",
    credit: "LottieFiles — notification bell",
  },
];

const download = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

const main = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};

  for (const item of LOTTIES) {
    const dest = path.join(OUT, item.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 200) {
      console.log(`✓ ${item.file} exists`);
      manifest[item.id] = { file: item.file, credit: item.credit };
      continue;
    }

    process.stdout.write(`↓ ${item.file}… `);
    try {
      const data = await download(item.url);
      fs.writeFileSync(dest, JSON.stringify(data));
      manifest[item.id] = { file: item.file, credit: item.credit };
      console.log("✓");
    } catch (err) {
      console.log(`✗ ${err.message}`);
      if (item.id === "notification" && fs.existsSync(path.join(OUT, "success.json"))) {
        fs.copyFileSync(path.join(OUT, "success.json"), dest);
        manifest[item.id] = { file: item.file, credit: "fallback from success.json" };
        console.log(`  ↳ copied success.json as fallback`);
      }
    }
  }

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${Object.keys(manifest).length} Lotties in ${OUT}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
