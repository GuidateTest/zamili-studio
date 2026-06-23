import { motion } from "framer-motion";
import { ArrowRight, Film, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Card } from "../design-system/components/Card";
import { Button } from "../design-system/components/Button";
import { SetupBanner } from "../components/SetupBanner";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useStudioData } from "../hooks/useStudioData";
import { useStudio, type ProjectSettings } from "../hooks/useStudioStore";
import { timeAgo } from "../lib/studio-api";

export const DashboardView: React.FC = () => {
  const { tokens } = useTheme();
  const { setView, setActiveProject, updateProject } = useStudio();
  const { projects, stats, apiKeys, assets, ready, loading } = useStudioData();

  const statCards = [
    { label: "Projects", value: String(stats?.projects ?? 0), icon: <Film size={18} /> },
    {
      label: "Exports this month",
      value: String(stats?.exportsThisMonth ?? 0),
      icon: <TrendingUp size={18} />,
    },
    {
      label: "AI generations",
      value: String(stats?.aiGenerations ?? 0),
      icon: <Sparkles size={18} />,
    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
      <SetupBanner apiKeys={apiKeys} assets={assets} ready={ready} />

      <div style={{ padding: spacing.xl, paddingTop: ready ? spacing.xl : 0 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, letterSpacing: -0.02 }}>
            Good morning 👋
          </h1>
          <p style={{ margin: "0 0 32px", color: tokens.textMuted, fontSize: 15 }}>
            Create stunning content in minutes — projects saved locally in SQLite.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card padding={20}>
                <div style={{ color: tokens.primary, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{loading ? "—" : s.value}</div>
                <div style={{ fontSize: 13, color: tokens.textMuted, marginTop: 4 }}>{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card
          padding={32}
          style={{
            background: `linear-gradient(135deg, ${tokens.primarySoft} 0%, transparent 60%)`,
            border: `1px solid ${tokens.border}`,
            marginBottom: spacing.xl,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: radius.full,
                  background: tokens.primarySoft,
                  color: tokens.primary,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                <Zap size={12} />
                AI-powered
              </div>
              <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>
                Start a new Reel in seconds
              </h2>
              <p style={{ margin: 0, color: tokens.textMuted, maxWidth: 480, lineHeight: 1.5 }}>
                Type what you want — AI handles script, voiceover, footage, captions, music, and export.
              </p>
            </div>
            <Button
              icon={<ArrowRight size={16} />}
              onClick={() => setView("reel-generator")}
              size="lg"
            >
              Create with AI
            </Button>
          </div>
        </Card>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent projects</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: spacing.md,
          }}
        >
          {(projects.length ? projects.slice(0, 6) : []).map((p) => (
            <Card
              key={p.id}
              hover
              padding={0}
              onClick={() => {
                setActiveProject(p.id);
                const s = p.settings as Record<string, unknown>;
                updateProject({
                  prompt: p.prompt,
                  language: s.language as ProjectSettings["language"],
                  energy: s.energy as ProjectSettings["energy"],
                  location: (s.location as string) ?? "",
                  captionSize: s.captionSize as ProjectSettings["captionSize"],
                  animations: s.animations as ProjectSettings["animations"],
                  music: (s.music as boolean) ?? true,
                });
                setView("editor");
              }}
            >
              <div
                style={{
                  height: 140,
                  background: tokens.bgSubtle,
                  borderRadius: `${radius.lg}px ${radius.lg}px 0 0`,
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
                  {p.type} · {timeAgo(p.updatedAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
