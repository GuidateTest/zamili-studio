#!/usr/bin/env node
/**
 * sessionStart: inject pending Zamili Studio prompt into Cursor context.
 */
import fs from "fs";
import path from "path";

const INBOX = path.join(process.cwd(), ".cursor", "studio-inbox", "pending-prompt.json");

let additional_context = "";

try {
  if (fs.existsSync(INBOX)) {
    const data = JSON.parse(fs.readFileSync(INBOX, "utf8"));
    if (data.status === "pending" && data.prompt) {
      additional_context = [
        "[Zamili Studio — pending prompt from web UI]",
        `Prompt: ${data.prompt}`,
        data.project ? `Project settings: ${JSON.stringify(data.project)}` : "",
        "Process this prompt as part of the user's request.",
      ]
        .filter(Boolean)
        .join("\n");
    }
  }
} catch {
  // fail open
}

process.stdout.write(JSON.stringify({ additional_context }));
