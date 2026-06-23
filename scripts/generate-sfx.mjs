import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "audio");

const SAMPLE_RATE = 44100;

const writeWav = (filename, samples) => {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }

  fs.writeFileSync(path.join(OUT, filename), buffer);
};

const env = (t, attack, release, duration) => {
  if (t < 0 || t > duration) return 0;
  const a = Math.min(1, t / attack);
  const r = Math.min(1, (duration - t) / release);
  return a * r;
};

const noise = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const generate = (durationSec, fn) => {
  const len = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    samples[i] = fn(i / SAMPLE_RATE, i);
  }
  return samples;
};

const mix = (...tracks) => {
  const len = Math.max(...tracks.map((t) => t.length));
  const out = new Float32Array(len);
  for (const t of tracks) {
    for (let i = 0; i < t.length; i++) out[i] += t[i];
  }
  let peak = 0;
  for (const s of out) peak = Math.max(peak, Math.abs(s));
  const gain = peak > 0 ? 0.92 / peak : 1;
  return out.map((s) => s * gain);
};

const sfx = {
  impact: () =>
    generate(0.55, (t) => {
      const e = env(t, 0.002, 0.35, 0.55);
      return Math.sin(2 * Math.PI * 55 * t) * e * 0.9 + noise(t * 1000) * e * 0.15;
    }),

  whoosh: () =>
    generate(0.45, (t) => {
      const e = env(t, 0.01, 0.25, 0.45);
      const freq = 200 + t * 1800;
      return (noise(t * 500) * 0.6 + Math.sin(2 * Math.PI * freq * t) * 0.08) * e;
    }),

  whooshSoft: () =>
    generate(0.35, (t) => {
      const e = env(t, 0.02, 0.2, 0.35);
      return noise(t * 400) * e * 0.5;
    }),

  notification: () =>
    generate(0.5, (t) => {
      const e1 = env(t, 0.005, 0.15, 0.18);
      const e2 = env(t - 0.12, 0.005, 0.2, 0.25);
      return (
        Math.sin(2 * Math.PI * 880 * t) * e1 * 0.5 +
        Math.sin(2 * Math.PI * 1175 * t) * e2 * 0.45
      );
    }),

  click: () =>
    generate(0.08, (t) => {
      const e = env(t, 0.001, 0.04, 0.08);
      return Math.sin(2 * Math.PI * 1200 * t) * e * 0.7;
    }),

  uiClick: () =>
    generate(0.06, (t) => {
      const e = env(t, 0.001, 0.03, 0.06);
      return (Math.sin(2 * Math.PI * 1800 * t) + Math.sin(2 * Math.PI * 2400 * t) * 0.4) * e * 0.5;
    }),

  success: () =>
    generate(0.65, (t) => {
      const notes = [523.25, 659.25, 783.99];
      let s = 0;
      notes.forEach((f, i) => {
        const start = i * 0.08;
        const e = env(t - start, 0.005, 0.25, 0.4);
        s += Math.sin(2 * Math.PI * f * (t - start)) * e * 0.35;
      });
      return s;
    }),

  digital: () =>
    generate(0.4, (t) => {
      const e = env(t, 0.01, 0.15, 0.4);
      const mod = Math.sin(2 * Math.PI * 12 * t) > 0 ? 1 : -1;
      return Math.sin(2 * Math.PI * (440 + t * 800) * t) * mod * e * 0.35;
    }),

  rise: () =>
    generate(0.5, (t) => {
      const e = env(t, 0.05, 0.2, 0.5);
      const freq = 150 + t * 600;
      return Math.sin(2 * Math.PI * freq * t) * e * 0.4;
    }),

  cinematic: () =>
    generate(0.7, (t) => {
      const e = env(t, 0.01, 0.45, 0.7);
      return (
        Math.sin(2 * Math.PI * 80 * t) * e * 0.5 +
        Math.sin(2 * Math.PI * 160 * t) * e * 0.25 +
        noise(t * 200) * e * 0.08
      );
    }),

  music: () => {
    const dur = 58;
    const len = Math.floor(SAMPLE_RATE * dur);
    const samples = new Float32Array(len);
    const bpm = 118;
    const beat = 60 / bpm;

    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const beatPhase = (t % beat) / beat;
      const kick = beatPhase < 0.08 ? Math.sin(2 * Math.PI * 60 * t) * (1 - beatPhase / 0.08) * 0.35 : 0;
      const pad =
        (Math.sin(2 * Math.PI * 220 * t) +
          Math.sin(2 * Math.PI * 277.18 * t) +
          Math.sin(2 * Math.PI * 329.63 * t)) *
        0.04;
      const arpFreq = [440, 554.37, 659.25, 880][Math.floor(t * 4) % 4];
      const arp = Math.sin(2 * Math.PI * arpFreq * t) * 0.025 * env(t % 0.5, 0.01, 0.3, 0.5);
      const swell = 0.55 + 0.45 * Math.sin(2 * Math.PI * t / dur);
      samples[i] = (kick + pad + arp) * swell * 0.7;
    }
    return samples;
  },
};

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};

for (const [name, fn] of Object.entries(sfx)) {
  const file = `${name}.wav`;
  console.log(`Generating ${file}...`);
  writeWav(file, fn());
  manifest[name] = `audio/${file}`;
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Done.");
