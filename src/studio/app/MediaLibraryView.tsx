import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { AssetCard } from "../components/AssetCard";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useStudioAssets } from "../hooks/useStudioAssets";

export const MediaLibraryView: React.FC = () => {
  const { tokens } = useTheme();
  const [provider, setProvider] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("automation");
  const { items, providers, loading, error, refresh } = useStudioAssets({
    q: query,
    provider,
    type,
  });

  return (
    <div style={{ padding: spacing.xl, flex: 1, overflow: "auto" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Media Library</h1>
      <p style={{ margin: "0 0 24px", color: tokens.textMuted, fontSize: 14 }}>
        Search local project assets plus connected providers. Pexels, ElevenLabs, Pixabay, and Freesound connection states come from your API keys.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            style={{
              padding: "8px 16px",
              borderRadius: radius.full,
              border: `1px solid ${provider === p.id ? tokens.primary : tokens.border}`,
              background: provider === p.id ? tokens.primarySoft : tokens.surface,
              color: provider === p.id ? tokens.primary : tokens.textSecondary,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {p.label}
            {!p.connected && p.id !== "all" ? " · key needed" : ""}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
      <div style={{ position: "relative", maxWidth: 560, flex: 1, minWidth: 280 }}>
        <Search
          size={18}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: tokens.textMuted }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search media…"
          style={{
            width: "100%",
            padding: "12px 16px 12px 44px",
            borderRadius: radius.md,
            border: `1px solid ${tokens.border}`,
            background: tokens.bgSubtle,
            color: tokens.text,
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
      </div>
        {["all", "video", "image", "audio", "voiceover", "animation"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: "8px 12px",
              borderRadius: radius.full,
              border: `1px solid ${type === t ? tokens.primary : tokens.border}`,
              background: type === t ? tokens.primarySoft : tokens.surface,
              color: type === t ? tokens.primary : tokens.textSecondary,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
        <button
          onClick={refresh}
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.md,
            border: `1px solid ${tokens.border}`,
            background: tokens.surface,
            color: tokens.textSecondary,
            cursor: "pointer",
          }}
          aria-label="Refresh media"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 12 }}>
        {loading ? "Loading assets..." : error ? error : `${items.length} asset${items.length === 1 ? "" : "s"} found`}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: spacing.md,
        }}
      >
        {items.map((item) => (
          <AssetCard key={item.id} asset={item} />
        ))}
      </div>
    </div>
  );
};
