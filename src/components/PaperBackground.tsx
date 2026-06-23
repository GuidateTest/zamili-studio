import { AbsoluteFill } from "remotion";
import { COLORS } from "../utils/colors";

export const PaperBackground: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${COLORS.accentSoft} 0%, transparent 55%)`,
      }}
    />
  </AbsoluteFill>
);
