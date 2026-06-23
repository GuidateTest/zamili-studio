import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const ROOT = process.cwd();
const RENDERS_DIR = path.join(ROOT, "out", "studio-renders");
const JOBS_DIR = path.join(ROOT, "data", "render-jobs");

const ensureDirs = () => {
  fs.mkdirSync(RENDERS_DIR, { recursive: true });
  fs.mkdirSync(JOBS_DIR, { recursive: true });
};

const uid = () => `render-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const jobPath = (id) => path.join(JOBS_DIR, `${id}.json`);

const safeName = (value) =>
  String(value || "studio-render")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "studio-render";

const resolveCompositionId = () => "AIProjectReel";

const writeJob = (job) => {
  ensureDirs();
  fs.writeFileSync(jobPath(job.id), JSON.stringify(job, null, 2));
  return job;
};

export const getRenderJob = (id) => {
  try {
    const file = jobPath(id);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
};

export const updateRenderJob = (id, patch) => {
  const job = getRenderJob(id);
  if (!job) return null;
  return writeJob({
    ...job,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
};

export const listRenderJobs = () => {
  ensureDirs();
  return fs
    .readdirSync(JOBS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => getRenderJob(f.replace(/\.json$/, "")))
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const startRenderJob = ({ project = {}, projectId = null, compositionId = null }) => {
  ensureDirs();
  const id = uid();
  const resolvedCompositionId = compositionId || resolveCompositionId(project);
  const filename = `${safeName(project.prompt)}-${id}.mp4`;
  const outputPath = path.join(RENDERS_DIR, filename);
  const propsPath = path.join(JOBS_DIR, `${id}.props.json`);
  const createdAt = new Date().toISOString();

  fs.writeFileSync(propsPath, JSON.stringify({ project }, null, 2));

  const job = writeJob({
    id,
    projectId,
    compositionId: resolvedCompositionId,
    status: "rendering",
    progress: 0,
    phase: "Starting render",
    outputPath,
    downloadUrl: null,
    error: null,
    createdAt,
    updatedAt: createdAt,
  });

  const remotionCli = path.join(ROOT, "node_modules", "@remotion", "cli", "remotion-cli.js");
  const args = [
    remotionCli,
    "render",
    resolvedCompositionId,
    outputPath,
    `--props=${propsPath}`,
    "--concurrency=2",
    "--timeout=120000",
  ];

  const child = spawn(process.execPath, args, {
    cwd: ROOT,
    env: { ...process.env },
    windowsHide: true,
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const handleChunk = (chunk) => {
    const text = chunk.toString();
    const percentMatch = text.match(/(\d{1,3})%/);
    if (percentMatch) {
      updateRenderJob(id, {
        progress: Math.min(99, Math.max(0, Number(percentMatch[1]))),
        phase: text.split(/\r?\n/).find(Boolean)?.slice(0, 160) ?? "Rendering",
      });
    } else if (/bundl|render|encode|compos/i.test(text)) {
      updateRenderJob(id, {
        phase: text.split(/\r?\n/).find(Boolean)?.slice(0, 160) ?? "Rendering",
      });
    }
  };

  child.stdout?.on("data", handleChunk);
  child.stderr?.on("data", handleChunk);

  child.on("error", (err) => {
    updateRenderJob(id, {
      status: "error",
      progress: 100,
      phase: "Render failed to start",
      error: err instanceof Error ? err.message : String(err),
    });
  });

  child.on("close", (code) => {
    const ok = code === 0 && fs.existsSync(outputPath);
    updateRenderJob(id, {
      status: ok ? "done" : "error",
      progress: 100,
      phase: ok ? "Ready to download" : "Render failed",
      downloadUrl: ok ? `/api/studio/renders/${encodeURIComponent(id)}/download` : null,
      error: ok ? null : `Remotion exited with code ${code}`,
    });
  });

  return job;
};

export const getRenderFile = (id) => {
  const job = getRenderJob(id);
  if (!job || job.status !== "done" || !job.outputPath || !fs.existsSync(job.outputPath)) {
    return null;
  }
  return {
    job,
    filename: path.basename(job.outputPath),
    stream: fs.createReadStream(job.outputPath),
    stat: fs.statSync(job.outputPath),
  };
};
