import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAgentRun, type AgentRun } from "../lib/cursor-bridge";

const TERMINAL = new Set(["finished", "error"]);

export const useAgentRun = (runId: string | null) => {
  const [run, setRun] = useState<AgentRun | null>(null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    if (!runId) return null;
    const next = await fetchAgentRun(runId);
    if (next) setRun(next);
    return next;
  }, [runId]);

  useEffect(() => {
    if (!runId) {
      setRun(null);
      setPolling(false);
      return;
    }

    setPolling(true);
    void poll();

    timerRef.current = setInterval(() => {
      void poll().then((r) => {
        if (r && TERMINAL.has(r.status)) {
          setPolling(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      });
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [runId, poll]);

  return { run, polling, refresh: poll };
};

export const formatElapsed = (ms: number) => {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
};

export const estimateEta = (run: AgentRun | null) => {
  if (!run || run.progress <= 0 || run.progress >= 100) return null;
  const rate = run.elapsedMs / run.progress;
  const remaining = rate * (100 - run.progress);
  return Math.max(0, Math.round(remaining));
};
