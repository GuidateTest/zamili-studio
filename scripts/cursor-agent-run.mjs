#!/usr/bin/env node
/**
 * Hidden Cursor SDK worker.
 * Spawned with windowsHide=true by the Vite API plugin, never as a visible terminal.
 */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
  appendActivity,
  getRun,
  PROCESSED_DIR,
  ROOT,
  updateRun,
  writeInboxPending,
} from "../server/agent-run.mjs";
import { isAuthError, validateCursorKey, verifyCursorKey } from "../server/cursor-key.mjs";

dotenv.config({ path: path.join(ROOT, ".env"), quiet: true });

const runId = process.argv[2];
const apiKey = process.env.CURSOR_API_KEY?.trim();

const finishRun = (patch) => {
  updateRun(runId, {
    ...patch,
    progress: patch.progress ?? (patch.status === "finished" ? 100 : 0),
    etaMs: 0,
  });
};

const archiveResult = (run, result) => {
  const processed = {
    id: run.promptId,
    prompt: run.prompt,
    project: run.project,
    status: "processed",
    createdAt: run.startedAt,
    processedAt: new Date().toISOString(),
    source: "zamili-studio-ui",
    cursorAuto: true,
    result,
    runId: run.id,
  };

  writeInboxPending(processed);
  fs.writeFileSync(
    path.join(PROCESSED_DIR, `${run.promptId}.json`),
    JSON.stringify(processed, null, 2),
  );
};

async function main() {
  if (!runId) throw new Error("Missing runId");

  const run = getRun(runId);
  if (!run) throw new Error(`Run not found: ${runId}`);

  updateRun(runId, {
    status: "running",
    progress: 8,
    phase: "Checking Cursor SDK key",
  });

  if (!validateCursorKey(apiKey).valid) {
    throw new Error("CURSOR_API_KEY is missing or invalid");
  }

  const keyOk = await verifyCursorKey(apiKey);
  if (keyOk !== true) {
    throw new Error("Cursor rejected CURSOR_API_KEY");
  }

  updateRun(runId, {
    status: "running",
    progress: 15,
    phase: "Starting hidden Cursor SDK worker",
  });
  appendActivity(runId, "info", "SDK worker started with hidden window");

  const { Agent } = await import("@cursor/sdk");

  const fullPrompt = [
    "Zamili Studio AI request.",
    "",
    "Do the whole job in this repository until the Studio app shows a ready live preview.",
    "",
    "User prompt:",
    run.prompt,
    "",
    "Project settings:",
    JSON.stringify(run.project, null, 2),
    "",
    "Rules:",
    "- Do not spawn dev servers.",
    "- Do not open terminal windows.",
    "- Keep changes scoped to this Zamili Studio project.",
    "- The preview should use the project prompt/settings and the generic AIProjectReel composition.",
    "- When complete, summarize exactly what changed and what is ready in the Studio UI.",
  ].join("\n");

  await using agent = await Agent.create({
    apiKey,
    model: { id: "composer-2.5" },
    local: { cwd: ROOT, settingSources: [] },
  });

  updateRun(runId, {
    progress: 24,
    phase: "Planning project changes",
    agentId: agent.agentId,
  });
  appendActivity(runId, "info", `Cursor agent ${agent.agentId} connected`);

  const sdkRun = await agent.send(fullPrompt);
  appendActivity(runId, "info", `Run ${sdkRun.id} started`);

  let resultText = "";
  let toolEvents = 0;

  for await (const event of sdkRun.stream()) {
    const type = String(event.type ?? "");

    if (type.includes("thinking")) {
      updateRun(runId, {
        progress: Math.min(42, 26 + toolEvents * 4),
        phase: "Thinking through the edit",
      });
    }

    if (type.includes("tool")) {
      toolEvents += 1;
      const label = event.name ?? event.toolName ?? "project files";
      appendActivity(runId, "tool", `Working on ${label}`);
      updateRun(runId, {
        progress: Math.min(88, 42 + toolEvents * 8),
        phase: `Working on ${label}`,
      });
    }

    if (event.type === "assistant") {
      for (const block of event.message?.content ?? []) {
        if (block.type === "text" && block.text) {
          resultText += block.text;
          const snippet = block.text.replace(/\s+/g, " ").trim().slice(0, 160);
          if (snippet) appendActivity(runId, "assistant", snippet);
          updateRun(runId, {
            progress: Math.min(92, 55 + toolEvents * 6),
            phase: "Applying changes",
          });
        }
      }
    }
  }

  updateRun(runId, { progress: 96, phase: "Finalizing live preview" });
  await sdkRun.wait();

  const status = sdkRun.status ?? "finished";
  const result =
    resultText.trim() ||
    sdkRun.result?.trim?.() ||
    "Cursor SDK finished. Live preview is ready.";

  archiveResult(run, result);
  finishRun({
    status: status === "error" ? "error" : "finished",
    progress: 100,
    phase: status === "error" ? "Agent reported an error" : "Ready live preview",
    cursorStatus: status,
    result,
  });
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  const friendly = isAuthError(message)
    ? "Cursor API key failed auth. Update CURSOR_API_KEY or set CURSOR_AUTO_AGENT=false."
    : message;

  finishRun({
    status: "error",
    progress: 100,
    phase: "SDK worker failed",
    result: friendly,
  });
});
