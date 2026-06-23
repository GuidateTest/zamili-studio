#!/usr/bin/env node
/**
 * Queues a Zamili Studio prompt for Cursor and optionally spawns a local agent.
 * Usage: node scripts/cursor-bridge.mjs "<prompt>" '<project-json>'
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  isAuthError,
  validateCursorKey,
  verifyCursorKey,
} from "../server/cursor-key.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env"), quiet: true });
const INBOX = path.join(ROOT, ".cursor", "studio-inbox");

const prompt = process.argv[2] ?? "";
const projectRaw = process.argv[3] ?? "{}";

let project = {};
try {
  project = JSON.parse(projectRaw);
} catch {
  project = {};
}

fs.mkdirSync(INBOX, { recursive: true });
fs.mkdirSync(path.join(INBOX, "processed"), { recursive: true });

const payload = {
  id: `studio-${Date.now()}`,
  prompt,
  project,
  status: "pending",
  createdAt: new Date().toISOString(),
  source: "zamili-studio-ui",
};

const jsonPath = path.join(INBOX, "pending-prompt.json");
const mdPath = path.join(INBOX, "latest.md");

const writeInbox = (extra = {}) => {
  fs.writeFileSync(jsonPath, JSON.stringify({ ...payload, ...extra }, null, 2));
};

writeInbox();
fs.writeFileSync(
  mdPath,
  `# Zamili Studio → Cursor\n\n**Prompt:** ${prompt}\n\n**Time:** ${payload.createdAt}\n\n## Project context\n\`\`\`json\n${JSON.stringify(project, null, 2)}\n\`\`\`\n`,
);

const finish = (result) => {
  process.stdout.write(`${JSON.stringify({ bridgeResult: result })}\n`);
};

const apiKey = process.env.CURSOR_API_KEY?.trim();

async function main() {
  const keyCheck = validateCursorKey(apiKey);

  if (!keyCheck.valid) {
    finish({
      ok: true,
      queued: true,
      cursorAuto: false,
      warning:
        "No CURSOR_API_KEY in .env — prompt queued. Cursor Agent in this IDE will still apply it.",
    });
    return;
  }

  const keyLive = await verifyCursorKey(apiKey);

  if (keyLive === false) {
    writeInbox({ status: "pending", cursorAutoSkipped: true });
    finish({
      ok: true,
      queued: true,
      cursorAuto: false,
      warning:
        "Cursor rejected this API key. Prompt queued — use Cursor Agent here to apply it. Create a new User API Key at cursor.com/dashboard → API Keys.",
    });
    return;
  }

  try {
    const { Agent } = await import("@cursor/sdk");
    const fullPrompt = [
      "Zamili Studio AI request — apply to this project:",
      "",
      prompt,
      "",
      "Project settings:",
      JSON.stringify(project, null, 2),
      "",
      "Update scenes, engine, voiceover scripts, or Studio UI as needed.",
    ].join("\n");

    const result = await Agent.prompt(fullPrompt, {
      apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: ROOT },
    });

    writeInbox({
      status: "sent",
      cursorStatus: result.status,
      cursorResult: result.result?.slice?.(0, 500),
    });

    finish({ ok: true, queued: true, cursorAuto: true, cursorStatus: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("Cannot find package") || message.includes("@cursor/sdk")) {
      finish({
        ok: true,
        queued: true,
        cursorAuto: false,
        warning: "@cursor/sdk dependencies missing — prompt queued for inbox only.",
      });
      return;
    }

    if (isAuthError(message)) {
      writeInbox({ status: "pending", cursorAutoSkipped: true });
      finish({
        ok: true,
        queued: true,
        cursorAuto: false,
        warning:
          "Cursor rejected this API key. Prompt queued — create a new User API Key at cursor.com/dashboard → API Keys.",
      });
      return;
    }

    writeInbox({ status: "pending", cursorError: message });
    finish({
      ok: true,
      queued: true,
      cursorAuto: false,
      warning: `Cursor agent unavailable (${message}). Prompt queued for inbox.`,
    });
  }
}

main().catch((err) => {
  finish({
    ok: true,
    queued: true,
    cursorAuto: false,
    warning: err instanceof Error ? err.message : String(err),
  });
});
