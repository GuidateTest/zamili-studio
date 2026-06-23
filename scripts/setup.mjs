#!/usr/bin/env node
/**
 * First-run setup for Zamili Studio — clone, install, add keys, enjoy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const log = (msg) => console.log(`\n✓ ${msg}`);

const copyEnv = () => {
  const envPath = path.join(ROOT, ".env");
  const examplePath = path.join(ROOT, ".env.example");
  if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    log("Created .env from .env.example — add your API keys");
    return false;
  }
  if (fs.existsSync(envPath)) {
    log(".env exists");
    return true;
  }
  console.log("\n⚠ No .env.example found");
  return false;
};

const initDb = async () => {
  const { getDb, seedIfEmpty, getStats } = await import("../server/db.mjs");
  getDb();
  const seeded = seedIfEmpty();
  const stats = getStats();
  log(`SQLite ready (${stats.projects} projects)${seeded ? " — demo project seeded" : ""}`);
};

const checkLogo = () => {
  const publicLogo = path.join(ROOT, "public", "logo.png");
  const rootLogo = path.join(ROOT, "logo.png");
  if (!fs.existsSync(publicLogo) && fs.existsSync(rootLogo)) {
    fs.copyFileSync(rootLogo, publicLogo);
    log("Copied logo.png → public/logo.png");
  } else if (fs.existsSync(publicLogo)) {
    log("Logo present at public/logo.png");
  }

  const publicWordmark = path.join(ROOT, "public", "zamili-studios.png");
  const rootWordmark = path.join(ROOT, "zamili-studios.png");
  if (!fs.existsSync(publicWordmark) && fs.existsSync(rootWordmark)) {
    fs.copyFileSync(rootWordmark, publicWordmark);
    log("Copied zamili-studios.png → public/zamili-studios.png");
  } else if (fs.existsSync(publicWordmark)) {
    log("Wordmark present at public/zamili-studios.png");
  }
};

const runOptional = (label, cmd, args) => {
  console.log(`\n→ ${label}…`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: true });
  if (r.status === 0) log(label);
  else console.log(`  (skipped — ${label} failed or optional)`);
};

const main = async () => {
  console.log("\n🎬 Zamili Studio — setup\n");

  copyEnv();
  checkLogo();
  await initDb();

  const hasEnv = fs.existsSync(path.join(ROOT, ".env"));
  if (hasEnv) {
    console.log("\nOptional asset downloads (requires API keys in .env):");
    runOptional("Lottie animations", "npm", ["run", "download:lottie"]);
  }

  console.log("\n────────────────────────────────────────");
  console.log("Next steps:");
  console.log("  1. Edit .env with your API keys");
  console.log("  2. npm run dev          → Zamili Studio UI");
  console.log("  3. npm run audio        → voiceover + SFX (ElevenLabs)");
  console.log("  4. npm run render:reel  → export MP4");
  console.log("────────────────────────────────────────\n");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
