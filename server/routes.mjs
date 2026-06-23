import {
  checkApiKeys,
  checkAssets,
  createProject,
  deleteProject,
  getDbPath,
  getProject,
  getStats,
  listProjects,
  recordAiGeneration,
  recordExport,
  seedIfEmpty,
  updateProject,
} from "./db.mjs";
import { verifyCursorKeyCached } from "./cursor-key.mjs";
import {
  getLatestRun,
  getProcessed,
  getRun,
  listProcessed,
} from "./agent-run.mjs";
import { listBrandAssets, listVoiceovers, searchAssets } from "./assets.mjs";
import { getRenderFile, getRenderJob, listRenderJobs, startRenderJob } from "./render-jobs.mjs";

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });

export const initStudioServer = () => {
  seedIfEmpty();
};

export const handleStudioApi = async (req, res, url) => {
  const pathname = url.pathname;
  const method = req.method ?? "GET";

  try {
    if (pathname === "/api/studio/health" && method === "GET") {
      const keys = checkApiKeys();
      const assets = checkAssets();
      const stats = getStats();
      let cursorValid = null;
      if (keys.cursor) {
        cursorValid = await verifyCursorKeyCached(process.env.CURSOR_API_KEY);
      }
      return json(res, 200, {
        ok: true,
        db: getDbPath(),
        stats,
        apiKeys: { ...keys, cursorValid },
        assets,
        ready: keys.elevenlabs || keys.pexels,
      });
    }

    if (pathname === "/api/studio/stats" && method === "GET") {
      return json(res, 200, getStats());
    }

    if (pathname === "/api/studio/assets" && method === "GET") {
      const result = await searchAssets({
        provider: url.searchParams.get("provider") ?? "all",
        type: url.searchParams.get("type") ?? "all",
        category: url.searchParams.get("category") ?? "all",
        query: url.searchParams.get("q") ?? "",
      });
      return json(res, 200, result);
    }

    if (pathname === "/api/studio/assets/brand" && method === "GET") {
      return json(res, 200, { items: listBrandAssets() });
    }

    if (pathname === "/api/studio/assets/voiceovers" && method === "GET") {
      return json(res, 200, { items: listVoiceovers() });
    }

    if (pathname === "/api/studio/projects" && method === "GET") {
      return json(res, 200, { projects: listProjects() });
    }

    if (pathname === "/api/studio/projects" && method === "POST") {
      const body = await readBody(req);
      const project = createProject(body);
      return json(res, 201, { project });
    }

    const projectMatch = pathname.match(/^\/api\/studio\/projects\/([^/]+)$/);
    if (projectMatch) {
      const id = decodeURIComponent(projectMatch[1]);
      if (method === "GET") {
        const project = getProject(id);
        if (!project) return json(res, 404, { error: "Not found" });
        return json(res, 200, { project });
      }
      if (method === "PATCH") {
        const body = await readBody(req);
        const project = updateProject(id, body);
        if (!project) return json(res, 404, { error: "Not found" });
        return json(res, 200, { project });
      }
      if (method === "DELETE") {
        const ok = deleteProject(id);
        return json(res, ok ? 200 : 404, { ok });
      }
    }

    if (pathname === "/api/studio/ai-generations" && method === "POST") {
      const body = await readBody(req);
      if (!body.prompt?.trim()) return json(res, 400, { error: "Missing prompt" });
      const record = recordAiGeneration(body);
      return json(res, 201, record);
    }

    if (pathname === "/api/studio/exports" && method === "POST") {
      const body = await readBody(req);
      if (!body.projectId) return json(res, 400, { error: "Missing projectId" });
      const record = recordExport(body);
      return json(res, 201, record);
    }

    if (pathname === "/api/studio/renders" && method === "GET") {
      return json(res, 200, { jobs: listRenderJobs() });
    }

    if (pathname === "/api/studio/renders" && method === "POST") {
      const body = await readBody(req);
      const job = startRenderJob({
        project: body.project ?? {},
        projectId: body.projectId ?? null,
        compositionId: body.compositionId ?? null,
      });
      if (body.projectId) {
        recordExport({
          projectId: body.projectId,
          outputPath: job.outputPath,
          format: "mp4",
        });
      }
      return json(res, 201, { job });
    }

    const renderDownloadMatch = pathname.match(/^\/api\/studio\/renders\/([^/]+)\/download$/);
    if (renderDownloadMatch && method === "GET") {
      const id = decodeURIComponent(renderDownloadMatch[1]);
      const file = getRenderFile(id);
      if (!file) return json(res, 404, { error: "Render file not found" });
      res.statusCode = 200;
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", String(file.stat.size));
      res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
      file.stream.pipe(res);
      return;
    }

    const renderMatch = pathname.match(/^\/api\/studio\/renders\/([^/]+)$/);
    if (renderMatch && method === "GET") {
      const id = decodeURIComponent(renderMatch[1]);
      const job = getRenderJob(id);
      if (!job) return json(res, 404, { error: "Render not found" });
      return json(res, 200, { job });
    }

    if (pathname === "/api/studio/agent-run/latest" && method === "GET") {
      const run = getLatestRun();
      return json(res, 200, { run });
    }

    const agentRunMatch = pathname.match(/^\/api\/studio\/agent-run\/([^/]+)$/);
    if (agentRunMatch && method === "GET") {
      const id = decodeURIComponent(agentRunMatch[1]);
      const run = getRun(id);
      if (!run) return json(res, 404, { error: "Run not found" });
      return json(res, 200, { run });
    }

    if (pathname === "/api/studio/inbox/processed" && method === "GET") {
      return json(res, 200, { items: listProcessed() });
    }

    const processedMatch = pathname.match(/^\/api\/studio\/inbox\/processed\/([^/]+)$/);
    if (processedMatch && method === "GET") {
      const id = decodeURIComponent(processedMatch[1]);
      const item = getProcessed(id);
      if (!item) return json(res, 404, { error: "Not found" });
      return json(res, 200, { item });
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    return json(res, 500, {
      error: err instanceof Error ? err.message : "Server error",
    });
  }
};
