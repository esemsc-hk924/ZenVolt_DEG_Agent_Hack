// src/components/council/council-speaker-tts.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Square, Play } from "lucide-react";

type TtsMessage = { id: string; agent: string; text: string };

export default function CouncilSpeakerTTS({
  messages,
  agentVoices,
  defaultVoice = "alloy",
  autoSpeak = false,
}: {
  messages: TtsMessage[];
  agentVoices?: Record<string, string>;
  defaultVoice?: string;
  autoSpeak?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<TtsMessage[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Start clean
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const el = audioRef.current;
    const onEnded = () => {
      setSpeakingId(null);
      setQueue((q) => q.slice(1));
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, []);

  // Auto-play through queue
  useEffect(() => {
    const el = audioRef.current!;
    if (queue.length && !speakingId) {
      const m = queue[0];
      setSpeakingId(m.id);
      const voice = (agentVoices && agentVoices[m.agent]) || defaultVoice;
      fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: `${m.agent} says: ${m.text}`, voice }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error(await r.text());
          const blob = await r.blob();
          el.src = URL.createObjectURL(blob);
          // Must be triggered by a user gesture at least once
          return el.play();
        })
        .catch(() => {
          setSpeakingId(null);
          setQueue((q) => q.slice(1));
        });
    }
  }, [queue, speakingId, agentVoices, defaultVoice]);

  // Keep queue synced with messages if autoSpeak
  useEffect(() => {
    if (autoSpeak) {
      setQueue((q) => {
        const seen = new Set(q.map((m) => m.id));
        const newOnes = messages.filter((m) => m.text && !seen.has(m.id));
        return q.concat(newOnes);
      });
    }
  }, [messages, autoSpeak]);

  const speakAll = () => {
    // User gesture -> allowed to play
    const newOnes = messages.filter((m) => m.text);
    setQueue(newOnes);
    if (audioRef.current && audioRef.current.paused && newOnes.length) {
      // first play will unlock audio context
      audioRef.current.play().catch(() => {});
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setQueue([]);
    setSpeakingId(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" onClick={speakAll} title="Speak the debate">
        <Volume2 className="h-4 w-4 mr-2" /> Speak All
      </Button>
      <Button variant="outline" onClick={stop} title="Stop audio">
        <Square className="h-4 w-4 mr-2" /> Stop
      </Button>
      {!autoSpeak && (
        <span className="hidden md:inline text-xs text-muted-foreground ml-1">
          Click <Play className="inline h-3 w-3" /> Speak All to hear the debate.
        </span>
      )}
    </div>
  );
}
