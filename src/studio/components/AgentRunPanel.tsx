import { motion } from "framer-motion";
import { Bot, CheckCircle2, Loader2, Wrench } from "lucide-react";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { estimateEta, formatElapsed, useAgentRun } from "../hooks/useAgentRun";

type AgentRunPanelProps = {
  runId: string | null;
  compact?: boolean;
};

const activityIcon = (type: string) => {
  if (type === "tool") return Wrench;
  if (type === "assistant") return Bot;
  return Bot;
};

export const AgentRunPanel: React.FC<AgentRunPanelProps> = ({ runId, compact }) => {
  const { tokens } = useTheme();
  const { run, polling } = useAgentRun(runId);

  if (!runId || !run) return null;

  const eta = estimateEta(run);
  const done = run.status === "finished";
  const failed = run.status === "error";
  const active = polling && !done && !failed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${done ? tokens.success + "44" : failed ? tokens.error + "44" : tokens.border}`,
        background: tokens.surface,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: compact ? spacing.md : spacing.lg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          {active ? (
            <Loader2 size={18} color={tokens.primary} style={{ animation: "spin 1s linear infinite" }} />
          ) : done ? (
            <CheckCircle2 size={18} color={tokens.success} />
          ) : (
            <Bot size={18} color={failed ? tokens.error : tokens.primary} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {done ? "Agent complete" : failed ? "Agent failed" : "Agent working…"}
            </div>
            <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
              {run.phase}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: tokens.textMuted }}>
            <div>{formatElapsed(run.elapsedMs)}</div>
            {eta != null && active && <div>~{formatElapsed(eta)} left</div>}
          </div>
        </div>

        <div
          style={{
            height: 6,
            borderRadius: radius.full,
            background: tokens.bgSubtle,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${run.progress}%` }}
            transition={{ duration: 0.4 }}
            style={{
              height: "100%",
              borderRadius: radius.full,
              background: done
                ? tokens.success
                : failed
                  ? tokens.error
                  : `linear-gradient(90deg, ${tokens.primary}, #6366f1)`,
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: tokens.textMuted, marginBottom: compact ? 0 : 12 }}>
          <span>{Math.round(run.progress)}%</span>
          <span>{run.status}</span>
        </div>

        {!compact && run.activities.length > 0 && (
          <div
            style={{
              maxHeight: 140,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: spacing.sm,
              borderRadius: radius.md,
              background: tokens.bgSubtle,
              border: `1px solid ${tokens.border}`,
            }}
          >
            {run.activities.slice(-8).map((a, i) => {
              const Icon = activityIcon(a.type);
              return (
                <div key={`${a.at}-${i}`} style={{ display: "flex", gap: 8, fontSize: 11, lineHeight: 1.4 }}>
                  <Icon size={12} style={{ flexShrink: 0, marginTop: 2, opacity: 0.7 }} />
                  <span style={{ color: tokens.textSecondary }}>{a.text}</span>
                </div>
              );
            })}
          </div>
        )}

        {!compact && run.result && (done || failed) && (
          <div
            style={{
              marginTop: 12,
              padding: spacing.md,
              borderRadius: radius.md,
              background: tokens.bgSubtle,
              border: `1px solid ${tokens.border}`,
              fontSize: 12,
              lineHeight: 1.6,
              color: tokens.text,
              maxHeight: 200,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {run.result}
          </div>
        )}
      </div>
    </motion.div>
  );
};
