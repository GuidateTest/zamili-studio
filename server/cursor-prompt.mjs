import { spawn } from "child_process";
import path from "path";
import { createRun, getRun, ROOT, updateRun, writeInboxPending } from "./agent-run.mjs";
import { recordAiGeneration } from "./db.mjs";
import { validateCursorKey } from "./cursor-key.mjs";
import { scheduleAgentRun } from "./agent-scheduler.mjs";

const autoAgentEnabled = () =>
  process.env.CURSOR_AUTO_AGENT === "true" || process.env.CURSOR_AUTO_AGENT === "1";

const startHiddenSdkWorker = (runId) => {
  const script = path.join(ROOT, "scripts", "cursor-agent-run.mjs");
  const child = spawn(process.execPath, [script, runId], {
    cwd: ROOT,
    env: { ...process.env },
    stdio: "ignore",
    detached: false,
    windowsHide: true,
  });

  child.unref();

  child.on("error", (err) => {
    updateRun(runId, {
      status: "error",
      progress: 100,
      phase: "SDK worker failed to start",
      result: err instanceof Error ? err.message : String(err),
      etaMs: 0,
    });
  });

  child.on("exit", (code, signal) => {
    const run = getRun(runId);
    if (!run || run.status === "finished" || run.status === "error") return;
    updateRun(runId, {
      status: "error",
      progress: 100,
      phase: "SDK worker stopped",
      result: `Cursor SDK worker exited before finishing (code ${code ?? "none"}, signal ${signal ?? "none"}).`,
      etaMs: 0,
    });
  });
};

/** Queue prompt + run SDK in a hidden worker (no visible CMD windows) */
export const startCursorPrompt = async ({ prompt, project = {}, projectId }) => {
  recordAiGeneration({
    projectId,
    prompt,
    source: "cursor-bridge",
  });

  const promptId = `studio-${Date.now()}`;
  const runId = `run-${Date.now()}`;
  const createdAt = new Date().toISOString();

  createRun({
    id: runId,
    promptId,
    prompt,
    project,
  });

  writeInboxPending({
    id: promptId,
    prompt,
    project,
    status: "pending",
    createdAt,
    source: "zamili-studio-ui",
    runId,
  });

  const hasKey = validateCursorKey(process.env.CURSOR_API_KEY?.trim()).valid;
  const sdkAuto = hasKey && autoAgentEnabled();

  if (sdkAuto) {
    startHiddenSdkWorker(runId);
  } else {
    scheduleAgentRun(runId);
  }

  return {
    ok: true,
    queued: true,
    runId,
    promptId,
    cursorAuto: sdkAuto,
    inbox: { id: promptId, status: "pending", runId },
  };
};
