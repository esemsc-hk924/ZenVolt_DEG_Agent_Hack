"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Row, Decision } from "./use-debate";

// Extended Member type for compute-energy
type ComputeMember = {
  id: "compute" | "grid" | "storage" | "finance";
  role: string;
  emoji: string;
  color: string;
  voice: "alloy" | "aria" | "verse" | "coral" | "sage";
};

// Compute-Energy specific agents
const COMPUTE_MEMBERS: ComputeMember[] = [
  { id: "compute", role: "Compute Agent", emoji: "💻", color: "blue", voice: "alloy" },
  { id: "grid", role: "Grid Agent", emoji: "⚡", color: "emerald", voice: "coral" },
  { id: "storage", role: "Storage Agent", emoji: "🔋", color: "yellow", voice: "verse" },
  { id: "finance", role: "Finance Agent", emoji: "💰", color: "violet", voice: "sage" },
];

function id() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useComputeDebate() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "debating" | "paused" | "complete">("idle");
  const [messages, setMessages] = useState<Row[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const stopping = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const members = useMemo(() => COMPUTE_MEMBERS, []);

  const reset = useCallback(() => {
    stopping.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("idle");
    setMessages([]);
    setDecision(null);
    setSpeakingId(null);
  }, []);

  const start = useCallback(async (resumeFrom?: { messages: Row[]; currentRound: number; roundProgress: number }) => {
    if (!resumeFrom) {
      reset();
    }
    setStatus("debating");

    const order: string[] = ["compute", "grid", "storage", "finance"];
    const ROUNDS = 6;

    let transcript: Row[] = resumeFrom ? [...resumeFrom.messages] : [];
    let startRound = resumeFrom ? resumeFrom.currentRound : 0;
    let startProgress = resumeFrom ? resumeFrom.roundProgress + 1 : 0;

    if (resumeFrom && startProgress >= order.length) {
      startRound += 1;
      startProgress = 0;
    }

    // Set default prompt if not set
    const defaultPrompt = prompt || 
      "Optimize compute workload scheduling to minimize cost per inference while staying under carbon cap. " +
      "Consider grid signals, energy prices, carbon intensity, and flexibility market opportunities.";
    if (!prompt) setPrompt(defaultPrompt);

    for (let round = startRound; round < ROUNDS; round++) {
      const roundStartIndex = round === startRound ? startProgress : 0;
      
      for (let agentIndex = roundStartIndex; agentIndex < order.length; agentIndex++) {
        const aid = order[agentIndex];
        if (stopping.current) return;
        setSpeakingId(aid);

        const role = COMPUTE_MEMBERS.find(m => m.id === aid)!.role;
        const rowId = id();
        let accumulatedContent = "";

        const initialRow: Row = {
          id: rowId,
          agentId: aid as "ops" | "fin" | "comp" | "it" | "user",
          role,
          content: "",
          ts: Date.now(),
          meta: {}
        };
        transcript = [...transcript, initialRow];
        setMessages(transcript);

        try {
          const abortController = new AbortController();
          abortControllerRef.current = abortController;

          const r = await fetch("/api/council/compute-turn", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ 
              prompt: defaultPrompt, 
              transcript: transcript.slice(0, -1), 
              agentId: aid, 
              round: round + 1 
            }),
            signal: abortController.signal,
          });

          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }

          const reader = r.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error("No reader available");
          }

          let buffer = "";
          let finalTs = Date.now();

          while (true) {
            if (stopping.current) {
              reader.cancel();
              break;
            }

            const { done, value } = await reader.read();
            if (done) break;

            if (stopping.current) {
              reader.cancel();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;

              if (stopping.current) {
                reader.cancel();
                break;
              }

              try {
                const data = JSON.parse(line);

                if (data.chunk !== undefined) {
                  accumulatedContent += data.chunk;
                  const updatedTranscript = transcript.map((msg) =>
                    msg.id === rowId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  );
                  transcript = updatedTranscript;
                  setMessages(updatedTranscript);
                }

                if (data.done) {
                  finalTs = data.ts || Date.now();
                  const finalTranscript = transcript.map((msg) =>
                    msg.id === rowId
                      ? { ...msg, content: accumulatedContent, ts: finalTs }
                      : msg
                  );
                  transcript = finalTranscript;
                  setMessages(finalTranscript);
                }
              } catch (e) {
                console.warn("Failed to parse chunk:", line, e);
              }
            }
            
            if (stopping.current) break;
          }
          
          abortControllerRef.current = null;
        } catch (error: any) {
          if (error.name === "AbortError" || stopping.current) {
            if (accumulatedContent) {
              const partialTranscript = transcript.map((msg) =>
                msg.id === rowId
                  ? { ...msg, content: accumulatedContent, ts: Date.now() }
                  : msg
              );
              transcript = partialTranscript;
              setMessages(partialTranscript);
            }
            abortControllerRef.current = null;
            return;
          }
          
          console.error("Streaming error:", error);
          const errorTranscript = transcript.map((msg) =>
            msg.id === rowId
              ? { ...msg, content: accumulatedContent || "Error generating response" }
              : msg
          );
          transcript = errorTranscript;
          setMessages(errorTranscript);
          abortControllerRef.current = null;
        }
      }
    }

    setStatus("complete");
    setSpeakingId(null);
  }, [prompt, reset]);

  const stop = useCallback(() => {
    stopping.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("paused");
    setSpeakingId(null);
  }, []);

  const resume = useCallback(() => {
    stopping.current = false;
    const progress = Math.floor(messages.length / members.length);
    const roundProgress = messages.length % members.length;
    start({
      messages,
      currentRound: progress,
      roundProgress: roundProgress - 1,
    });
  }, [messages, members.length, start]);

  const addUserMessage = useCallback((content: string): Row => {
    const userRow: Row = {
      id: id(),
      agentId: "user",
      role: "User",
      content,
      ts: Date.now(),
      meta: {},
    };
    setMessages((prev) => [...prev, userRow]);
    return userRow;
  }, []);

  const finalize = useCallback(async () => {
    if (messages.length === 0) return;

    try {
      const res = await fetch("/api/council/decision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, messages }),
      });

      if (!res.ok) throw new Error("Failed to synthesize decision");

      const data = await res.json();
      setDecision(data.decision);
      setStatus("complete");
    } catch (error) {
      console.error("Error finalizing:", error);
    }
  }, [prompt, messages]);

  return {
    prompt,
    setPrompt,
    status,
    messages,
    decision,
    setDecision,
    setStatus,
    speakingId,
    members,
    start,
    stop,
    resume,
    reset,
    addUserMessage,
    finalize,
    restoreSession: useCallback((msgs: Row[], round: number, progress: number) => {
      setMessages(msgs);
      // Status will be set by caller
    }, []),
  };
}

