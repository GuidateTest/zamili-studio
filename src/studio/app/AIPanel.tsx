import { motion } from "framer-motion";
import { Send, Sparkles, Link2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AgentRunPanel } from "../components/AgentRunPanel";
import { Button } from "../design-system/components/Button";
import { useTheme } from "../design-system/ThemeProvider";
import { radius, spacing } from "../design-system/tokens";
import { useAgentRun } from "../hooks/useAgentRun";
import { useStudio } from "../hooks/useStudioStore";

const SUGGESTIONS = [
  "bridge test",
  "Make it more energetic",
  "Use Dubai footage",
  "Add more animations",
  "Make captions bigger",
  "Use Arabic",
];

export const AIPanel: React.FC = () => {
  const { tokens } = useTheme();
  const {
    aiMessages,
    sendAIMessage,
    cursorBridgeStatus,
    cursorBridgeMessage,
    activeRunId,
    onAgentRunComplete,
  } = useStudio();
  const { run } = useAgentRun(activeRunId);
  const completedRef = useRef<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!run || !activeRunId) return;
    if (run.status !== "finished" && run.status !== "error") return;
    if (completedRef.current === activeRunId) return;
    completedRef.current = activeRunId;
    if (run.result) onAgentRunComplete(run.result);
  }, [run, activeRunId, onAgentRunComplete]);

  const submit = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    await sendAIMessage(text);
  };

  return (
    <aside
      style={{
        width: 340,
        minWidth: 340,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${tokens.border}`,
        background: tokens.bgElevated,
      }}
    >
      <div
        style={{
          padding: spacing.lg,
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color={tokens.primary} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>AI Assistant</span>
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: radius.full,
              background:
                cursorBridgeStatus === "sent"
                  ? tokens.successSoft
                  : cursorBridgeStatus === "error"
                    ? tokens.errorSoft
                    : cursorBridgeStatus === "warning"
                      ? tokens.warningSoft
                      : tokens.primarySoft,
              color:
                cursorBridgeStatus === "sent"
                  ? tokens.success
                  : cursorBridgeStatus === "error"
                    ? tokens.error
                    : cursorBridgeStatus === "warning"
                      ? tokens.warning
                      : tokens.primary,
            }}
          >
            <Link2 size={10} />
            Cursor
          </span>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
          Prompts run a live Cursor Agent — progress, ETA, and results appear below.
          {cursorBridgeMessage ? ` ${cursorBridgeMessage}` : ""}
        </p>
      </div>

      {activeRunId && (
        <div style={{ padding: spacing.md, borderBottom: `1px solid ${tokens.border}` }}>
          <AgentRunPanel runId={activeRunId} compact />
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: spacing.md, display: "flex", flexDirection: "column", gap: 12 }}>
        {aiMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "90%",
              padding: "12px 14px",
              borderRadius: radius.lg,
              background:
                msg.role === "user" ? tokens.primary : tokens.bgSubtle,
              color: msg.role === "user" ? "#fff" : tokens.text,
              fontSize: 13,
              lineHeight: 1.5,
              border:
                msg.role === "assistant"
                  ? `1px solid ${tokens.border}`
                  : "none",
            }}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      <div style={{ padding: spacing.md, borderTop: `1px solid ${tokens.border}` }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendAIMessage(s)}
              style={{
                padding: "6px 10px",
                borderRadius: radius.full,
                border: `1px solid ${tokens.border}`,
                background: tokens.bgSubtle,
                color: tokens.textSecondary,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Tell AI what to change…"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: radius.md,
              border: `1px solid ${tokens.border}`,
              background: tokens.bgSubtle,
              color: tokens.text,
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <Button icon={<Send size={16} />} onClick={submit} size="md">
            Send
          </Button>
        </div>
      </div>
    </aside>
  );
};
