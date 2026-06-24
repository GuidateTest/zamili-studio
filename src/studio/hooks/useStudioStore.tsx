import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { sendPromptToCursor } from "../lib/cursor-bridge";
import { studioApi } from "../lib/studio-api";

export type StudioView =
  | "dashboard"
  | "projects"
  | "reel-generator"
  | "carousel-generator"
  | "image-generator"
  | "voiceovers"
  | "brand-assets"
  | "media-library"
  | "templates"
  | "exports"
  | "settings"
  | "editor";

export type ContentType =
  | "reel"
  | "carousel"
  | "advertisement"
  | "product-showcase"
  | "educational"
  | "real-estate"
  | "social";

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

export type ProjectSettings = {
  prompt: string;
  language: "en" | "ar";
  energy: "calm" | "balanced" | "energetic";
  location: string;
  captionSize: "sm" | "md" | "lg";
  animations: "minimal" | "balanced" | "premium";
  music: boolean;
};

type StudioState = {
  booted: boolean;
  onboardingComplete: boolean;
  currentView: StudioView;
  contentType: ContentType | null;
  project: ProjectSettings;
  aiMessages: AIMessage[];
  isGenerating: boolean;
  generationStep: string;
  cursorBridgeStatus: "idle" | "sending" | "queued" | "sent" | "warning" | "error";
  cursorBridgeMessage: string;
  activeProjectId: string | null;
  activeRunId: string | null;
};

type StudioContextValue = StudioState & {
  setView: (view: StudioView) => void;
  completeOnboarding: (type: ContentType) => void;
  setPrompt: (prompt: string) => void;
  updateProject: (patch: Partial<ProjectSettings>) => void;
  setActiveProject: (id: string | null) => void;
  sendAIMessage: (text: string) => Promise<void>;
  generateProject: () => Promise<void>;
  setBooted: (v: boolean) => void;
  onAgentRunComplete: (result: string) => void;
  clearActiveRun: () => void;
};

const defaultProject: ProjectSettings = {
  prompt: "",
  language: "en",
  energy: "balanced",
  location: "",
  captionSize: "md",
  animations: "premium",
  music: true,
};

const StudioContext = createContext<StudioContextValue | null>(null);

const aiResponses: Record<string, Partial<ProjectSettings>> = {
  energetic: { energy: "energetic", animations: "premium" },
  dubai: { location: "Dubai" },
  arabic: { language: "ar" },
  captions: { captionSize: "lg" },
  animation: { animations: "premium" },
};

const titleFromPrompt = (prompt: string) =>
  (prompt.trim().split(/\r?\n/).find(Boolean) ?? "Untitled Reel").slice(0, 64);

const compositionFromPrompt = () => "AIProjectReel";

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [booted, setBooted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(
    () => localStorage.getItem("zamili-onboarding") === "done",
  );
  const [currentView, setView] = useState<StudioView>("dashboard");
  const [contentType, setContentType] = useState<ContentType | null>(
    () => (localStorage.getItem("zamili-content-type") as ContentType) ?? null,
  );
  const [project, setProject] = useState<ProjectSettings>({
    ...defaultProject,
    prompt:
      "Create a Reel explaining how AI automation helps business owners save time.",
  });
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Connected to Cursor. Type a change — it auto-sends to your Cursor Agent in this workspace.",
      timestamp: Date.now(),
    },
  ]);
  const [isGenerating] = useState(false);
  const [generationStep] = useState("");
  const [cursorBridgeStatus, setCursorBridgeStatus] = useState<
    "idle" | "sending" | "queued" | "sent" | "warning" | "error"
  >("idle");
  const [cursorBridgeMessage, setCursorBridgeMessage] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);

  const updateProject = useCallback((patch: Partial<ProjectSettings>) => {
    setProject((p) => ({ ...p, ...patch }));
  }, []);

  const completeOnboarding = useCallback((type: ContentType) => {
    setContentType(type);
    setOnboardingComplete(true);
    localStorage.setItem("zamili-onboarding", "done");
    localStorage.setItem("zamili-content-type", type);
    setView(type === "reel" || type === "real-estate" ? "reel-generator" : "editor");
  }, []);

  const sendAIMessage = useCallback(
    async (text: string) => {
      const userMsg: AIMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text,
        timestamp: Date.now(),
      };
      setAiMessages((m) => [...m, userMsg]);

      const lower = text.toLowerCase();
      let patch: Partial<ProjectSettings> = {};
      let reply = "Sent to Cursor — applying your changes in this workspace.";

      if (lower.includes("bridge test")) {
        reply =
          "Bridge test sent to Cursor — if the agent responds here, the Studio ↔ Cursor link is working.";
      } else if (lower.includes("energetic")) {
        patch = aiResponses.energetic;
        reply = "Sent to Cursor — making pacing more energetic with premium animations.";
      } else if (lower.includes("dubai")) {
        patch = aiResponses.dubai;
        reply = "Sent to Cursor — prioritizing Dubai stock footage and skyline visuals.";
      } else if (lower.includes("arabic")) {
        patch = aiResponses.arabic;
        reply = "Sent to Cursor — switching script, voiceover, and captions to Arabic.";
      } else if (lower.includes("caption")) {
        patch = aiResponses.captions;
        reply = "Sent to Cursor — enlarging captions for mobile readability.";
      } else if (lower.includes("animation")) {
        patch = aiResponses.animation;
        reply = "Sent to Cursor — adding premium spring motion and kinetic typography.";
      }

      if (Object.keys(patch).length) updateProject(patch);

      void studioApi.recordAi(text, activeProjectId ?? undefined).catch(() => {});

      setCursorBridgeStatus("sending");
      const bridge = await sendPromptToCursor(text, { ...project, ...patch }, activeProjectId);
      if (bridge.ok) {
        if (bridge.runId) setActiveRunId(bridge.runId);
        setCursorBridgeStatus(bridge.cursorAuto ? "sent" : "queued");
        setCursorBridgeMessage(
          bridge.runId
            ? "Agent running — watch progress below"
            : bridge.warning ??
              (bridge.cursorAuto
                ? "Cursor agent started"
                : "Queued in .cursor/studio-inbox"),
        );
        if (bridge.runId) {
          reply = "Agent is working on your request — live progress is shown in the editor.";
        } else if (bridge.warning) {
          reply = `Queued for Cursor. ${bridge.warning}`;
        } else if (!bridge.cursorAuto) {
          reply += " (queued — Cursor Agent will pick it up here automatically)";
        }
      } else {
        setCursorBridgeStatus("error");
        setCursorBridgeMessage(bridge.error ?? "Bridge failed");
        reply = `Could not reach Cursor bridge: ${bridge.error ?? "unknown error"}. Is \`npm run dev\` running?`;
      }

      setAiMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: reply,
          timestamp: Date.now(),
        },
      ]);
    },
    [project, updateProject, activeProjectId],
  );

  const generateProject = useCallback(async () => {
    if (!project.prompt.trim()) return;

    let projectId = activeProjectId;
    const settings = { ...project };

    try {
      if (projectId) {
        await studioApi.updateProject(projectId, {
          title: titleFromPrompt(project.prompt),
          prompt: project.prompt,
          settings,
          status: "generating",
          compositionId: compositionFromPrompt(),
        });
      } else {
        const { project: created } = await studioApi.createProject({
          title: titleFromPrompt(project.prompt),
          type: contentType ?? "reel",
          prompt: project.prompt,
          settings,
          compositionId: compositionFromPrompt(),
        });
        projectId = created.id;
        setActiveProjectId(created.id);
      }
    } catch {
      // The agent can still run without persistence, but Projects will not update.
    }

    const userMsg: AIMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: project.prompt,
      timestamp: Date.now(),
    };
    setAiMessages((m) => [...m, userMsg]);

    setCursorBridgeStatus("sending");
    const bridge = await sendPromptToCursor(project.prompt, settings, projectId);
    if (bridge.ok) {
      if (bridge.runId) setActiveRunId(bridge.runId);
      setCursorBridgeStatus(bridge.cursorAuto ? "sent" : "queued");
      setCursorBridgeMessage(
        bridge.runId ? "Agent running — watch progress below" : "Queued in .cursor/studio-inbox",
      );
      setAiMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Project saved. Agent is working on this reel and the live preview will update here.",
          timestamp: Date.now(),
        },
      ]);
    } else {
      setCursorBridgeStatus("error");
      setCursorBridgeMessage(bridge.error ?? "Bridge failed");
    }
  }, [project, activeProjectId, contentType]);

  const onAgentRunComplete = useCallback((result: string) => {
    setCursorBridgeStatus("sent");
    setCursorBridgeMessage("Agent finished — preview updated");
    if (activeProjectId) {
      void studioApi
        .updateProject(activeProjectId, {
          title: titleFromPrompt(project.prompt),
          prompt: project.prompt,
          settings: project,
          status: "ready",
          compositionId: compositionFromPrompt(),
        })
        .catch(() => {});
    }
    setAiMessages((m) => [
      ...m,
      {
        id: `a-result-${Date.now()}`,
        role: "assistant",
        text: result.slice(0, 2000),
        timestamp: Date.now(),
      },
    ]);
  }, [activeProjectId, project]);

  const clearActiveRun = useCallback(() => setActiveRunId(null), []);

  const value = useMemo(
    () => ({
      booted,
      onboardingComplete,
      currentView,
      contentType,
      project,
      aiMessages,
      isGenerating,
      generationStep,
      cursorBridgeStatus,
      cursorBridgeMessage,
      activeProjectId,
      activeRunId,
      setView,
      completeOnboarding,
      setPrompt: (prompt: string) => updateProject({ prompt }),
      updateProject,
      setActiveProject: setActiveProjectId,
      sendAIMessage,
      generateProject,
      setBooted,
      onAgentRunComplete,
      clearActiveRun,
    }),
    [
      booted,
      onboardingComplete,
      currentView,
      contentType,
      project,
      aiMessages,
      isGenerating,
      generationStep,
      cursorBridgeStatus,
      cursorBridgeMessage,
      activeProjectId,
      activeRunId,
      completeOnboarding,
      updateProject,
      sendAIMessage,
      generateProject,
      onAgentRunComplete,
      clearActiveRun,
    ],
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
};

export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
};
