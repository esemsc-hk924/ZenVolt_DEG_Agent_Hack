"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export type Member = {
  id: "ops" | "fin" | "comp" | "it";
  role: string;
  emoji: string;
  color: string;
  voice: "alloy" | "aria" | "verse" | "coral" | "sage";
};

export type Row = {
  meta: any;
  id: string;
  agentId: Member["id"] | "user"; // Allow user messages
  role: string;
  content: string;
  ts: number; // epoch ms
};

export type Decision = {
  title: string;
  rationale: string;
  actions: { title: string; owner: string; effort: "S" | "M" | "L"; impact: "L" | "M" | "H"; costRange: string; timeline: string; notes?: string; }[];
  risks: string[];
  metrics: string[];
};

const MEMBERS: Member[] = [
  { id: "ops", role: "Operations", emoji: "🏗️", color: "blue", voice: "coral" },
  { id: "fin", role: "Finance", emoji: "💷", color: "violet", voice: "verse" },
  { id: "comp", role: "Compliance", emoji: "⚖️", color: "amber", voice: "sage" },
  { id: "it", role: "Data/IT", emoji: "🧠", color: "cyan", voice: "alloy" },
];

function id() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function ttsSpeak(text: string, voice: Member["voice"]) {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
  } catch { }
}

export function useDebate() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "debating" | "paused" | "complete">("idle");
  const [messages, setMessages] = useState<Row[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [speakingId, setSpeakingId] = useState<Member["id"] | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);

  const members = useMemo(() => MEMBERS, []);
  const stopping = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    stopping.current = false;
    // Abort any ongoing requests
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

    const order: Member["id"][] = ["ops", "fin", "comp", "it"];
    const ROUNDS = 6; // Increased from 2 to 6 for deeper debate

    let transcript: Row[] = resumeFrom ? [...resumeFrom.messages] : [];
    
    // Calculate starting point for resume
    let startRound = resumeFrom ? resumeFrom.currentRound : 0;
    let startProgress = resumeFrom ? resumeFrom.roundProgress + 1 : 0;
    
    // If we've completed all agents in a round, move to next round
    if (resumeFrom && startProgress >= order.length) {
      startRound += 1;
      startProgress = 0;
    }

    // Six rounds - 4 members each round = 24 total responses
    for (let round = startRound; round < ROUNDS; round++) {
      const roundStartIndex = round === startRound ? startProgress : 0;
      
      for (let agentIndex = roundStartIndex; agentIndex < order.length; agentIndex++) {
        const aid = order[agentIndex];
        if (stopping.current) return;
        setSpeakingId(aid);

        const role = MEMBERS.find(m => m.id === aid)!.role;
        const rowId = id();
        let accumulatedContent = "";

        // Create initial message row with empty content
        const initialRow: Row = {
          id: rowId,
          agentId: aid,
          role,
          content: "",
          ts: Date.now(),
          meta: {}
        };
        transcript = [...transcript, initialRow];
        setMessages(transcript);

        try {
          // Create new AbortController for this request
          const abortController = new AbortController();
          abortControllerRef.current = abortController;

          const r = await fetch("/api/council/turn", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ prompt, transcript: transcript.slice(0, -1), agentId: aid, round: round + 1 }),
            signal: abortController.signal,
          });

          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }

          // Read the stream
          const reader = r.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error("No reader available");
          }

          let buffer = "";
          let finalTs = Date.now();

          while (true) {
            // Check if we should stop mid-stream
            if (stopping.current) {
              reader.cancel();
              break;
            }

            const { done, value } = await reader.read();
            if (done) break;

            // Check again after reading chunk
            if (stopping.current) {
              reader.cancel();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              if (!line.trim()) continue;

              // Check if we should stop while processing chunks
              if (stopping.current) {
                reader.cancel();
                break;
              }

              try {
                const data = JSON.parse(line);

                if (data.chunk !== undefined) {
                  accumulatedContent += data.chunk;

                  // Update the message with accumulated content
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
                  // Update final timestamp
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
          // Don't log aborted requests as errors
          if (error.name === "AbortError" || stopping.current) {
            // Keep partial content if available
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
            return; // Exit the loop early
          }
          
          console.error("Streaming error:", error);
          // On error, update with error message
          const errorTranscript = transcript.map((msg) =>
            msg.id === rowId
              ? { ...msg, content: accumulatedContent || "Error generating response" }
              : msg
          );
          transcript = errorTranscript;
          setMessages(errorTranscript);
          abortControllerRef.current = null;
        }

        // Clear speakingId after streaming completes
        setSpeakingId(null);

        // Check if we were stopped during this turn
        if (stopping.current) {
          return; // Exit early if stopped
        }

        if (autoVoice && accumulatedContent) {
          const v = MEMBERS.find(m => m.id === aid)!.voice;
          ttsSpeak(accumulatedContent, v);
        }

        // Small pause between responses for natural flow
        await new Promise(res => setTimeout(res, 500));
        
        // Check again before next turn
        if (stopping.current) {
          return;
        }
      }
    }

    // Only set complete if we weren't stopped
    if (!stopping.current) {
      setStatus("complete");
    }
  }, [prompt, reset, autoVoice]);
  
  const restoreSession = useCallback((messages: Row[], currentRound: number, roundProgress: number) => {
    // Ensure messages is an array
    const validMessages = Array.isArray(messages) ? messages : [];
    setMessages([...validMessages]);
    // Status will be set by the caller or when debate starts
  }, []);
  
  const updateDecision = useCallback((decision: Decision | null) => {
    setDecision(decision);
  }, []);
  
  const updateStatus = useCallback((status: "idle" | "debating" | "paused" | "complete") => {
    setStatus(status);
  }, []);

  const stop = useCallback(() => {
    stopping.current = true;
    // Abort any ongoing fetch request immediately
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("paused");
    setSpeakingId(null);
  }, []);
  
  const resume = useCallback(() => {
    stopping.current = false;
    setStatus("debating");
  }, []);
  
  const addUserMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Row = {
      id: id(),
      agentId: "user",
      role: "You",
      content: content.trim(),
      ts: Date.now(),
      meta: {}
    };
    
    setMessages((prev) => [...prev, userMessage]);
    return userMessage;
  }, []);

  const finalize = useCallback(async () => {
    const r = await fetch("/api/council/decision", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt, transcript: messages }),
    });
    const data = await r.json();
    data.actions ||= [];
    data.risks ||= [];
    data.metrics ||= [];
    setDecision(data);
    setStatus("complete");
  }, [prompt, messages]);

  return {
    members,
    messages,
    decision,
    status,
    prompt,
    setPrompt,
    start,
    stop,
    resume,
    reset,
    finalize,
    speakingId,
    autoVoice,
    setAutoVoice,
    restoreSession,
    setDecision: updateDecision,
    setStatus: updateStatus,
    addUserMessage,
  };
}
