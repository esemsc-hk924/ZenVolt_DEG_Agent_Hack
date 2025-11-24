// src/components/layout/topbar.tsx
"use client";
import WalletConnect from "@/components/wallet-connect";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Topbar() {
  return (
    <div className="h-14 sticky top-0 z-10 border-b bg-background/80 backdrop-blur px-4 flex items-center justify-end gap-3">
      <ThemeToggle />
      <WalletConnect />
    </div>
  );
}
