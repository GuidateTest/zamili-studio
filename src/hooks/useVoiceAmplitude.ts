import { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";

export const useVoiceAmplitude = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voiceoverSrc = staticFile("assets/audio/voiceover.mp3");
  const [handle] = useState(() => delayRender("Loading voiceover waveform"));

  const audioData = useAudioData(voiceoverSrc);

  useEffect(() => {
    if (audioData) {
      continueRender(handle);
    }
  }, [audioData, handle]);

  return useMemo(() => {
    if (!audioData) {
      return { amplitude: 0, bass: 0, samples: [] as number[] };
    }

    const visualization = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 32,
      optimizeFor: "speed",
    });

    const amplitude =
      visualization.reduce((a, v) => a + Math.abs(v), 0) / visualization.length;
    const bass =
      visualization.slice(0, 8).reduce((a, v) => a + Math.abs(v), 0) / 8;

    return { amplitude, bass, samples: visualization };
  }, [audioData, frame, fps]);
};
