import { useCallback, useEffect, useRef, useState } from "react";
import { studioApi, type RenderJob } from "../lib/studio-api";

const TERMINAL = new Set(["done", "error"]);

export const useRenderJob = (jobId: string | null) => {
  const [job, setJob] = useState<RenderJob | null>(null);
  const [polling, setPolling] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!jobId) return null;
    const next = await studioApi.getRender(jobId);
    setJob(next);
    return next;
  }, [jobId]);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setPolling(false);
      return;
    }

    setPolling(true);
    void refresh();
    timer.current = setInterval(() => {
      void refresh().then((next) => {
        if (next && TERMINAL.has(next.status)) {
          setPolling(false);
          if (timer.current) clearInterval(timer.current);
        }
      });
    }, 1200);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [jobId, refresh]);

  return { job, polling, refresh };
};
