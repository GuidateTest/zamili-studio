export type StudioProject = {
  id: string;
  title: string;
  type: string;
  prompt: string;
  settings: Record<string, unknown>;
  status: string;
  compositionId: string;
  createdAt: string;
  updatedAt: string;
};

export type StudioStats = {
  projects: number;
  exportsTotal: number;
  exportsThisMonth: number;
  aiGenerations: number;
};

export type ApiKeyStatus = {
  elevenlabs: boolean;
  pexels: boolean;
  cursor: boolean;
  /** null = not set; true/false = live verification against api.cursor.com */
  cursorValid?: boolean | null;
  pixabay: boolean;
  freesound: boolean;
};

export type AssetCheck = {
  id: string;
  path: string;
  label: string;
  exists: boolean;
};

export type StudioAsset = {
  id: string;
  title: string;
  provider: string;
  type: "video" | "image" | "audio" | "voiceover" | "animation" | "file";
  category: string;
  publicPath: string | null;
  url: string | null;
  exists: boolean;
  description: string;
  meta: Record<string, unknown>;
  brandRole?: string;
};

export type AssetProvider = {
  id: string;
  label: string;
  connected: boolean;
};

export type AgentActivity = {
  at: string;
  type: string;
  text: string;
};

export type AgentRun = {
  id: string;
  promptId: string;
  prompt: string;
  status: string;
  progress: number;
  phase: string;
  startedAt: string;
  updatedAt: string;
  elapsedMs: number;
  etaMs: number | null;
  activities: AgentActivity[];
  result: string | null;
};

export type ProcessedInboxItem = {
  id: string;
  prompt: string;
  status: string;
  result?: string;
  processedAt?: string;
  createdAt: string;
  runId?: string;
};

export type RenderJob = {
  id: string;
  projectId: string | null;
  compositionId: string;
  status: "rendering" | "done" | "error";
  progress: number;
  phase: string;
  outputPath: string;
  downloadUrl: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HealthResponse = {
  ok: boolean;
  db: string;
  stats: StudioStats;
  apiKeys: ApiKeyStatus;
  assets: AssetCheck[];
  ready: boolean;
};

const get = async <T>(path: string): Promise<T> => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
};

const post = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
};

const patch = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
};

export const studioApi = {
  health: () => get<HealthResponse>("/api/studio/health"),
  stats: () => get<StudioStats>("/api/studio/stats"),
  listProjects: () => get<{ projects: StudioProject[] }>("/api/studio/projects"),
  createProject: (data: {
    title: string;
    type?: string;
    prompt?: string;
    settings?: Record<string, unknown>;
    compositionId?: string;
  }) => post<{ project: StudioProject }>("/api/studio/projects", data),
  updateProject: (
    id: string,
    data: {
      title?: string;
      prompt?: string;
      settings?: Record<string, unknown>;
      status?: string;
      compositionId?: string;
    },
  ) => patch<{ project: StudioProject }>(`/api/studio/projects/${id}`, data),
  recordAi: (prompt: string, projectId?: string) =>
    post("/api/studio/ai-generations", { prompt, projectId }),
  searchAssets: (params: {
    q?: string;
    provider?: string;
    type?: string;
    category?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.provider) qs.set("provider", params.provider);
    if (params.type) qs.set("type", params.type);
    if (params.category) qs.set("category", params.category);
    return get<{ items: StudioAsset[]; providers: AssetProvider[]; source: string }>(
      `/api/studio/assets?${qs.toString()}`,
    );
  },
  listBrandAssets: () =>
    get<{ items: StudioAsset[] }>("/api/studio/assets/brand").then((r) => r.items),
  listVoiceovers: () =>
    get<{ items: StudioAsset[] }>("/api/studio/assets/voiceovers").then((r) => r.items),
  startRender: (data: {
    project: Record<string, unknown>;
    projectId?: string | null;
    compositionId?: string | null;
  }) => post<{ job: RenderJob }>("/api/studio/renders", data),
  getRender: (id: string) =>
    get<{ job: RenderJob }>(`/api/studio/renders/${encodeURIComponent(id)}`).then((r) => r.job),
  listRenders: () =>
    get<{ jobs: RenderJob[] }>("/api/studio/renders").then((r) => r.jobs),
  getAgentRun: (runId: string) =>
    get<{ run: AgentRun }>(`/api/studio/agent-run/${encodeURIComponent(runId)}`).then((r) => r.run),
  listProcessedInbox: () =>
    get<{ items: ProcessedInboxItem[] }>("/api/studio/inbox/processed").then((r) => r.items),
};

export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};
