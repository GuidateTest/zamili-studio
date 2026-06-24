import { useCallback, useEffect, useState } from "react";
import { studioApi, type AssetProvider, type StudioAsset } from "../lib/studio-api";

export const useStudioAssets = (params: {
  q?: string;
  provider?: string;
  type?: string;
  category?: string;
}) => {
  const { q, provider, type, category } = params;
  const [items, setItems] = useState<StudioAsset[]>([]);
  const [providers, setProviders] = useState<AssetProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studioApi.searchAssets({ q, provider, type, category });
      setItems(result.items);
      setProviders(result.providers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, [q, provider, type, category]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, providers, loading, error, refresh };
};

export const useBrandAssets = () => {
  const [items, setItems] = useState<StudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void studioApi
      .listBrandAssets()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load brand assets"))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
};

export const useVoiceovers = () => {
  const [items, setItems] = useState<StudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void studioApi
      .listVoiceovers()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load voiceovers"))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
};
