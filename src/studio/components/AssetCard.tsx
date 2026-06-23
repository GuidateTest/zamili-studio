import { FileAudio, FileVideo, Image, Sparkles } from "lucide-react";
import { useTheme } from "../design-system/ThemeProvider";
import { radius } from "../design-system/tokens";
import type { StudioAsset } from "../lib/studio-api";

type AssetCardProps = {
  asset: StudioAsset;
  compact?: boolean;
};

const iconFor = (type: StudioAsset["type"]) => {
  if (type === "video") return FileVideo;
  if (type === "audio" || type === "voiceover") return FileAudio;
  if (type === "animation") return Sparkles;
  return Image;
};

export const AssetCard: React.FC<AssetCardProps> = ({ asset, compact }) => {
  const { tokens } = useTheme();
  const Icon = iconFor(asset.type);
  const canImage = asset.type === "image" && asset.url;
  const canVideo = asset.type === "video" && asset.url && asset.exists;
  const canAudio = (asset.type === "audio" || asset.type === "voiceover") && asset.url && asset.exists;

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${tokens.border}`,
        background: tokens.surface,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: compact ? 96 : 132,
          background: tokens.bgSubtle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokens.primary,
          position: "relative",
        }}
      >
        {canImage ? (
          <img src={asset.url ?? ""} alt={asset.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : canVideo ? (
          <video src={asset.url ?? ""} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : canAudio ? (
          <audio src={asset.url ?? ""} controls style={{ width: "88%" }} />
        ) : (
          <Icon size={compact ? 24 : 32} />
        )}
        {!asset.exists && asset.publicPath && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "3px 7px",
              borderRadius: radius.full,
              background: tokens.warningSoft,
              color: tokens.warning,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            Missing
          </span>
        )}
      </div>
      <div style={{ padding: compact ? 10 : 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{asset.title}</div>
        <div style={{ fontSize: 11, color: tokens.textMuted, marginTop: 4 }}>
          {asset.provider} · {asset.type} · {asset.category}
        </div>
        {!compact && asset.description && (
          <div style={{ fontSize: 11, color: tokens.textSecondary, marginTop: 8, lineHeight: 1.4 }}>
            {asset.description.slice(0, 130)}
          </div>
        )}
      </div>
    </div>
  );
};
