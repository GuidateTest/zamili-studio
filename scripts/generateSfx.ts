import fs from "fs";
import path from "path";
import {
  createElevenLabsClient,
  ensureDir,
  fileExists,
  parseArgs,
  PATHS,
  SFX_CATALOG,
  streamToBuffer,
} from "../src/lib/elevenlabs";

const main = async () => {
  const { force } = parseArgs();
  ensureDir(PATHS.sfxDir);

  const client = createElevenLabsClient();
  const manifest: Record<string, { file: string; text: string }> = {};

  for (const sfx of SFX_CATALOG) {
    const dest = path.join(PATHS.sfxDir, sfx.file);
    if (fileExists(dest) && !force) {
      console.log(`✓ ${sfx.file} exists`);
      manifest[sfx.file.replace(".mp3", "")] = { file: sfx.file, text: sfx.text };
      continue;
    }

    console.log(`↓ Generating ${sfx.file}…`);
    const stream = await client.textToSoundEffects.convert({
      text: sfx.text,
      durationSeconds: sfx.durationSeconds,
      promptInfluence: 0.45,
      outputFormat: "mp3_44100_128",
    });

    const buffer = await streamToBuffer(stream);
    fs.writeFileSync(dest, buffer);
    manifest[sfx.file.replace(".mp3", "")] = { file: sfx.file, text: sfx.text };
    console.log(`  ✓ ${sfx.file}`);
  }

  fs.writeFileSync(PATHS.sfxManifest, JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${Object.keys(manifest).length} SFX in ${PATHS.sfxDir}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
