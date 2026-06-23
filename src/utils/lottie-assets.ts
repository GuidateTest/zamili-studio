/** Lottie animation keys — files live in public/assets/lottie/ */
export const LOTTIE = {
  automation: "automation",
  success: "success",
  sparkle: "sparkle",
  dataFlow: "data-flow",
  notification: "notification",
} as const;

export type LottieId = (typeof LOTTIE)[keyof typeof LOTTIE];
