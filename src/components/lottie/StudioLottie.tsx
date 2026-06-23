import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
} from "remotion";

export type StudioLottieProps = {
  name: string;
  startFrame?: number;
  playbackRate?: number;
  loop?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

/** Frame-synced Lottie player — autoplay disabled; progress driven by useCurrentFrame() */
export const StudioLottie: React.FC<StudioLottieProps> = ({
  name,
  startFrame = 0,
  playbackRate = 1,
  loop = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const src = staticFile(`assets/lottie/${name}.json`);
  const [data, setData] = useState<object | null>(null);
  const [handle] = useState(() => delayRender(`Loading Lottie: ${name}`));

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${src}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json as object);
          continueRender(handle);
        }
      })
      .catch(() => continueRender(handle));

    return () => {
      cancelled = true;
    };
  }, [src, handle]);

  useEffect(() => {
    const inst = lottieRef.current;
    if (!inst || !data) return;

    const totalFrames = inst.getDuration(true);
    if (!totalFrames || totalFrames <= 0) return;

    const localFrame = Math.max(0, (frame - startFrame) * playbackRate);
    const target = loop ? localFrame % totalFrames : Math.min(localFrame, totalFrames);
    inst.goToAndStop(target, true);
  }, [frame, startFrame, playbackRate, loop, data]);

  if (!data) return null;

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      autoplay={false}
      loop={false}
      style={style}
      className={className}
    />
  );
};
