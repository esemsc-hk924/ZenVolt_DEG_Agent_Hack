"use client";

import { useEffect, useMemo, useState, useRef, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDebate, Row, Decision } from "@/components/council/use-debate";
import { useComputeDebate } from "@/components/council/use-compute-debate";
import { VoicePoweredOrb } from "@/components/council/VoicePoweredOrb";
import Verdict from "@/components/council/verdict";
import { toast } from "sonner";
import { useSpeaker } from "@/components/council/use-speaker";
import Image from "next/image";
import { pdf } from "@react-pdf/renderer";
import { CouncilReportPDF } from "@/components/council/CouncilReportPDF";
import dayjs from "dayjs";

// Enhanced history session type
type HistorySession = {
  id: string;
  prompt: string;
  timestamp: number;
  messages: Row[];
  decision: Decision | null;
  status: "idle" | "debating" | "paused" | "complete";
  currentRound: number; // 0-5
  roundProgress: number; // 0-3 (which agent in current round)
  lastUpdated: number;
};
import {
  Menu,
  X,
  Pause,
  BookOpenCheck,
  Download,
  Volume2,
  VolumeX,
  Wand2,
  Send,
  MessageSquare,
  RotateCcw,
  Play,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";

type Stage = "prompt" | "analyzing" | "discussion" | "report";

// Department mapping
const DEPARTMENT_MAP: Record<string, "finance" | "operations" | "compliance" | "data"> = {
  fin: "finance",
  ops: "operations",
  comp: "compliance",
  it: "data",
};

const DEPARTMENT_HUES: Record<string, number> = {
  finance: 150,
  operations: 200,
  compliance: 40,
  data: 180,
};

const DEPARTMENT_LABELS: Record<string, string> = {
  finance: "Finance",
  operations: "Operations",
  compliance: "Compliance",
  data: "Data",
};

function cleanForTTS(text: string) {
  return text
    .replace(/for prompt.*?brief:\s*/i, "")
    .replace(/\b\(turn \d+\):\s*/i, "")
    .replace(/\s+Key points:$/i, "")
    .trim();
}

function formatTime(ts?: number) {
  if (!ts) return "--:--";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function CouncilPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isComputeMode = searchParams.get("mode") === "compute";

  // Always call both hooks (React rules), but use the appropriate one
  const baseDebate = useDebate();
  const computeDebate = useComputeDebate();
  const debate = isComputeMode ? computeDebate : baseDebate;
  const [stage, setStage] = useState<Stage>("prompt");
  const [showTranscript, setShowTranscript] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [analyzingStartedAt, setAnalyzingStartedAt] = useState<number | null>(null);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { ready, unlock, speak, stop: stopSpeaker } = useSpeaker();

  // Group members by department
  const departmentGroups = useMemo(() => {
    if (isComputeMode) {
      // For compute mode, group by agent type
      const groups: Record<string, any[]> = {
        compute: [],
        grid: [],
        storage: [],
        finance: [],
      };
      debate.members.forEach((m) => {
        const agentId = (m as any).id;
        if (agentId && groups[agentId]) {
          groups[agentId].push(m);
        }
      });
      return groups as Record<string, typeof debate.members[number][]>;
    }

    // Original department grouping
    const groups: Record<string, typeof debate.members[number][]> = {
      finance: [],
      operations: [],
      compliance: [],
      data: [],
    };

    debate.members.forEach((m) => {
      const dept = DEPARTMENT_MAP[(m as any).id];
      if (dept && groups[dept]) {
        groups[dept].push(m);
      }
    });

    return groups;
  }, [debate.members, isComputeMode]);

  // Get active department from speaking member
  const activeDepartment = useMemo(() => {
    if (!debate.speakingId) return null;
    if (isComputeMode) {
      return debate.speakingId; // For compute mode, use agent ID directly
    }
    return DEPARTMENT_MAP[debate.speakingId] || null;
  }, [debate.speakingId, isComputeMode]);

  // Track previous ready state and message count to detect when voice is enabled
  const prevReadyRef = useRef(false);
  const prevMessageCountRef = useRef(0);

  // Replay existing messages when voice is enabled
  useEffect(() => {
    // When voice becomes ready for the first time, replay all existing non-user messages
    if (ready && !prevReadyRef.current && debate.messages.length > 0) {
      debate.messages.forEach((msg) => {
        // Skip user messages
        if (msg.agentId !== "user" && msg.content) {
          const member = debate.members.find((m) => m.id === msg.agentId);
          if (member) {
            const text = cleanForTTS(msg.content);
            if (text) {
              // Queue messages - they'll play sequentially
              speak(text, member.voice);
            }
          }
        }
      });
    }
    prevReadyRef.current = ready;
  }, [ready, debate.messages, debate.members, speak]);

  // Voice-over for latest assistant turn (new messages only)
  useEffect(() => {
    if (!ready) {
      prevMessageCountRef.current = debate.messages.length;
      return;
    }

    // If no messages, update counter and exit
    if (!debate.messages.length) {
      prevMessageCountRef.current = 0;
      return;
    }

    // Only speak if this is a NEW message (message count increased)
    const isNewMessage = debate.messages.length > prevMessageCountRef.current;
    const isStartingFresh = prevMessageCountRef.current === 0 && debate.messages.length === 1;
    const last = debate.messages[debate.messages.length - 1];

    // Skip if it's a user message
    if (last.agentId === "user") {
      prevMessageCountRef.current = debate.messages.length;
      return;
    }

    // Skip if not a new message (unless starting fresh when voice is already ready)
    if (!isNewMessage && !isStartingFresh) {
      prevMessageCountRef.current = debate.messages.length;
      return;
    }

    // If starting fresh (0 → 1) and voice is already ready, speak the first message
    // (This handles the case where voice was enabled before debate started)
    if (isStartingFresh && ready && prevReadyRef.current) {
      const member = debate.members.find((m) => m.id === last.agentId);
      if (member) {
        const text = cleanForTTS(last.content || "");
        if (text) {
          speak(text, member.voice);
          prevMessageCountRef.current = debate.messages.length;
          return;
        }
      }
    }

    // Skip if we just enabled voice (already replaying existing messages in the other useEffect)
    if (ready && !prevReadyRef.current) {
      prevMessageCountRef.current = debate.messages.length;
      return;
    }

    // Speak new messages that arrive after voice is ready
    if (isNewMessage) {
      const member = debate.members.find((m) => m.id === last.agentId);
      if (!member) {
        prevMessageCountRef.current = debate.messages.length;
        return;
      }

      const text = cleanForTTS(last.content || "");
      if (text) speak(text, member.voice);
    }

    prevMessageCountRef.current = debate.messages.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debate.messages.length, ready]);

  // Stage transitions
  useEffect(() => {
    if (debate.status === "idle" && debate.messages.length === 0) {
      setStage("prompt");
      setShowTranscript(false);
    }
    // Stay in discussion stage if paused
    if (debate.status === "paused" && stage !== "discussion") {
      setStage("discussion");
    }
  }, [debate.status, debate.messages.length, stage]);

  useEffect(() => {
    if (stage !== "analyzing") return;
    if (debate.messages.length === 0) return;

    const minMs = 2500;
    const elapsed = analyzingStartedAt ? Date.now() - analyzingStartedAt : minMs;

    if (elapsed >= minMs) {
      setStage("discussion");
      return;
    }

    const t = setTimeout(() => {
      setStage("discussion");
    }, Math.max(0, minMs - elapsed));

    return () => clearTimeout(t);
  }, [stage, debate.messages.length, analyzingStartedAt]);

  useEffect(() => {
    if (debate.status === "complete" && debate.decision) {
      setStage("report");
    }
  }, [debate.status, debate.decision]);

  useEffect(() => () => stopSpeaker(), [stopSpeaker]);

  // Clear all history
  const handleClearHistory = useCallback(() => {
    if (history.length === 0) {
      toast.info("History is already empty");
      return;
    }

    if (!confirm("Are you sure you want to clear all council history? This cannot be undone.")) {
      return;
    }

    localStorage.removeItem("council_history");
    setHistory([]);
    setCurrentSessionId(null);
    toast.success("History cleared");
  }, [history.length]);

  // Helper function to calculate round progress from messages
  const calculateRoundProgress = useCallback((messages: Row[]): { round: number; progress: number } => {
    const ROUNDS = 6;
    const AGENTS_PER_ROUND = 4;

    // Ensure messages is an array
    if (!Array.isArray(messages)) {
      return { round: 0, progress: 0 };
    }

    const completedMessages = messages.filter(m => m && m.content && typeof m.content === "string" && m.content.trim().length > 0);
    const totalCompleted = completedMessages.length;

    const round = Math.floor(totalCompleted / AGENTS_PER_ROUND);
    const progress = totalCompleted % AGENTS_PER_ROUND;

    return {
      round: Math.min(Math.max(round, 0), ROUNDS - 1),
      progress: Math.min(Math.max(progress, 0), AGENTS_PER_ROUND - 1)
    };
  }, []);

  // Helper function to generate session ID
  const generateSessionId = useCallback(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }, []);

  // Save session to history with 10-item limit
  const saveSessionToHistory = useCallback((session: Partial<HistorySession>, updateExisting = false) => {
    setHistory((prev) => {
      const now = Date.now();
      const sessionId = session.id || currentSessionId || generateSessionId();

      // Ensure messages is always an array
      const messagesToSave = session.messages !== undefined
        ? (Array.isArray(session.messages) ? session.messages : [])
        : (Array.isArray(debate.messages) ? debate.messages : []);

      const roundProgress = calculateRoundProgress(messagesToSave);

      const newSession: HistorySession = {
        id: sessionId,
        prompt: session.prompt || debate.prompt,
        timestamp: session.timestamp || now,
        messages: messagesToSave,
        decision: session.decision ?? debate.decision ?? null,
        status: session.status || debate.status,
        currentRound: session.currentRound ?? roundProgress.round,
        roundProgress: session.roundProgress ?? roundProgress.progress,
        lastUpdated: now,
      };

      let updated: HistorySession[];

      if (updateExisting && currentSessionId) {
        // Update existing session
        updated = prev.map((h) => (h.id === currentSessionId ? { ...h, ...newSession, id: h.id } : h));
      } else {
        // Create new session or update by matching recent prompt
        const existingIndex = prev.findIndex(
          (h) => h.prompt === newSession.prompt && Math.abs(h.timestamp - now) < 60000
        );

        if (existingIndex >= 0) {
          // Update existing
          updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newSession, id: updated[existingIndex].id };
        } else {
          // Add new at the beginning
          updated = [newSession, ...prev].slice(0, 10); // Limit to 10
        }
      }

      // Persist to localStorage
      try {
        localStorage.setItem("council_history", JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to save history to localStorage:", error);
      }

      return updated;
    });

    if (!currentSessionId) {
      setCurrentSessionId(session.id || generateSessionId());
    }
  }, [debate.prompt, debate.messages, debate.decision, debate.status, currentSessionId, calculateRoundProgress, generateSessionId]);

  // Debounced auto-save after messages update
  useEffect(() => {
    if (debate.status === "idle" || debate.messages.length === 0) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveSessionToHistory({}, true);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [debate.messages, debate.status, saveSessionToHistory]);

  // Auto-save when debate starts
  useEffect(() => {
    if (debate.status === "debating" && debate.messages.length === 0) {
      saveSessionToHistory({ status: "debating" }, false);
    }
  }, [debate.status, saveSessionToHistory]);

  // Auto-save when debate completes
  useEffect(() => {
    if (debate.status === "complete" && debate.messages.length > 0) {
      saveSessionToHistory({ status: "complete" }, true);
    }
  }, [debate.status, saveSessionToHistory]);

  // Auto-save when decision is synthesized
  useEffect(() => {
    if (debate.decision) {
      saveSessionToHistory({ decision: debate.decision }, true);
    }
  }, [debate.decision, saveSessionToHistory]);

  // Handle decision query parameter - load specific decision from history
  useEffect(() => {
    const decisionId = searchParams.get("decision");
    if (!decisionId || history.length === 0) return;

    const session = history.find((h) => h.id === decisionId);
    if (session && session.decision) {
      // Load the session for viewing
      const validMessages = Array.isArray(session.messages) ? session.messages : [];
      const validRound = typeof session.currentRound === "number" ? session.currentRound : 0;
      const validProgress = typeof session.roundProgress === "number" ? session.roundProgress : 0;

      debate.setPrompt(session.prompt || "");
      debate.restoreSession(validMessages, validRound, validProgress);
      debate.setDecision(session.decision);
      debate.setStatus(session.status || "complete");
      setCurrentSessionId(session.id);
      setStage("report");

      // Remove query parameter from URL
      router.replace("/council", { scroll: false });
      toast.message("Decision loaded from history");
    }
  }, [searchParams, history, debate, router]);

  // Load history from localStorage on mount (with migration)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("council_history");
      if (!raw) return;

      const parsed = JSON.parse(raw);

      // Migrate old format to new format
      const migrated = parsed.map((item: any) => {
        if (item.messages !== undefined) {
          // Already new format - ensure all required fields exist
          return {
            id: item.id || generateSessionId(),
            prompt: item.prompt || "",
            timestamp: item.timestamp || Date.now(),
            messages: item.messages || [],
            decision: item.decision || null,
            status: item.status || "complete",
            currentRound: item.currentRound ?? (item.messages ? calculateRoundProgress(item.messages).round : 0),
            roundProgress: item.roundProgress ?? (item.messages ? calculateRoundProgress(item.messages).progress : 0),
            lastUpdated: item.lastUpdated || item.timestamp || Date.now(),
          };
        }
        // Old format - convert
        const { id, prompt, timestamp } = item;
        return {
          id: id || generateSessionId(),
          prompt,
          timestamp,
          messages: [],
          decision: null,
          status: "complete" as const,
          currentRound: 0,
          roundProgress: 0,
          lastUpdated: timestamp,
        };
      });

      setHistory(migrated.slice(0, 10)); // Ensure limit
    } catch (error) {
      console.warn("Failed to load history:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleStart = (resumeFrom?: HistorySession) => {
    if (!debate.prompt.trim() && !resumeFrom) {
      toast.error("Tell the council what to tackle");
      return;
    }

    setStage("analyzing");
    setAnalyzingStartedAt(Date.now());

    if (resumeFrom) {
      // Validate and restore session state
      const validMessages = Array.isArray(resumeFrom.messages) ? resumeFrom.messages : [];
      const validRound = typeof resumeFrom.currentRound === "number" ? resumeFrom.currentRound : 0;
      const validProgress = typeof resumeFrom.roundProgress === "number" ? resumeFrom.roundProgress : 0;

      debate.setPrompt(resumeFrom.prompt || debate.prompt);
      debate.restoreSession(validMessages, validRound, validProgress);
      setCurrentSessionId(resumeFrom.id);

      debate.start({
        messages: validMessages,
        currentRound: validRound,
        roundProgress: validProgress,
      });
    } else {
      debate.start(undefined);
    }

    toast.message(resumeFrom ? "Session resumed" : "Council convening");
  };

  const handlePause = () => {
    stopSpeaker();
    debate.stop();
    toast.info("Debate paused");
  };

  const handleResume = (userMessageToInclude?: ReturnType<typeof debate.addUserMessage>) => {
    debate.resume();
    // Continue from where we paused
    let currentMessages = debate.messages;

    // If a user message is provided, include it in the messages array
    // This fixes the async state timing bug where addUserMessage() hasn't updated state yet
    if (userMessageToInclude) {
      currentMessages = [...currentMessages, userMessageToInclude];
    }

    const progress = calculateRoundProgress(currentMessages);

    debate.start({
      messages: currentMessages,
      currentRound: progress.round,
      roundProgress: progress.progress,
    });
    toast.info("Debate resumed");
  };

  const handleSendUserMessage = () => {
    if (!debate.prompt.trim()) {
      toast.error("Enter a message");
      return;
    }

    // Store the message content before clearing
    const messageContent = debate.prompt.trim();

    // Clear prompt for next message
    debate.setPrompt("");

    // Add user message to transcript (for UI state)
    const userMessage = debate.addUserMessage(messageContent);

    // If paused, resume to process the user message
    // Pass the user message directly to avoid async state timing issues
    if (debate.status === "paused") {
      handleResume(userMessage);
    } else {
      // If not paused, the debate will continue naturally
      toast.message("Message sent");
    }
  };

  const handleReset = () => {
    stopSpeaker();
    debate.reset();
    setStage("prompt");
    setShowTranscript(false);
    setAnalyzingStartedAt(null);
    setCurrentSessionId(null);
    toast.info("Session reset");
  };

  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Watch for decision to clear loading state
  useEffect(() => {
    if (debate.decision) {
      setIsSynthesizing(false);
    }
  }, [debate.decision]);

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    debate.finalize();
    // Session will be auto-saved by the useEffect watching debate.decision
    // Loading state will be cleared when decision is set
  };

  const handleResumeSession = (session: HistorySession) => {
    setShowHistory(false);

    if (debate.messages.length > 0 || debate.status !== "idle") {
      if (!confirm("You have an active session. Resume selected session anyway?")) {
        return;
      }
    }

    handleStart(session);
  };

  const handleViewSession = (session: HistorySession) => {
    setShowHistory(false);

    if (debate.messages.length > 0 || debate.status !== "idle") {
      if (!confirm("You have an active session. Load selected session anyway?")) {
        return;
      }
    }

    // Validate and restore full session state for viewing
    const validMessages = Array.isArray(session.messages) ? session.messages : [];
    const validRound = typeof session.currentRound === "number" ? session.currentRound : 0;
    const validProgress = typeof session.roundProgress === "number" ? session.roundProgress : 0;

    debate.setPrompt(session.prompt || "");
    debate.restoreSession(validMessages, validRound, validProgress);
    if (session.decision) {
      debate.setDecision(session.decision);
    }
    debate.setStatus(session.status || "complete");
    setCurrentSessionId(session.id);

    // Navigate to appropriate stage
    if (session.decision) {
      setStage("report");
    } else if (validMessages.length > 0) {
      setStage("discussion");
    } else {
      setStage("prompt");
    }

    toast.message("Session loaded");
  };

  const handleDownload = async () => {
    if (!debate.decision) {
      toast.error("No decision available to download");
      return;
    }

    try {
      // Get current session timestamp for the report
      const currentSession = history.find((h) => h.id === currentSessionId);
      const timestamp = currentSession?.timestamp || Date.now();

      // Generate PDF blob
      const instance = pdf(
        <CouncilReportPDF
          decision={debate.decision}
          prompt={debate.prompt || ""}
          messages={debate.messages || []}
          timestamp={timestamp}
        />
      );
      const blob = await instance.toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safePrompt = (debate.prompt || "council-report").slice(0, 30).replace(/[^a-z0-9]/gi, "_");
      a.download = `AI_Council_Report_${safePrompt}_${dayjs().format("YYYY-MM-DD")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const renderStage = () => {
    switch (stage) {
      case "prompt":
        return (
          <PromptStage
            prompt={debate.prompt}
            onPromptChange={debate.setPrompt}
            onSubmit={handleStart}
            onUnlockAudio={unlock}
            voiceReady={ready}
            onShowHistory={() => setShowHistory(true)}
            isComputeMode={isComputeMode}
          />
        );
      case "analyzing":
        return <AnalyzingStage prompt={debate.prompt} />;
      case "discussion":
        return (
          <DiscussionStage
            departmentGroups={departmentGroups}
            activeDepartment={activeDepartment}
            speakingId={debate.speakingId}
            onPause={handlePause}
            onResume={handleResume}
            onShowTranscript={() => setShowTranscript((v) => !v)}
            transcriptOpen={showTranscript}
            status={debate.status}
            onUnlockAudio={unlock}
            voiceReady={ready}
            prompt={debate.prompt}
            setPrompt={debate.setPrompt}
            onReset={handleReset}
            onSynthesize={handleSynthesize}
            onSendUserMessage={handleSendUserMessage}
            isSynthesizing={isSynthesizing}
          />
        );
      case "report":
        return (
          <ReportStage
            decision={debate.decision}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] rounded-3xl border bg-background/80 p-6">
      <div className="h-full w-full overflow-hidden rounded-2xl bg-background/70 shadow-xl">
        <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
      </div>

      {/* 4 Orbs for discussion stage - bigger with floating animation */}
      <AnimatePresence>
        {stage === "discussion" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-12">
            {Object.entries(departmentGroups).map(([dept, members], index) => {
              if (members.length === 0) return null;
              const isActive = activeDepartment === dept;
              return (
                <motion.div
                  key={dept}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -15, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    },
                    scale: {
                      duration: 0.4,
                    },
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <VoicePoweredOrb
                    className="h-80 w-80"
                    enableVoiceControl={false}
                    activityLevel={isActive ? 0.9 : 0.1}
                    active={isActive}
                    hue={DEPARTMENT_HUES[dept] || 200}
                    maxRotationSpeed={0.3}
                    maxHoverIntensity={0.4}
                  />
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground mt-2">
                    {DEPARTMENT_LABELS[dept]}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "analyzing" && (
          <motion.div
            key="analyzing-orb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <VoicePoweredOrb
              className="h-[280px] w-[280px] opacity-40"
              enableVoiceControl={false}
              activityLevel={0}
              active={false}
              hue={260}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TranscriptDrawer
        open={showTranscript && stage === "discussion"}
        messages={debate.messages}
        members={debate.members as any}
        onClose={() => setShowTranscript(false)}
      />

      <HistorySidebar
        open={showHistory && stage === "prompt"}
        onClose={() => setShowHistory(false)}
        history={history}
        onLoadPrompt={(item) => {
          debate.setPrompt(item.prompt);
          setShowHistory(false);
          toast.message("Loaded prompt from history");
        }}
        onResume={handleResumeSession}
        onView={handleViewSession}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}

type PromptStageProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onUnlockAudio: () => void;
  voiceReady: boolean;
  onShowHistory: () => void;
  isComputeMode?: boolean;
};

function PromptStage({
  prompt,
  onPromptChange,
  onSubmit,
  onUnlockAudio,
  voiceReady,
  onShowHistory,
  isComputeMode = false,
}: PromptStageProps) {

  const examplePrompts = isComputeMode
    ? [
      "Optimize compute workload scheduling to minimize cost per inference under carbon cap",
      "Schedule AI training jobs during low-carbon intensity windows",
      "Coordinate compute loads with grid flexibility markets",
      "Balance cost, carbon, and flexibility rewards for inference workloads",
    ]
    : [
      "How can we reduce energy consumption by 30% within 6 months?",
      "What's the best strategy for achieving net-zero emissions by 2030?",
      "How do we comply with new carbon reporting regulations?",
      "What's the ROI of implementing smart building systems?",
    ];

  const PLACEHOLDERS = isComputeMode
    ? [
      "Optimize compute workload scheduling...",
      "Schedule jobs during low-carbon windows...",
      "Coordinate with grid flexibility markets...",
      "Minimize cost per inference under carbon cap...",
    ]
    : [
      "Describe your constraint, budget, scale, regulation, timeline...",
      "How can we reduce energy consumption by 30% within 6 months?",
      "What's the best strategy for achieving net-zero emissions?",
      "How do we comply with new carbon reporting regulations?",
      "What's the ROI of implementing smart building systems?",
    ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || prompt) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, prompt, PLACEHOLDERS.length]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!prompt) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [prompt]);

  // Reset textarea height when prompt is cleared
  useEffect(() => {
    if (!prompt && textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  }, [prompt]);

  const handleActivate = () => setIsActive(true);

  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
    expanded: {
      height: "auto",
      minHeight: 128,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
  };

  const expandedControlsVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      pointerEvents: "none" as const,
      transition: { duration: 0.25 },
    },
    visible: {
      opacity: 1,
      y: 0,
      pointerEvents: "auto" as const,
      transition: { duration: 0.35, delay: 0.08 },
    },
  };

  return (
    <motion.section
      key="prompt-stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col relative"
    >
      {/* Centered wrapper - Groups logo and input together, centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-4">
          {/* Logo and title - Compact, close to input */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-16 w-16">
              <Image
                src="/zenvolt.png"
                alt="ZenVolt"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-semibold">
              {isComputeMode ? "AI Orchestration" : "AI Council"}
            </h1>
          </div>

          {/* Animated Input - Close to logo (Grok-style) */}
          <div className="w-full" ref={wrapperRef}>
            <motion.div
              className="w-full bg-background border-2 border-border rounded-[32px] overflow-hidden"
              variants={containerVariants}
              animate={isActive || prompt ? "expanded" : "collapsed"}
              initial="collapsed"
              onClick={handleActivate}
            >
              <div className="flex flex-col items-stretch w-full h-full">
                {/* Input Row */}
                <div className="flex items-center gap-2 p-3 w-full">
                  {/* Text Input & Animated Placeholder */}
                  <div className="relative flex-1">
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => {
                        onPromptChange(e.target.value);
                        const target = e.target as HTMLTextAreaElement;
                        // Auto-resize textarea
                        target.style.height = "auto";
                        target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
                      }}
                      onFocus={handleActivate}
                      rows={1}
                      className="flex-1 border-0 outline-0 rounded-md py-2 px-3 text-base bg-transparent w-full resize-none overflow-hidden"
                      style={{
                        minHeight: "24px",
                        maxHeight: "96px",
                        position: "relative",
                        zIndex: 2,
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          if (prompt.trim()) {
                            e.preventDefault();
                            onSubmit();
                          }
                        }
                      }}
                    />
                    <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                      <AnimatePresence mode="wait">
                        {showPlaceholder && !isActive && !prompt && (
                          <motion.span
                            key={placeholderIndex}
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none text-base"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              zIndex: 0,
                              maxWidth: "calc(100% - 120px)",
                            }}
                            variants={placeholderContainerVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            {PLACEHOLDERS[placeholderIndex]
                              .split("")
                              .map((char, i) => (
                                <motion.span
                                  key={i}
                                  variants={letterVariants}
                                  style={{ display: "inline-block" }}
                                >
                                  {char === " " ? "\u00A0" : char}
                                </motion.span>
                              ))}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right side buttons */}
                  <button
                    className="p-3 rounded-full hover:bg-muted transition"
                    title="Enable voice"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlockAudio();
                    }}
                    tabIndex={-1}
                  >
                    {voiceReady ? (
                      <Volume2 size={20} className="text-emerald-600" />
                    ) : (
                      <VolumeX size={20} className="text-muted-foreground" />
                    )}
                  </button>

                  <button
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full font-medium justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Convene council"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (prompt.trim()) onSubmit();
                    }}
                    disabled={!prompt.trim()}
                    tabIndex={-1}
                  >
                    <Send size={18} />
                  </button>
                </div>

                {/* Expanded Controls - Example Prompts */}
                <motion.div
                  className="w-full flex justify-start px-4 pb-3 items-center text-sm"
                  variants={expandedControlsVariants}
                  initial="hidden"
                  animate={isActive || prompt ? "visible" : "hidden"}
                >
                  <div className="flex gap-3 items-center flex-wrap">
                    {examplePrompts.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPromptChange(item);
                          setIsActive(true);
                        }}
                        className="flex items-center gap-1 px-4 py-2 rounded-full transition-all font-medium bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300 text-sm"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Menu button - top left */}
      <div className="absolute left-6 top-6">
        <Button variant="outline" size="sm" onClick={onShowHistory} className="rounded-full">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </motion.section>
  );
}

type AnalyzingStageProps = {
  prompt: string;
};

function AnalyzingStage({ prompt }: AnalyzingStageProps) {
  return (
    <motion.section
      key="analyzing-stage"
      className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm uppercase tracking-wide text-muted-foreground">your council is analysing…</p>
      <div className="max-w-2xl text-lg font-medium text-muted-foreground">{prompt}</div>
    </motion.section>
  );
}

type DiscussionStageProps = {
  departmentGroups: Record<string, any[]>;
  activeDepartment: string | null;
  speakingId: string | null;
  onPause: () => void;
  onResume: () => void;
  onShowTranscript: () => void;
  transcriptOpen: boolean;
  status: ReturnType<typeof useDebate>["status"];
  onUnlockAudio: () => void;
  voiceReady: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  onReset: () => void;
  onSynthesize: () => void;
  onSendUserMessage: () => void;
  isSynthesizing: boolean;
};

function DiscussionStage({
  departmentGroups,
  activeDepartment,
  speakingId,
  onPause,
  onResume,
  onShowTranscript,
  transcriptOpen,
  status,
  onUnlockAudio,
  voiceReady,
  prompt,
  setPrompt,
  onReset,
  onSynthesize,
  onSendUserMessage,
  isSynthesizing,
}: DiscussionStageProps) {
  return (
    <motion.section
      key="discussion-stage"
      className="relative flex h-full flex-col gap-6 px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Council in session</p>
        </div>
        <div className="flex gap-2">
          <button
            className="p-3 rounded-full hover:bg-muted transition"
            title={voiceReady ? "Voice ready" : "Enable voice"}
            type="button"
            onClick={onUnlockAudio}
          >
            {voiceReady ? (
              <Volume2 size={20} className="text-emerald-600" />
            ) : (
              <VolumeX size={20} className="text-muted-foreground" />
            )}
          </button>
          <Button variant="ghost" size="sm" onClick={onShowTranscript}>
            <BookOpenCheck className="mr-2 h-4 w-4" /> transcript
          </Button>
          <Button variant="destructive" size="sm" onClick={onReset} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>


      <div className="mt-auto flex flex-col gap-3 rounded-2xl border px-4 py-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span>{status === "paused" ? "Discussion paused" : status === "debating" ? "Council in discussion" : "Brief in progress"}</span>
          {status === "debating" && (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Debating
            </span>
          )}
          {status === "paused" && (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Paused
            </span>
          )}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none resize-none"
          placeholder={status === "paused" ? "Ask a question or add a comment..." : "Adjust your brief or ask questions..."}
          disabled={status === "debating"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
              e.preventDefault();
              if (status === "paused") {
                onSendUserMessage();
              }
            }
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          {status === "paused" ? (
            <>
              <Button variant="outline" onClick={onResume} className="rounded-full">
                <Play className="h-4 w-4 mr-2" /> Resume
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={onSendUserMessage}
                  disabled={!prompt.trim()}
                  className="rounded-full"
                >
                  <Send className="h-4 w-4 mr-2" /> Send Message
                </Button>
                <Button
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={onSynthesize}
                  disabled={isSynthesizing}
                >
                  {isSynthesizing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Synthesize decision"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onPause} className="rounded-full" disabled={status !== "debating"}>
                <Pause className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                onClick={onSynthesize}
                disabled={status !== "complete" || isSynthesizing}
              >
                {isSynthesizing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Synthesize decision"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}

type ReportStageProps = {
  decision: ReturnType<typeof useDebate>["decision"];
  onDownload: () => void;
  onReset: () => void;
};

function ReportStage({ decision, onDownload, onReset }: ReportStageProps) {
  return (
    <motion.section
      key="report-stage"
      className="flex h-full flex-col gap-6 px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Consensus ready</p>
          <h2 className="text-3xl font-semibold">Download your council report</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Run a new prompt
          </Button>
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" /> Download report
          </Button>
        </div>
      </div>

      {decision ? (
        <div className="flex-1 overflow-y-auto rounded-2xl border bg-background/70 p-6">
          <Verdict data={decision} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed">
          <p className="text-muted-foreground">No final verdict yet. Run the council first.</p>
        </div>
      )}
    </motion.section>
  );
}

type TranscriptDrawerProps = {
  open: boolean;
  messages: ReturnType<typeof useDebate>["messages"];
  members: any[]; // Allow both Member[] and ComputeMember[]
  onClose: () => void;
};

function TranscriptDrawer({ open, messages, members, onClose }: TranscriptDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive (Spotify lyrics sync style)
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, messages[messages.length - 1]?.id]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="transcript"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="absolute right-0 top-0 h-full w-full max-w-md border-l bg-background/95 p-6 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transcript</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <div ref={scrollRef} className="flex h-[calc(100%-56px)] flex-col gap-3 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            )}
            {messages.map((msg) => {
              const member = members.find((m) => m.id === msg.agentId);
              const isUser = msg.agentId === "user";
              return (
                <div
                  key={msg.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${isUser
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-muted/40"
                    }`}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className={isUser ? "font-medium text-emerald-700 dark:text-emerald-300" : ""}>
                      {member?.role || msg.role}
                    </span>
                    <span>{formatTime(msg.ts)}</span>
                  </div>
                  <p className={`mt-1 whitespace-pre-wrap leading-relaxed ${isUser ? "text-emerald-900 dark:text-emerald-100" : ""}`}>
                    {msg.content}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

type HistorySidebarProps = {
  open: boolean;
  onClose: () => void;
  history: HistorySession[];
  onLoadPrompt?: (item: HistorySession) => void;
  onResume?: (item: HistorySession) => void;
  onView?: (item: HistorySession) => void;
  onClearHistory?: () => void;
};

function HistorySidebar({ open, onClose, history, onLoadPrompt, onResume, onView, onClearHistory }: HistorySidebarProps) {
  const getStatusBadge = (session: HistorySession) => {
    if (session.decision) {
      return { label: "Complete", variant: "default" as const, color: "bg-emerald-500" };
    }
    if (session.status === "debating" || session.messages.length > 0) {
      return { label: "In Progress", variant: "secondary" as const, color: "bg-blue-500" };
    }
    return { label: "Complete", variant: "outline" as const, color: "bg-gray-500" };
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="history"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="absolute left-0 top-0 h-full w-full max-w-md border-r bg-background/95 p-6 shadow-2xl z-50"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Council History</h3>
            <div className="flex gap-2">
              {history.length > 0 && onClearHistory && (
                <Button variant="ghost" size="sm" onClick={onClearHistory} title="Clear all history">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex h-[calc(100%-80px)] flex-col gap-3 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No previous sessions yet.</p>
            ) : (
              history.map((item) => {
                const status = getStatusBadge(item);
                const roundInfo = item.messages.length > 0
                  ? `Round ${item.currentRound + 1}/${6}, ${item.messages.length} messages`
                  : "Not started";

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-background/50 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          <span>{formatDate(item.timestamp)}</span>
                          <span className="flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${status.color}`} />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 mb-1">{item.prompt}</p>
                        <p className="text-xs text-muted-foreground">{roundInfo}</p>
                        {item.decision && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ Decision synthesized</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadPrompt?.(item);
                        }}
                      >
                        Load Prompt
                      </Button>
                      {item.messages.length > 0 && (
                        <>
                          {/* Show Resume if debate is incomplete (hasn't finished all rounds) */}
                          {item.currentRound < 5 && (
                            <Button
                              variant="default"
                              size="sm"
                              className="text-xs h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                onResume?.(item);
                              }}
                            >
                              <Play className="h-3 w-3 mr-1" /> Resume
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView?.(item);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}


export default function CouncilPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CouncilPageContent />
    </Suspense>
  );
}
