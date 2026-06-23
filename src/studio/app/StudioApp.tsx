import { AnimatePresence, motion } from "framer-motion";
import {
  Film,
  Grid3X3,
  Image,
  LayoutTemplate,
  Moon,
  Sun,
} from "lucide-react";
import { ThemeProvider, useTheme } from "../design-system/ThemeProvider";
import { spacing } from "../design-system/tokens";
import { StudioProvider, useStudio } from "../hooks/useStudioStore";
import { AIPanel } from "./AIPanel";
import { BrandAssetsView } from "./BrandAssetsView";
import { DashboardView } from "./DashboardView";
import { ExportsView } from "./ExportsView";
import { MediaLibraryView } from "./MediaLibraryView";
import { OnboardingScreen } from "./OnboardingScreen";
import { PlaceholderView } from "./PlaceholderView";
import { SplashScreen } from "./SplashScreen";
import { StudioEditor } from "./StudioEditor";
import { StudioSidebar } from "./StudioSidebar";
import { ProjectsView } from "./ProjectsView";
import { SettingsView } from "./SettingsView";
import { VoiceoversView } from "./VoiceoversView";

const EDITOR_VIEWS = new Set([
  "editor",
  "reel-generator",
  "carousel-generator",
  "image-generator",
]);

const StudioShellInner: React.FC = () => {
  const { tokens, mode, toggle } = useTheme();
  const { booted, onboardingComplete, currentView } = useStudio();

  if (!booted) return <SplashScreen />;
  if (!onboardingComplete) return <OnboardingScreen />;

  const showEditor = EDITOR_VIEWS.has(currentView);
  const showAI = showEditor || currentView === "dashboard";

  const renderMain = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "editor":
      case "reel-generator":
        return <StudioEditor />;
      case "media-library":
        return <MediaLibraryView />;
      case "projects":
        return <ProjectsView />;
      case "carousel-generator":
        return (
          <PlaceholderView
            title="AI Carousel Generator"
            description="Turn any idea into a polished multi-slide carousel — copy, visuals, and layout included."
            icon={<Grid3X3 size={28} />}
          />
        );
      case "image-generator":
        return (
          <PlaceholderView
            title="AI Image Generator"
            description="Generate on-brand images for posts, ads, and thumbnails."
            icon={<Image size={28} />}
          />
        );
      case "voiceovers":
        return <VoiceoversView />;
      case "brand-assets":
        return <BrandAssetsView />;
      case "templates":
        return (
          <PlaceholderView
            title="Templates"
            description="Start from proven templates for reels, ads, carousels, and real estate."
            icon={<LayoutTemplate size={28} />}
          />
        );
      case "exports":
        return <ExportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <StudioSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${spacing.lg}px`,
            borderBottom: `1px solid ${tokens.border}`,
            background: tokens.bgElevated,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: tokens.textMuted }}>
            <Film size={16} />
            {currentView.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${tokens.border}`,
              background: tokens.bgSubtle,
              color: tokens.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </header>
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                {renderMain()}
              </motion.div>
            </AnimatePresence>
          </main>
          {showAI && <AIPanel />}
        </div>
      </div>
    </div>
  );
};

export const StudioApp: React.FC = () => (
  <ThemeProvider>
    <StudioProvider>
      <StudioShellInner />
    </StudioProvider>
  </ThemeProvider>
);
