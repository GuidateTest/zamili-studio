import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import type { ApiKeyStatus, AssetCheck } from "../lib/studio-api";

type SetupBannerProps = {
  apiKeys?: ApiKeyStatus;
  assets?: AssetCheck[];
  ready: boolean;
};

export const SetupBanner: React.FC<SetupBannerProps> = ({ apiKeys, assets, ready }) => {
  const { tokens } = useTheme();

  if (ready) return null;

  const missingKeys = apiKeys
    ? Object.entries(apiKeys)
        .filter(([, ok]) => !ok)
        .map(([k]) => k)
    : [];

  const missingAssets = assets?.filter((a) => !a.exists) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        margin: `0 ${spacing.xl}px ${spacing.lg}px`,
        padding: spacing.lg,
        borderRadius: radius.lg,
        border: `1px solid ${tokens.warning}44`,
        background: tokens.warningSoft,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <AlertCircle size={20} color={tokens.warning} style={{ marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Finish setup — add API keys to unlock everything
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: tokens.textSecondary, lineHeight: 1.5 }}>
            Copy <code style={{ fontSize: 12 }}>.env.example</code> → <code style={{ fontSize: 12 }}>.env</code> and
            paste your keys. Restart <code style={{ fontSize: 12 }}>npm run dev</code> after saving.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(["elevenlabs", "pexels", "cursor"] as const).map((key) => {
              const ok = apiKeys?.[key];
              return (
                <span
                  key={key}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: radius.full,
                    background: tokens.bgSubtle,
                    border: `1px solid ${tokens.border}`,
                    color: ok ? tokens.success : tokens.textMuted,
                  }}
                >
                  {ok ? <CheckCircle2 size={12} /> : <KeyRound size={12} />}
                  {key}
                </span>
              );
            })}
          </div>
          {missingAssets.length > 0 && (
            <p style={{ margin: "12px 0 0", fontSize: 12, color: tokens.textMuted }}>
              Optional assets missing: {missingAssets.map((a) => a.label).join(", ")} — run{" "}
              <code>npm run setup</code>
            </p>
          )}
          {missingKeys.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: 12, color: tokens.textMuted }}>
              Missing keys: {missingKeys.join(", ")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
