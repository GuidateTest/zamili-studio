import { FileAudio, Mic2 } from "lucide-react";
import { AssetCard } from "../components/AssetCard";
import { Card } from "../design-system/components/Card";
import { useTheme } from "../design-system/ThemeProvider";
import { spacing } from "../design-system/tokens";
import { useVoiceovers } from "../hooks/useStudioAssets";

export const VoiceoversView: React.FC = () => {
  const { tokens } = useTheme();
  const { items, loading, error } = useVoiceovers();
  const fullTracks = items.filter((i) => i.id === "voiceover-main");
  const segments = items.filter((i) => i.id !== "voiceover-main");
  const manifest = fullTracks[0]?.meta;

  return (
    <div style={{ padding: spacing.xl, flex: 1, overflow: "auto" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Voiceovers</h1>
      <p style={{ margin: "0 0 24px", color: tokens.textMuted, fontSize: 14 }}>
        ElevenLabs voiceover outputs, scene segments, and generation metadata linked from the local audio manifest.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: spacing.md, marginBottom: spacing.lg }}>
        <Card padding={18}>
          <Mic2 size={18} color={tokens.primary} />
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{String(manifest?.voiceId ?? "—").slice(0, 10)}</div>
          <div style={{ fontSize: 12, color: tokens.textMuted }}>Voice ID</div>
        </Card>
        <Card padding={18}>
          <FileAudio size={18} color={tokens.primary} />
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>
            {Math.round(Number(manifest?.durationSeconds ?? 0)) || "—"}s
          </div>
          <div style={{ fontSize: 12, color: tokens.textMuted }}>Duration</div>
        </Card>
        <Card padding={18}>
          <Mic2 size={18} color={tokens.primary} />
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{segments.length}</div>
          <div style={{ fontSize: 12, color: tokens.textMuted }}>Scene segments</div>
        </Card>
      </div>

      <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 12 }}>
        {loading ? "Loading voiceovers..." : error ? error : `${items.length} voice asset${items.length === 1 ? "" : "s"}`}
      </div>

      {fullTracks.length > 0 && (
        <>
          <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Master Track</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: spacing.md, marginBottom: spacing.xl }}>
            {fullTracks.map((item) => (
              <AssetCard key={item.id} asset={item} />
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Scene Segments</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: spacing.md }}>
        {segments.map((item) => (
          <AssetCard key={item.id} asset={item} />
        ))}
      </div>
    </div>
  );
};
