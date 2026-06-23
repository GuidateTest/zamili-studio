import { motion, type MotionStyle } from "framer-motion";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type SpringConfig = { damping: number; stiffness: number };

const defaultSpring: SpringConfig = { damping: 18, stiffness: 200 };

export const MotionFadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  config?: SpringConfig;
  style?: MotionStyle;
}> = ({ children, delay = 0, distance = 28, config = defaultSpring, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });

  return (
    <motion.div
      style={{
        opacity: p,
        y: interpolate(p, [0, 1], [distance, 0]),
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export const MotionScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
  config?: SpringConfig;
  style?: MotionStyle;
}> = ({ children, delay = 0, from = 0.85, config = { damping: 14, stiffness: 180 }, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });

  return (
    <motion.div
      style={{
        opacity: p,
        scale: interpolate(p, [0, 1], [from, 1]),
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export const MotionGlow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: MotionStyle;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
  const pulse = interpolate(Math.sin((frame - delay) / 12), [-1, 1], [0.4, 1]);

  return (
    <motion.div
      style={{
        opacity: p,
        scale: interpolate(p, [0, 1], [0.92, 1]),
        boxShadow: `0 8px ${24 + pulse * 16}px rgba(26, 129, 255, ${0.25 + pulse * 0.35})`,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export const MotionStagger: React.FC<{
  children: React.ReactNode;
  index?: number;
  staggerFrames?: number;
  style?: MotionStyle;
}> = ({ children, index = 0, staggerFrames = 8, style }) => (
  <MotionFadeUp delay={index * staggerFrames} style={style}>
    {children}
  </MotionFadeUp>
);

export const MotionSlideIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fromX?: number;
  config?: SpringConfig;
  style?: MotionStyle;
}> = ({
  children,
  delay = 0,
  fromX = 48,
  config = { damping: 17, stiffness: 190 },
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });

  return (
    <motion.div
      style={{
        opacity: p,
        x: interpolate(p, [0, 1], [fromX, 0]),
        scale: interpolate(p, [0, 1], [0.96, 1]),
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
