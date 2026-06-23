import { forwardRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import type { GeneratedProjectSettings } from "./GeneratedProjectReel";
import { resolveComposition } from "./resolve-composition";

type StudioPlayerProps = {
  project: GeneratedProjectSettings;
  style?: React.CSSProperties;
  showControls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
};

/** In-app video preview with Remotion Player */
export const StudioPlayer = forwardRef<PlayerRef, StudioPlayerProps>(
  ({ project, style, showControls = false, loop = true, autoPlay = true }, ref) => {
    const comp = resolveComposition(project);

    return (
      <Player
        key={`${comp.id}-${project.prompt}-${project.language}-${project.energy}-${project.captionSize}-${project.animations}`}
        ref={ref}
        component={comp.component}
        durationInFrames={comp.durationInFrames}
        compositionWidth={comp.width}
        compositionHeight={comp.height}
        fps={comp.fps}
        inputProps={{ project }}
        style={{
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "var(--zs-shadow)",
          ...style,
        }}
        controls={showControls}
        loop={loop}
        autoPlay={autoPlay}
      />
    );
  },
);

StudioPlayer.displayName = "StudioPlayer";
