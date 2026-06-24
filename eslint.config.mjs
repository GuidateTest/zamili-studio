import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    files: ["src/studio/**", "src/landing/LandingPage.tsx", "src/engine/StudioPlayer.tsx"],
    rules: {
      "@remotion/warn-native-media-tag": "off",
      "@remotion/no-string-assets": "off",
      "@remotion/non-pure-animation": "off",
    },
  },
];
