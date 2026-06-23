import { motion } from "framer-motion";
import { Film, Plus } from "lucide-react";
import { Card } from "../design-system/components/Card";
import { Button } from "../design-system/components/Button";
import { useTheme } from "../design-system/ThemeProvider";
import { spacing } from "../design-system/tokens";
import { useStudioData } from "../hooks/useStudioData";
import { useStudio, type ProjectSettings } from "../hooks/useStudioStore";
import { timeAgo } from "../lib/studio-api";

const blankProject: ProjectSettings = {
  prompt: "",
  language: "en",
  energy: "balanced",
  location: "",
  captionSize: "md",
  animations: "premium",
  music: true,
};

export const ProjectsView: React.FC = () => {
  const { tokens } = useTheme();
  const { projects, loading, createProject } = useStudioData();
  const { setView, setActiveProject, updateProject } = useStudio();

  const handleNew = async () => {
    const p = await createProject({
      title: "Untitled Reel",
      type: "reel",
      prompt: "",
      settings: blankProject,
      compositionId: "AIProjectReel",
    });
    setActiveProject(p.id);
    updateProject(blankProject);
    setView("editor");
  };

  return (
    <div style={{ padding: spacing.xl, flex: 1, overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700 }}>Projects</h1>
          <p style={{ margin: 0, color: tokens.textMuted, fontSize: 14 }}>
            {loading ? "Loading…" : `${projects.length} project${projects.length === 1 ? "" : "s"} saved locally`}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={handleNew}>
          New project
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: spacing.md,
        }}
      >
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card
              hover
              padding={0}
              onClick={() => {
                setActiveProject(p.id);
                const s = p.settings as Record<string, unknown>;
                updateProject({
                  prompt: p.prompt,
                  language: (s.language as ProjectSettings["language"]) ?? "en",
                  energy: (s.energy as ProjectSettings["energy"]) ?? "balanced",
                  location: (s.location as string) ?? "",
                  captionSize: (s.captionSize as ProjectSettings["captionSize"]) ?? "md",
                  animations: (s.animations as ProjectSettings["animations"]) ?? "premium",
                  music: (s.music as boolean) ?? true,
                });
                setView("editor");
              }}
            >
              <div
                style={{
                  height: 120,
                  background: tokens.bgSubtle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: tokens.primary,
                }}
              >
                <Film size={28} />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 4 }}>
                  {p.type} · {p.status} · {timeAgo(p.updatedAt)}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
