import { motion } from "framer-motion";
import { Download, Loader2, Play, Video, Wand2 } from "lucide-react";
import { useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import { StudioPlayer } from "../../engine/StudioPlayer";
import { AgentRunPanel } from "../components/AgentRunPanel";
import { StudioTimeline } from "../components/StudioTimeline";
import { Button } from "../design-system/components/Button";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useAgentRun } from "../hooks/useAgentRun";
import { useRenderJob } from "../hooks/useRenderJob";
import { useStudio } from "../hooks/useStudioStore";
import { studioApi } from "../lib/studio-api";

const CONTROLS = [
  { key: "language", label: "Language", options: ["English", "Arabic"] },
  { key: "energy", label: "Energy", options: ["Calm", "Balanced", "Energetic"] },
  { key: "animations", label: "Animations", options: ["Minimal", "Balanced", "Premium"] },
  { key: "captionSize", label: "Captions", options: ["Small", "Medium", "Large"] },
] as const;

export const StudioEditor: React.FC = () => {
  const { tokens } = useTheme();
  const playerRef = useRef<PlayerRef>(null);
  const {
    project,
    setPrompt,
    updateProject,
    generateProject,
    activeRunId,
    activeProjectId,
  } = useStudio();
  const { run, polling } = useAgentRun(activeRunId);
  const [renderJobId, setRenderJobId] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const { job: renderJob, polling: renderPolling } = useRenderJob(renderJobId);
  const isGenerating = polling && Boolean(activeRunId);
  const isRendering = renderPolling || renderJob?.status === "rendering";

  const startRender = async () => {
    try {
      setRenderError(null);
      const { job } = await studioApi.startRender({
        project,
        projectId: activeProjectId,
      });
      setRenderJobId(job.id);
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "Failed to start render");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          padding: `${spacing.lg}px ${spacing.xl}px`,
          borderBottom: `1px solid ${tokens.border}`,
          background: tokens.bgElevated,
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>
          AI Video Editor
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: tokens.textMuted }}>
          Prompt → live agent progress → editable timeline preview (Remotion-style).
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: spacing.lg,
          padding: spacing.xl,
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.lg, minWidth: 0 }}>
          <div
            style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: radius.lg,
              padding: spacing.lg,
            }}
          >
            <label style={{ fontSize: 13, fontWeight: 600, color: tokens.textSecondary }}>
              What should we create?
            </label>
            <textarea
              value={project.prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder='e.g. "Create a Reel explaining how AI automation helps business owners save time."'
              style={{
                width: "100%",
                marginTop: 10,
                padding: 16,
                borderRadius: radius.md,
                border: `1px solid ${tokens.border}`,
                background: tokens.bgSubtle,
                color: tokens.text,
                fontSize: 15,
                lineHeight: 1.6,
                resize: "vertical",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Button
                icon={
                  isGenerating ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Wand2 size={16} />
                  )
                }
                onClick={generateProject}
                disabled={isGenerating || !project.prompt.trim()}
              >
                {isGenerating
                  ? run?.phase ?? "Agent working…"
                  : "Generate with AI"}
              </Button>
              <Button
                variant="secondary"
                icon={<Play size={16} />}
                onClick={() => playerRef.current?.play()}
              >
                Preview
              </Button>
              <Button
                variant="secondary"
                icon={
                  isRendering ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Video size={16} />
                  )
                }
                onClick={startRender}
                disabled={isRendering || !project.prompt.trim()}
              >
                {isRendering ? `Rendering ${Math.round(renderJob?.progress ?? 0)}%` : "Render MP4"}
              </Button>
              {renderJob?.status === "done" && renderJob.downloadUrl && (
                <Button
                  icon={<Download size={16} />}
                  onClick={() => {
                    window.location.href = renderJob.downloadUrl ?? "";
                  }}
                >
                  Download
                </Button>
              )}
            </div>
            {(renderJob || renderError) && (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: radius.md,
                  border: `1px solid ${
                    renderJob?.status === "done"
                      ? tokens.success + "55"
                      : renderJob?.status === "error" || renderError
                        ? tokens.error + "55"
                        : tokens.border
                  }`,
                  background:
                    renderJob?.status === "done"
                      ? tokens.successSoft
                      : renderJob?.status === "error" || renderError
                        ? tokens.errorSoft
                        : tokens.bgSubtle,
                  color: tokens.textSecondary,
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                {renderError ??
                  (renderJob
                    ? `${renderJob.phase} · ${Math.round(renderJob.progress)}%${
                        renderJob.error ? ` · ${renderJob.error}` : ""
                      }`
                    : "")}
              </div>
            )}
          </div>

          {activeRunId && <AgentRunPanel runId={activeRunId} />}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: spacing.md,
            }}
          >
            {CONTROLS.map((c) => (
              <div
                key={c.key}
                style={{
                  padding: spacing.md,
                  borderRadius: radius.md,
                  border: `1px solid ${tokens.border}`,
                  background: tokens.surface,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.textMuted, marginBottom: 8 }}>
                  {c.label}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {c.options.map((opt) => {
                    const val = opt.toLowerCase() as typeof project[keyof typeof project];
                    const active =
                      String(project[c.key as keyof typeof project]).toLowerCase() ===
                      opt.toLowerCase() ||
                      (c.key === "language" && opt === "Arabic" && project.language === "ar") ||
                      (c.key === "language" && opt === "English" && project.language === "en");
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (c.key === "language")
                            updateProject({ language: opt === "Arabic" ? "ar" : "en" });
                          else updateProject({ [c.key]: val } as Partial<typeof project>);
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: radius.full,
                          border: `1px solid ${active ? tokens.primary : tokens.border}`,
                          background: active ? tokens.primarySoft : "transparent",
                          color: active ? tokens.primary : tokens.textSecondary,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <StudioTimeline playerRef={playerRef} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: "sticky",
            top: 0,
            alignSelf: "start",
            display: "flex",
            flexDirection: "column",
            gap: spacing.md,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: tokens.textMuted,
            }}
          >
            Live Preview
            {run && isGenerating && (
              <span style={{ marginLeft: 8, color: tokens.primary }}>
                {Math.round(run.progress)}%
              </span>
            )}
          </div>
          <div
            style={{
              maxWidth: 360,
              margin: "0 auto",
              width: "100%",
              aspectRatio: "9/16",
              borderRadius: radius.lg,
              overflow: "hidden",
              border: `1px solid ${tokens.border}`,
              boxShadow: tokens.shadowLg,
            }}
          >
            <StudioPlayer
              ref={playerRef}
              project={project}
              style={{ width: "100%", height: "100%", borderRadius: 0 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
