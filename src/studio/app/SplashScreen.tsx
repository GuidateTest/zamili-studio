import { motion } from "framer-motion";
import { useEffect } from "react";
import { StudioLogo } from "../components/StudioLogo";
import { useTheme } from "../design-system/ThemeProvider";
import { useStudio } from "../hooks/useStudioStore";

export const SplashScreen: React.FC = () => {
  const { tokens } = useTheme();
  const { setBooted } = useStudio();

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1400);
    return () => clearTimeout(t);
  }, [setBooted]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: tokens.bg,
        gap: 24,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: tokens.glow, borderRadius: 24 }}
      >
        <StudioLogo variant="full" height={100} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.02 }}>Zamili Studio</div>
        <div style={{ fontSize: 14, color: tokens.textMuted, marginTop: 6 }}>
          AI-powered content creation
        </div>
      </motion.div>
    </motion.div>
  );
};
