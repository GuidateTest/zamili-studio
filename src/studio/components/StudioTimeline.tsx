import { useCallback, useEffect, useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import {
  formatTimecode,
  getCompositionDuration,
  getCompositionFps,
  getCompositionScenes,
} from "../../engine/composition-meta";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useStudio } from "../hooks/useStudioStore";

type StudioTimelineProps = {
  playerRef: React.RefObject<PlayerRef | null>;
};

export const StudioTimeline: React.FC<StudioTimelineProps> = ({ playerRef }) => {
  const { tokens } = useTheme();
  const { project } = useStudio();
  const scenes = getCompositionScenes(project);
  const totalFrames = getCompositionDuration(project);
  const fps = getCompositionFps(project);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const f = playerRef.current?.getCurrentFrame?.();
      if (typeof f === "number") setFrame(f);
      const paused = playerRef.current?.isPlaying?.() === false;
      setPlaying(!paused);
    }, 100);
    return () => clearInterval(id);
  }, [playerRef]);

  const seek = useCallback(
    (f: number) => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, f));
      playerRef.current?.seekTo(clamped);
      setFrame(clamped);
    },
    [playerRef, totalFrames],
  );

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(Math.round(ratio * totalFrames));
  };

  const togglePlay = () => {
    if (playing) playerRef.current?.pause();
    else playerRef.current?.play();
  };

  const progress = (frame / totalFrames) * 100;

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${tokens.border}`,
        background: tokens.surface,
        padding: spacing.md,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => seek(0)}
          aria-label="Start"
          style={iconBtn(tokens)}
        >
          <SkipBack size={14} />
        </button>
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} style={iconBtn(tokens)}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          type="button"
          onClick={() => seek(totalFrames - 1)}
          aria-label="End"
          style={iconBtn(tokens)}
        >
          <SkipForward size={14} />
        </button>
        <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", color: tokens.textMuted, marginLeft: 4 }}>
          {formatTimecode(frame, fps)} / {formatTimecode(totalFrames, fps)}
        </span>
      </div>

      <div
        ref={trackRef}
        onClick={onTrackClick}
        style={{
          position: "relative",
          height: 48,
          borderRadius: radius.md,
          background: tokens.bgSubtle,
          border: `1px solid ${tokens.border}`,
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: "100%" }}>
          {scenes.map((scene) => {
            const widthPct = (scene.durationFrames / totalFrames) * 100;
            const active = frame >= scene.startFrame && frame < scene.endFrame;
            return (
              <div
                key={scene.id}
                title={scene.label}
                onClick={(e) => {
                  e.stopPropagation();
                  seek(scene.startFrame);
                }}
                style={{
                  width: `${widthPct}%`,
                  borderRight: `1px solid ${tokens.border}`,
                  background: active ? tokens.primarySoft : "transparent",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "4px 6px",
                  fontSize: 9,
                  fontWeight: 600,
                  color: active ? tokens.primary : tokens.textMuted,
                  overflow: "hidden",
                }}
              >
                {widthPct > 8 ? scene.label : ""}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${progress}%`,
            width: 2,
            background: tokens.primary,
            boxShadow: `0 0 8px ${tokens.primary}`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

const iconBtn = (tokens: ReturnType<typeof useTheme>["tokens"]) => ({
  width: 28,
  height: 28,
  borderRadius: 8,
  border: `1px solid ${tokens.border}`,
  background: tokens.bgSubtle,
  color: tokens.textSecondary,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const);
