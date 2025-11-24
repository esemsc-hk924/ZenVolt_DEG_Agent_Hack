"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const SILENCE_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";

type Job = { text: string; voice: string };

export function useSpeaker() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Job[]>([]);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Create a real <audio> node in the DOM (better for Safari/iOS)
  useEffect(() => {
    const a = document.createElement("audio");
    a.id = "zenvolt-tts";
    a.style.display = "none";
    a.preload = "auto";
    (a as any).playsInline = true;
    a.muted = false;
    document.body.appendChild(a);

    const handleEnd = () => {
      setPlaying(false);
      void playNext();
    };
    const handleError = () => {
      setPlaying(false);
      setLastError("Audio playback error");
      void playNext();
    };
    a.addEventListener("ended", handleEnd);
    a.addEventListener("error", handleError);
    audioRef.current = a;

    return () => {
      a.removeEventListener("ended", handleEnd);
      a.removeEventListener("error", handleError);
      a.pause();
      a.removeAttribute("src");
      a.load();
      a.remove();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playNext = useCallback(async () => {
    if (playing) return;
    if (!audioRef.current) return;
    const job = queueRef.current.shift();
    if (!job) return;

    setPlaying(true);
    setLastError(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(job),
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("audio")) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `TTS bad response (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current.src = url;

      // Give the browser a tick to attach the source, then play
      await new Promise((r) => setTimeout(r, 0));
      await audioRef.current.play();

      URL.revokeObjectURL(url);
    } catch (err: any) {
      setLastError(err?.message || "TTS fetch/play failed");
      setPlaying(false);
      // try next in queue
      void playNext();
    }
  }, [playing]);

  const unlock = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.src = SILENCE_WAV;
      await audioRef.current.play();
      audioRef.current.pause();
      setReady(true);
    } catch (e) {
      setReady(false);
      setLastError("Autoplay not unlocked; click Enable Voice");
    }
  }, []);

  const speak = useCallback((text: string, voice = "alloy") => {
    if (!text.trim()) return;
    queueRef.current.push({ text: text.trim(), voice });
    void playNext();
  }, [playNext]);

  const stop = useCallback(() => {
    queueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  return { ready, unlock, speak, stop, playing, lastError };
}
