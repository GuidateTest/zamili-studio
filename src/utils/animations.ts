import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const smooth = Easing.bezier(0.25, 0.1, 0.25, 1);
export const dramatic = Easing.bezier(0.16, 1, 0.3, 1);

export const fadeInOut = (
  frame: number,
  durationInFrames: number,
  fadeFrames = 12,
) => {
  const fadeIn = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: smooth,
    },
  );
  return Math.min(fadeIn, fadeOut);
};

export const useSpringIn = (delay = 0, config = { damping: 18, stiffness: 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config,
  });
};

export const slideUp = (progress: number, distance = 40) => {
  return interpolate(progress, [0, 1], [distance, 0], { easing: dramatic });
};

export const scalePop = (progress: number) => {
  return interpolate(progress, [0, 1], [0.85, 1], { easing: dramatic });
};
