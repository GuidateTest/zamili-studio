import { Palette, RefreshCw } from "lucide-react";
import { AssetCard } from "../components/AssetCard";
import { Card } from "../design-system/components/Card";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useBrandAssets } from "../hooks/useStudioAssets";

const BRAND_COLORS = ["#1a81ff", "#6366f1", "#09090b", "#fafafa"];

export const BrandAssetsView: React.FC = () => {
  const { tokens } = useTheme();
  const { items, loading, error } = useBrandAssets();
  const logos = items.filter((i) => i.brandRole === "logo");
  const assets = items.filter((i) => i.brandRole !== "logo");

  return (
    <div style={{ padding: spacing.xl, flex: 1, overflow: "auto" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Brand Assets</h1>
      <p style={{ margin: "0 0 24px", color: tokens.textMuted, fontSize: 14 }}>
        Logos, product UI, service icons, and brand colors pulled from the local Zamili asset manifests.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: spacing.lg, marginBottom: spacing.lg }}>
        <Card padding={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Palette size={18} color={tokens.primary} />
            <span style={{ fontWeight: 700 }}>Brand Kit</span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {BRAND_COLORS.map((color) => (
              <div key={color} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: radius.md,
                    background: color,
                    border: `1px solid ${tokens.border}`,
                  }}
                />
                <code style={{ fontSize: 12, color: tokens.textMuted }}>{color}</code>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <RefreshCw size={18} color={tokens.primary} />
            <span style={{ fontWeight: 700 }}>Asset Sync</span>
          </div>
          <p style={{ margin: 0, color: tokens.textMuted, fontSize: 13, lineHeight: 1.6 }}>
            Add files under <code>public/zamili</code> or update <code>public/zamili/manifest.json</code>. The Studio API exposes them here automatically.
          </p>
        </Card>
      </div>

      <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 12 }}>
        {loading ? "Loading brand assets..." : error ? error : `${items.length} brand asset${items.length === 1 ? "" : "s"}`}
      </div>

      {logos.length > 0 && (
        <>
          <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Logos</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: spacing.md, marginBottom: spacing.xl }}>
            {logos.map((item) => (
              <AssetCard key={item.id} asset={item} compact />
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Product & Service Assets</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: spacing.md }}>
        {assets.map((item) => (
          <AssetCard key={item.id} asset={item} compact />
        ))}
      </div>
    </div>
  );
};
