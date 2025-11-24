// src/store/ui.ts
"use client";

import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

export type UIState = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
};

// Only persist this subset
type UISnapshot = Pick<UIState, "sidebarOpen">;

// Always-defined storage (SSR-safe: no-ops on server)
const storage: PersistStorage<UISnapshot> = {
  getItem: async (name) => {
    if (typeof window === "undefined") return null;
    const v = window.localStorage.getItem(name);
    return v ? JSON.parse(v) : null;
  },
  setItem: async (name, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  },
};

export const useUI = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
    }),
    {
      name: "zenvolt-ui",
      storage, // <- typed for UISnapshot
      partialize: (s): UISnapshot => ({ sidebarOpen: s.sidebarOpen }),
    }
  )
);
