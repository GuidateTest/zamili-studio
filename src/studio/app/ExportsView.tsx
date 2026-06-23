import { Download, FileVideo, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../design-system/components/Button";
import { Card } from "../design-system/components/Card";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { studioApi, type RenderJob, timeAgo } from "../lib/studio-api";

export const ExportsView: React.FC = () => {
  const { tokens } = useTheme();
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      setJobs(await studioApi.listRenders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div style={{ padding: spacing.xl, flex: 1, overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Exports</h1>
          <p style={{ margin: 0, color: tokens.textMuted, fontSize: 14 }}>
            Rendered MP4 files from Studio. Finished jobs can be downloaded here.
          </p>
        </div>
        <Button variant="secondary" icon={<RefreshCw size={16} />} onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 12 }}>
        {loading ? "Loading exports..." : error ? error : `${jobs.length} export${jobs.length === 1 ? "" : "s"}`}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: spacing.md }}>
        {jobs.map((job) => {
          const done = job.status === "done";
          const failed = job.status === "error";
          return (
            <Card key={job.id} padding={18}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: radius.md,
                    background: done ? tokens.successSoft : failed ? tokens.errorSoft : tokens.primarySoft,
                    color: done ? tokens.success : failed ? tokens.error : tokens.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileVideo size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{job.compositionId}</div>
                  <div style={{ fontSize: 11, color: tokens.textMuted }}>{timeAgo(job.createdAt)} · {job.status}</div>
                </div>
              </div>

              <div style={{ height: 6, borderRadius: radius.full, background: tokens.bgSubtle, overflow: "hidden", marginBottom: 10 }}>
                <div
                  style={{
                    width: `${job.progress}%`,
                    height: "100%",
                    background: done ? tokens.success : failed ? tokens.error : tokens.primary,
                  }}
                />
              </div>

              <div style={{ fontSize: 12, color: tokens.textSecondary, lineHeight: 1.5, minHeight: 36 }}>
                {job.error ?? job.phase}
              </div>

              {done && job.downloadUrl && (
                <Button
                  style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
                  icon={<Download size={16} />}
                  onClick={() => {
                    window.location.href = job.downloadUrl ?? "";
                  }}
                >
                  Download MP4
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
