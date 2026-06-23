import { motion } from "framer-motion";
import {
  Film,
  FolderOpen,
  Grid3X3,
  Home,
  Image,
  LayoutTemplate,
  Library,
  Mic2,
  Palette,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import { StudioLogo } from "../components/StudioLogo";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useStudio, type StudioView } from "../hooks/useStudioStore";

const NAV: { id: StudioView; label: string; icon: React.ReactNode; section?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { id: "projects", label: "Projects", icon: <FolderOpen size={18} /> },
  { id: "reel-generator", label: "AI Reel Generator", icon: <Film size={18} />, section: "Create" },
  { id: "carousel-generator", label: "AI Carousel Generator", icon: <Grid3X3 size={18} /> },
  { id: "image-generator", label: "AI Image Generator", icon: <Image size={18} /> },
  { id: "voiceovers", label: "Voiceovers", icon: <Mic2 size={18} />, section: "Assets" },
  { id: "brand-assets", label: "Brand Assets", icon: <Palette size={18} /> },
  { id: "media-library", label: "Media Library", icon: <Library size={18} /> },
  { id: "templates", label: "Templates", icon: <LayoutTemplate size={18} /> },
  { id: "exports", label: "Exports", icon: <Upload size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export const StudioSidebar: React.FC = () => {
  const { tokens } = useTheme();
  const { currentView, setView } = useStudio();
  let lastSection = "";

  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${tokens.border}`,
        background: tokens.bgElevated,
        padding: `${spacing.md}px ${spacing.sm}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 12px 24px",
        }}
      >
        <StudioLogo variant="full" height={76} style={{ maxWidth: 185 }} />
      </div>

      <nav style={{ flex: 1, overflowY: "auto" }}>
        {NAV.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const active = currentView === item.id;

          return (
            <div key={item.id}>
              {showSection && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: tokens.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.06,
                    padding: "16px 12px 8px",
                  }}
                >
                  {item.section}
                </div>
              )}
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => setView(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  marginBottom: 2,
                  border: "none",
                  borderRadius: radius.md,
                  background: active ? tokens.primarySoft : "transparent",
                  color: active ? tokens.primary : tokens.textSecondary,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                {item.icon}
                {item.label}
              </motion.button>
            </div>
          );
        })}
      </nav>

      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setView("reel-generator")}
        style={{
          margin: "8px 8px 0",
          padding: "12px 16px",
          borderRadius: radius.md,
          border: "none",
          background: tokens.gradient,
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "inherit",
        }}
      >
        <Sparkles size={16} />
        New AI Project
      </motion.button>
    </aside>
  );
};
