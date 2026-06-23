import { CheckCircle2, Circle, Database, KeyRound } from "lucide-react";
import { Card } from "../design-system/components/Card";
import { useTheme } from "../design-system/ThemeProvider";
import { spacing } from "../design-system/tokens";
import { useStudioData } from "../hooks/useStudioData";

export const SettingsView: React.FC = () => {
  const { tokens } = useTheme();
  const { health, apiKeys, assets, stats } = useStudioData();

  return (
    <div style={{ padding: spacing.xl, flex: 1, overflow: "auto", maxWidth: 720 }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Settings</h1>
      <p style={{ margin: "0 0 32px", color: tokens.textMuted, fontSize: 14 }}>
        Local SQLite database — no cloud account required. Add API keys in <code>.env</code>.
      </p>

      <Card padding={20} style={{ marginBottom: spacing.lg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Database size={18} color={tokens.primary} />
          <span style={{ fontWeight: 700 }}>Local database</span>
        </div>
        <div style={{ fontSize: 13, color: tokens.textSecondary, lineHeight: 1.6 }}>
          <div>Path: <code style={{ fontSize: 12 }}>{health?.db ?? "data/zamili-studio.db"}</code></div>
          <div style={{ marginTop: 8 }}>
            {stats?.projects ?? 0} projects · {stats?.exportsTotal ?? 0} exports ·{" "}
            {stats?.aiGenerations ?? 0} AI generations
          </div>
        </div>
      </Card>

      <Card padding={20} style={{ marginBottom: spacing.lg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <KeyRound size={18} color={tokens.primary} />
          <span style={{ fontWeight: 700 }}>API keys</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(
            [
              ["elevenlabs", "ElevenLabs — voiceovers & SFX"],
              ["pexels", "Pexels — stock video"],
              ["pixabay", "Pixabay — stock media (optional)"],
              ["freesound", "Freesound — audio (optional)"],
              ["cursor", "Cursor — AI bridge (optional)"],
            ] as const
          ).map(([key, label]) => {
            const ok = apiKeys?.[key];
            const cursorInvalid = key === "cursor" && ok && apiKeys?.cursorValid === false;
            const cursorVerified = key === "cursor" && ok && apiKeys?.cursorValid === true;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: cursorInvalid
                    ? tokens.warning
                    : ok
                      ? tokens.success
                      : tokens.textMuted,
                }}
              >
                {cursorInvalid ? (
                  <Circle size={16} />
                ) : ok ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Circle size={16} />
                )}
                <span>
                  {label}
                  {cursorInvalid && " — rejected by Cursor (create new key at cursor.com/dashboard → API Keys)"}
                  {cursorVerified && " — verified"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card padding={20}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Asset checks</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {assets?.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: a.exists ? tokens.textSecondary : tokens.warning,
              }}
            >
              {a.exists ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {a.label}
            </div>
          ))}
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 12, color: tokens.textMuted }}>
          Run <code>npm run setup</code> to download optional assets after adding API keys.
        </p>
      </Card>
    </div>
  );
};
