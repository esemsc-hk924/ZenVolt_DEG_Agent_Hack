"use client";
import { useEffect } from "react";
import { useUI, type UIState } from "@/store/ui";

export function Hotkeys() {
  const toggle = useUI((s: UIState) => s.toggleSidebar); // 👈 typed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
  return null;
}
