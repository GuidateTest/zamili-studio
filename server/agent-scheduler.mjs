import fs from "fs";
import path from "path";
import {
  appendActivity,
  createRun,
  getRun,
  PROCESSED_DIR,
  ROOT,
  updateRun,
  writeInboxPending,
  readInboxPending,
} from "./agent-run.mjs";

const activeRuns = new Set();
let pollerStarted = false;

const finishRun = (runId, patch) => {
  updateRun(runId, {
    ...patch,
    progress: patch.status === "finished" ? 100 : patch.progress,
    etaMs: 0,
  });
  activeRuns.delete(runId);
};

const archiveResult = (run, finalResult) => {
  writeInboxPending({
    id: run.promptId,
    prompt: run.prompt,
    project: run.project,
    status: "processed",
    createdAt: run.startedAt,
    processedAt: new Date().toISOString(),
    source: "zamili-studio-ui",
    result: finalResult,
    runId: run.id,
  });
  fs.writeFileSync(
    path.join(PROCESSED_DIR, `${run.promptId}.json`),
    JSON.stringify(
      {
        id: run.promptId,
        prompt: run.prompt,
        project: run.project,
        status: "processed",
        createdAt: run.startedAt,
        processedAt: new Date().toISOString(),
        source: "zamili-studio-ui",
        result: finalResult,
        runId: run.id,
      },
      null,
      2,
    ),
  );
};

async function pollInboxRun(runId) {
  const run = getRun(runId);
  if (!run) return;

  updateRun(runId, {
    status: "running",
    progress: 12,
    phase: "Queued — Cursor Agent in this IDE will apply it",
  });
  appendActivity(runId, "info", "Inbox mode — no background processes spawned");

  const deadline = Date.now() + 15 * 60 * 1000;
  let tick = 0;

  while (Date.now() < deadline) {
    const inbox = readInboxPending();
    if (inbox?.id === run.promptId && inbox.status === "processed") {
      const result = inbox.result ?? inbox.cursorResult ?? "Applied by Cursor Agent.";
      archiveResult(run, result);
      finishRun(runId, { status: "finished", phase: "Complete", result });
      return;
    }

    const processedPath = path.join(PROCESSED_DIR, `${run.promptId}.json`);
    if (fs.existsSync(processedPath)) {
      const data = JSON.parse(fs.readFileSync(processedPath, "utf8"));
      const result = data.result ?? "Applied by Cursor Agent.";
      finishRun(runId, { status: "finished", phase: "Complete", result });
      return;
    }

    tick += 1;
    updateRun(runId, {
      progress: Math.min(88, 12 + tick * 2),
      phase: "Waiting for Cursor Agent…",
    });
    await new Promise((r) => setTimeout(r, 2500));
  }

  finishRun(runId, {
    status: "error",
    phase: "Timed out",
    result: "Still in inbox — open Cursor Agent in this repo to apply the prompt.",
  });
}

export const scheduleAgentRun = (runId) => {
  if (activeRuns.has(runId)) return;
  activeRuns.add(runId);

  void (async () => {
    const run = getRun(runId);
    if (!run) {
      activeRuns.delete(runId);
      return;
    }

    writeInboxPending({
      id: run.promptId,
      prompt: run.prompt,
      project: run.project,
      status: "pending",
      createdAt: run.startedAt,
      source: "zamili-studio-ui",
      runId,
    });

    try {
      await pollInboxRun(runId);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      finishRun(runId, { status: "error", phase: "Failed", result: message });
    }
  })();
};

/** Resume polling for any in-flight runs after dev server restart */
export const initAgentScheduler = () => {
  if (pollerStarted) return;
  pollerStarted = true;

  const inbox = readInboxPending();
  if (inbox?.status === "pending" && inbox.runId && !getRun(inbox.runId)) {
    createRun({
      id: inbox.runId,
      promptId: inbox.id,
      prompt: inbox.prompt,
      project: inbox.project ?? {},
    });
  }

  if (!fs.existsSync(path.join(ROOT, "data", "studio-runs"))) return;

  for (const file of fs.readdirSync(path.join(ROOT, "data", "studio-runs"))) {
    if (!file.endsWith(".json")) continue;
    try {
      const run = JSON.parse(
        fs.readFileSync(path.join(ROOT, "data", "studio-runs", file), "utf8"),
      );
      if (run.status === "queued" || run.status === "running") {
        scheduleAgentRun(run.id);
      }
    } catch {
      /* ignore corrupt run files */
    }
  }
};
