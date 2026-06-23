import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

type VideoBackdropProps = {
  src: string;
  darken?: number;
  zoom?: boolean;
  startFrom?: number;
};

/** Full-bleed stock footage with cinematic Ken Burns and dark overlay for caption legibility */
export const VideoBackdrop: React.FC<VideoBackdropProps> = ({
  src,
  darken = 0.62,
  zoom = true,
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const scale = zoom
    ? interpolate(frame, [0, 280], [1.06, 1.14], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(5,7,15,${darken + 0.08}) 0%, rgba(5,7,15,${darken}) 45%, rgba(5,7,15,${darken + 0.12}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
