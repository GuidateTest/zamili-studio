import { useCallback, useEffect, useState } from "react";
import {
  studioApi,
  type ApiKeyStatus,
  type AssetCheck,
  type HealthResponse,
  type StudioProject,
  type StudioStats,
} from "../lib/studio-api";

export const useStudioData = () => {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [stats, setStats] = useState<StudioStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [h, p] = await Promise.all([
        studioApi.health(),
        studioApi.listProjects(),
      ]);
      setHealth(h);
      setStats(h.stats);
      setProjects(p.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load studio data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createProject = useCallback(
    async (data: Parameters<typeof studioApi.createProject>[0]) => {
      const { project } = await studioApi.createProject(data);
      await refresh();
      return project;
    },
    [refresh],
  );

  return {
    loading,
    error,
    health,
    projects,
    stats,
    apiKeys: health?.apiKeys as ApiKeyStatus | undefined,
    assets: health?.assets as AssetCheck[] | undefined,
    ready: health?.ready ?? false,
    refresh,
    createProject,
  };
};
