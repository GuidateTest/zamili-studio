import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const fraunces = loadFraunces("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

export const BODY_FONT = inter.fontFamily;
export const DISPLAY_FONT = fraunces.fontFamily;
export const ARABIC_FONT = inter.fontFamily;
