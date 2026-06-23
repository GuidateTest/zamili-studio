# Zamili Studio → Cursor bridge inbox

When you send a prompt from **Zamili Studio** (AI panel or editor), it is written here for Cursor to pick up.

## Files (gitignored at runtime)

| File | Purpose |
|------|---------|
| `pending-prompt.json` | Latest prompt + project context |
| `latest.md` | Human-readable prompt for `@latest.md` |
| `processed/` | Archive of handled prompts |

## Auto-send to Cursor

**Option A — Cursor API key (recommended for auto-run)**

Add to `.env`:

```
CURSOR_API_KEY=your_cursor_api_key
```

Get a key from [cursor.com/dashboard](https://cursor.com/dashboard). When enabled with `CURSOR_AUTO_AGENT=true`, Studio prompts run through a hidden local SDK worker.

**Option B — Inbox + rule (no API key)**

Prompts queue in this folder. The project rule `.cursor/rules/zamili-studio-bridge.mdc` tells Cursor Agent to process pending prompts when you chat in this workspace.

## Flow

```
Zamili Studio UI  →  POST /api/studio/cursor-prompt  →  pending-prompt.json  →  Cursor Agent
```
