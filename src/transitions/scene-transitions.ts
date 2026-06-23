import { springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { TRANSITION_FRAMES } from "../utils/timing";

const spring = springTiming({
  config: { damping: 20, stiffness: 200 },
  durationInFrames: TRANSITION_FRAMES,
});

const linear = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const SCENE_TRANSITIONS = [
  { presentation: fade(), timing: linear },
  { presentation: slide({ direction: "from-bottom" }), timing: spring },
  { presentation: fade(), timing: spring },
  { presentation: slide({ direction: "from-right" }), timing: spring },
  { presentation: fade(), timing: linear },
  { presentation: slide({ direction: "from-bottom" }), timing: spring },
] as const;
