import dotenv from "dotenv";
import type { Plugin } from "vite";

dotenv.config({ quiet: true });

type CursorPromptBody = {
  prompt: string;
  project?: Record<string, unknown>;
  projectId?: string;
};

export const studioApiPlugin = (): Plugin => ({
  name: "zamili-studio-api",
  async configureServer(server) {
    // @ts-expect-error — server/routes.mjs has no TS types
    const { initStudioServer, handleStudioApi } = await import("../../../server/routes.mjs");
    // @ts-expect-error — server/agent-scheduler.mjs has no TS types
    const { initAgentScheduler } = await import("../../../server/agent-scheduler.mjs");
    initStudioServer();
    initAgentScheduler();

    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url ?? "/", "http://localhost");

      if (url.pathname.startsWith("/api/studio/") && url.pathname !== "/api/studio/cursor-prompt") {
        await handleStudioApi(req, res, url);
        return;
      }

      if (url.pathname === "/api/studio/cursor-prompt" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          void (async () => {
            try {
              const parsed = JSON.parse(body || "{}") as CursorPromptBody;
              const prompt = parsed.prompt?.trim();
              if (!prompt) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Missing prompt" }));
                return;
              }

              // @ts-expect-error — server/cursor-prompt.mjs has no TS types
              const { startCursorPrompt } = await import("../../../server/cursor-prompt.mjs");
              const result = await startCursorPrompt({
                prompt,
                project: parsed.project ?? {},
                projectId: parsed.projectId,
              });

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: err instanceof Error ? err.message : "Bridge failed",
                }),
              );
            }
          })();
        });
        return;
      }

      next();
    });
  },
});
