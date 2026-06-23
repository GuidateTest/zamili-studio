import { motion } from "framer-motion";
import {
  Building2,
  Clapperboard,
  GraduationCap,
  ImageIcon,
  Megaphone,
  Share2,
  Sparkles,
} from "lucide-react";
import { Card } from "../design-system/components/Card";
import { StudioLogo } from "../components/StudioLogo";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useStudio, type ContentType } from "../hooks/useStudioStore";

const OPTIONS: {
  id: ContentType;
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  { id: "reel", title: "Reel", desc: "Short-form vertical video", icon: <Clapperboard size={24} /> },
  { id: "carousel", title: "Carousel", desc: "Multi-slide social post", icon: <ImageIcon size={24} /> },
  { id: "advertisement", title: "Advertisement", desc: "Paid ad creative", icon: <Megaphone size={24} /> },
  { id: "product-showcase", title: "Product Showcase", desc: "Highlight your product", icon: <Sparkles size={24} /> },
  { id: "educational", title: "Educational Video", desc: "Teach & explain", icon: <GraduationCap size={24} /> },
  { id: "real-estate", title: "Real Estate Video", desc: "Listings & agent promos", icon: <Building2 size={24} /> },
  { id: "social", title: "Social Media Content", desc: "Posts for any platform", icon: <Share2 size={24} /> },
];

export const OnboardingScreen: React.FC = () => {
  const { tokens } = useTheme();
  const { completeOnboarding } = useStudio();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xxl,
        background: tokens.bg,
        backgroundImage: tokens.gradientSubtle,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", maxWidth: 720, marginBottom: spacing.xxl }}
      >
        <StudioLogo variant="full" height={72} style={{ margin: "0 auto 20px" }} />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: radius.full,
            background: tokens.primarySoft,
            color: tokens.primary,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: spacing.lg,
          }}
        >
          <Sparkles size={14} />
          Welcome to Zamili Studio
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: -0.03,
            margin: "0 0 16px",
            lineHeight: 1.1,
          }}
        >
          What would you like to create today?
        </h1>
        <p style={{ fontSize: 17, color: tokens.textMuted, margin: 0, lineHeight: 1.6 }}>
          Pick a format and AI handles the script, scenes, voiceover, footage, and export.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: spacing.md,
          maxWidth: 960,
          width: "100%",
        }}
      >
        {OPTIONS.map((opt, i) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card hover padding={24} onClick={() => completeOnboarding(opt.id)}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.md,
                  background: tokens.primarySoft,
                  color: tokens.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {opt.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{opt.title}</div>
              <div style={{ fontSize: 13, color: tokens.textMuted, lineHeight: 1.4 }}>{opt.desc}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
