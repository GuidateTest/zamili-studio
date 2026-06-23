import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..");
export const INBOX = path.join(ROOT, ".cursor", "studio-inbox");
/** Outside .cursor so Vite file watcher does not restart on every progress tick */
export const RUNS_DIR = path.join(ROOT, "data", "studio-runs");
export const PROCESSED_DIR = path.join(INBOX, "processed");

export const ensureInboxDirs = () => {
  fs.mkdirSync(RUNS_DIR, { recursive: true });
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  fs.mkdirSync(INBOX, { recursive: true });
};

const runPath = (id) => path.join(RUNS_DIR, `${id}.json`);

const writeThrottle = new Map();

export const createRun = ({ id, prompt, project = {}, promptId = null }) => {
  ensureInboxDirs();
  const now = new Date().toISOString();
  const run = {
    id,
    promptId,
    prompt,
    project,
    status: "queued",
    progress: 0,
    phase: "Queued",
    startedAt: now,
    updatedAt: now,
    elapsedMs: 0,
    etaMs: null,
    activities: [{ at: now, type: "info", text: "Prompt received" }],
    result: null,
    cursorStatus: null,
    agentId: null,
  };
  fs.writeFileSync(runPath(id), JSON.stringify(run, null, 2));
  return run;
};

export const updateRun = (id, patch) => {
  const run = getRun(id);
  if (!run) return null;

  const now = Date.now();
  const last = writeThrottle.get(id) ?? 0;
  const force = patch.status === "finished" || patch.status === "error" || patch.progress === 100;
  if (!force && now - last < 600) {
    return run;
  }
  writeThrottle.set(id, now);

  const iso = new Date().toISOString();
  const started = new Date(run.startedAt).getTime();
  const next = {
    ...run,
    ...patch,
    updatedAt: iso,
    elapsedMs: Date.now() - started,
  };
  fs.writeFileSync(runPath(id), JSON.stringify(next, null, 2));
  return next;
};

export const appendActivity = (id, type, text) => {
  const run = getRun(id);
  if (!run) return null;
  const activities = [...(run.activities ?? []), { at: new Date().toISOString(), type, text }];
  return updateRun(id, { activities: activities.slice(-40) });
};

export const getRun = (id) => {
  try {
    if (!fs.existsSync(runPath(id))) return null;
    return JSON.parse(fs.readFileSync(runPath(id), "utf8"));
  } catch {
    return null;
  }
};

export const getLatestRun = () => {
  ensureInboxDirs();
  if (!fs.existsSync(RUNS_DIR)) return null;
  const files = fs
    .readdirSync(RUNS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const full = path.join(RUNS_DIR, f);
      return { full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
  if (!files.length) return null;
  try {
    return JSON.parse(fs.readFileSync(files[0].full, "utf8"));
  } catch {
    return null;
  }
};

export const listProcessed = () => {
  ensureInboxDirs();
  if (!fs.existsSync(PROCESSED_DIR)) return [];
  return fs
    .readdirSync(PROCESSED_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(PROCESSED_DIR, f), "utf8"));
        return { ...data, file: f };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.processedAt ?? b.createdAt) - new Date(a.processedAt ?? a.createdAt));
};

export const getProcessed = (id) => {
  const direct = path.join(PROCESSED_DIR, `${id}.json`);
  if (fs.existsSync(direct)) {
    return JSON.parse(fs.readFileSync(direct, "utf8"));
  }
  if (!fs.existsSync(PROCESSED_DIR)) return null;
  for (const f of fs.readdirSync(PROCESSED_DIR)) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(PROCESSED_DIR, f), "utf8"));
    if (data.id === id) return data;
  }
  return null;
};

export const writeInboxPending = (payload) => {
  ensureInboxDirs();
  const jsonPath = path.join(INBOX, "pending-prompt.json");
  const mdPath = path.join(INBOX, "latest.md");
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  fs.writeFileSync(
    mdPath,
    `# Zamili Studio → Cursor\n\n**Prompt:** ${payload.prompt}\n\n**Time:** ${payload.createdAt}\n\n## Project context\n\`\`\`json\n${JSON.stringify(payload.project ?? {}, null, 2)}\n\`\`\`\n`,
  );
  return jsonPath;
};

export const readInboxPending = () => {
  const jsonPath = path.join(INBOX, "pending-prompt.json");
  if (!fs.existsSync(jsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch {
    return null;
  }
};
