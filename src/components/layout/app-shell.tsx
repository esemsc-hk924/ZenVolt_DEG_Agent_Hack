// src/components/layout/app-shell.tsx
"use client";

import { useUI } from "@/store/ui";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { Hotkeys } from "./hotkeys";
import NetworkGuard from "@/components/network-guard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUI();
  const pathname = usePathname();

  // Don't render AppShell on home page - it's a full-screen hero
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NetworkGuard />
        <Topbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <Hotkeys />
    </div>
  );
}
