import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "zamili-studio.db");

let db = null;

const schema = `
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'reel',
  prompt TEXT,
  settings TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  composition_id TEXT DEFAULT 'AIProjectReel',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  output_path TEXT,
  format TEXT DEFAULT 'mp4',
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_generations (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  prompt TEXT NOT NULL,
  source TEXT DEFAULT 'studio-ui',
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_exports_project ON exports(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_created ON ai_generations(created_at DESC);
`;

export const getDb = () => {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(schema);
  return db;
};

export const getDbPath = () => DB_PATH;

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const seedIfEmpty = () => {
  const d = getDb();
  const count = d.prepare("SELECT COUNT(*) AS c FROM projects").get().c;
  if (count > 0) return false;

  const now = new Date().toISOString();
  d.prepare(
    `INSERT INTO projects (id, title, type, prompt, settings, status, composition_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    uid("proj"),
    "AI Automation Reel",
    "reel",
    "Create a Reel explaining how AI automation helps business owners save time.",
    JSON.stringify({ language: "en", energy: "balanced", animations: "premium" }),
    "ready",
    "AIProjectReel",
    now,
    now,
  );

  d.prepare("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)").run(
    "seeded_at",
    now,
  );
  return true;
};

export const listProjects = (limit = 50) => {
  return getDb()
    .prepare(
      `SELECT id, title, type, prompt, settings, status, composition_id, created_at, updated_at
       FROM projects ORDER BY updated_at DESC LIMIT ?`,
    )
    .all(limit)
    .map(parseProject);
};

export const getProject = (id) => {
  const row = getDb()
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(id);
  return row ? parseProject(row) : null;
};

export const createProject = ({ title, type, prompt, settings, compositionId }) => {
  const now = new Date().toISOString();
  const id = uid("proj");
  getDb()
    .prepare(
      `INSERT INTO projects (id, title, type, prompt, settings, status, composition_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?)`,
    )
    .run(
      id,
      title,
      type ?? "reel",
      prompt ?? "",
      JSON.stringify(settings ?? {}),
      compositionId ?? "AIProjectReel",
      now,
      now,
    );
  return getProject(id);
};

export const updateProject = (id, patch) => {
  const existing = getProject(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const settings = patch.settings
    ? { ...existing.settings, ...patch.settings }
    : existing.settings;

  getDb()
    .prepare(
      `UPDATE projects SET
        title = ?, prompt = ?, settings = ?, status = ?, composition_id = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      patch.title ?? existing.title,
      patch.prompt ?? existing.prompt,
      JSON.stringify(settings),
      patch.status ?? existing.status,
      patch.compositionId ?? existing.compositionId,
      now,
      id,
    );
  return getProject(id);
};

export const deleteProject = (id) => {
  const r = getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  return r.changes > 0;
};

export const recordAiGeneration = ({ projectId, prompt, source }) => {
  const id = uid("ai");
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO ai_generations (id, project_id, prompt, source, created_at) VALUES (?, ?, ?, ?, ?)`,
    )
    .run(id, projectId ?? null, prompt, source ?? "studio-ui", now);
  return { id, createdAt: now };
};

export const recordExport = ({ projectId, outputPath, format }) => {
  const id = uid("exp");
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO exports (id, project_id, output_path, format, created_at) VALUES (?, ?, ?, ?, ?)`,
    )
    .run(id, projectId, outputPath, format ?? "mp4", now);
  return { id, createdAt: now };
};

export const getStats = () => {
  const d = getDb();
  const projects = d.prepare("SELECT COUNT(*) AS c FROM projects").get().c;
  const exportsTotal = d.prepare("SELECT COUNT(*) AS c FROM exports").get().c;
  const aiTotal = d.prepare("SELECT COUNT(*) AS c FROM ai_generations").get().c;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const exportsThisMonth = d
    .prepare("SELECT COUNT(*) AS c FROM exports WHERE created_at >= ?")
    .get(monthStart.toISOString()).c;

  return {
    projects,
    exportsTotal,
    exportsThisMonth,
    aiGenerations: aiTotal,
  };
};

export const checkApiKeys = () => {
  const read = (key) => {
    const v = process.env[key];
    if (!v || v.includes("your_") || v.includes("_here")) return false;
    return v.trim().length > 8;
  };
  return {
    elevenlabs: read("ELEVENLABS_API_KEY"),
    pexels: read("PEXELS_API_KEY"),
    cursor: read("CURSOR_API_KEY"),
    pixabay: read("PIXABAY_API_KEY"),
    freesound: read("FREESOUND_API_KEY"),
  };
};

export const checkAssets = () => {
  const checks = [
    { id: "logo", path: "public/logo.png", label: "Zamili icon" },
    { id: "wordmark", path: "public/zamili-studios.png", label: "Zamili Studio wordmark" },
    { id: "voiceover", path: "public/assets/audio/voiceover.mp3", label: "Voiceover" },
    { id: "sfx", path: "public/assets/sfx/cinematic-impact.mp3", label: "Sound effects" },
    { id: "lottie", path: "public/assets/lottie/automation.json", label: "Lottie animations" },
    { id: "zamili_assets", path: "public/zamili/logo.png", label: "Zamili product assets" },
  ];
  return checks.map((c) => ({
    ...c,
    exists: fs.existsSync(path.join(ROOT, c.path)),
  }));
};

const parseProject = (row) => ({
  id: row.id,
  title: row.title,
  type: row.type,
  prompt: row.prompt ?? "",
  settings: safeJson(row.settings, {}),
  status: row.status,
  compositionId: row.composition_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const safeJson = (s, fallback) => {
  try {
    return JSON.parse(s ?? "{}");
  } catch {
    return fallback;
  }
};
