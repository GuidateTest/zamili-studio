import type { ProjectSettings } from "../hooks/useStudioStore";

export type AgentActivity = {
  at: string;
  type: "info" | "assistant" | "tool" | "warning" | "error";
  text: string;
};

export type AgentRun = {
  id: string;
  promptId: string;
  prompt: string;
  project: Record<string, unknown>;
  status: "queued" | "running" | "finished" | "error";
  progress: number;
  phase: string;
  startedAt: string;
  updatedAt: string;
  elapsedMs: number;
  etaMs: number | null;
  activities: AgentActivity[];
  result: string | null;
  cursorStatus: string | null;
  agentId: string | null;
};

export type CursorBridgeResult = {
  ok: boolean;
  queued: boolean;
  cursorAuto: boolean;
  runId?: string;
  promptId?: string;
  warning?: string;
  inbox?: { id: string; status: string; error?: string; runId?: string };
  log?: string;
  error?: string;
};

/** Send a Studio AI prompt — returns immediately with runId for live polling */
export const sendPromptToCursor = async (
  prompt: string,
  project: ProjectSettings,
  projectId?: string | null,
): Promise<CursorBridgeResult> => {
  try {
    const res = await fetch("/api/studio/cursor-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, project, projectId }),
    });

    const data = (await res.json()) as CursorBridgeResult & { error?: string };
    if (!res.ok) {
      return { ok: false, queued: false, cursorAuto: false, error: data.error ?? res.statusText };
    }
    return data;
  } catch (err) {
    return {
      ok: false,
      queued: false,
      cursorAuto: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
};

export const fetchAgentRun = async (runId: string): Promise<AgentRun | null> => {
  const res = await fetch(`/api/studio/agent-run/${encodeURIComponent(runId)}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { run: AgentRun };
  return data.run;
};

export const fetchLatestAgentRun = async (): Promise<AgentRun | null> => {
  const res = await fetch("/api/studio/agent-run/latest");
  if (!res.ok) return null;
  const data = (await res.json()) as { run: AgentRun | null };
  return data.run;
};
