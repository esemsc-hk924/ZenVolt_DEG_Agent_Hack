"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Swords,
  Settings,
  ChevronLeft,
  ShoppingBag,
  Cpu,
} from "lucide-react";
import clsx from "clsx";

import { useUI } from "@/store/ui";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { label: "Compute-Energy", href: "/compute", icon: Cpu },
  { label: "AI Orchestration", href: "/council", icon: Swords },
  { label: "Flexibility Market", href: "/marketplace", icon: ShoppingBag },
  { label: "Settings", href: "/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={clsx(
          "h-screen sticky top-0 z-40 border-r border-white/20 dark:border-white/10",
          "bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/50 supports-[backdrop-filter]:dark:bg-slate-950/50",
          "dark:shadow-[0_25px_70px_-30px_rgba(16,185,129,0.35)]",
          "flex flex-col"
        )}
        aria-label="Primary"
      >
        {/* Header / Brand */}
        <div className="h-14 flex items-center justify-between pl-3 pr-2 border-b border-white/20 dark:border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 overflow-hidden select-none"
            aria-label="ZenVolt Home"
          >
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              <Image
                src="/zenvolt.png"
                alt="ZenVolt"
                fill
                className="object-contain"
                priority
              />
            </div>
            {sidebarOpen && (
              <span className="font-semibold truncate tracking-tight">
                ZenVolt
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar (⌘B)"
            title="Toggle sidebar (⌘B)"
          >
            <ChevronLeft
              className={clsx(
                "h-4 w-4 transition-transform",
                sidebarOpen ? "" : "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Nav */}
        <nav className="px-2 py-2 space-y-1 flex-1 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            const base =
              "flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors border";
            const styles = active
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/20 dark:shadow-[0_12px_30px_-20px_rgba(16,185,129,0.65)]"
              : "hover:bg-white/50 hover:dark:bg-slate-900/50 border-transparent";

            const Item = (
              <Link
                key={href}
                href={href}
                className={clsx(base, styles)}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
                {!sidebarOpen && (
                  <span className="sr-only">{label}</span>
                )}
              </Link>
            );

            return sidebarOpen ? (
              <div key={href}>{Item}</div>
            ) : (
              <Tooltip key={href} delayDuration={150}>
                <TooltipTrigger asChild>{Item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/20 dark:border-white/10">
          {sidebarOpen ? (
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>TRON Nile</span>
              <span>v0.1</span>
            </div>
          ) : (
            <div className="text-[10px] text-muted-foreground text-center">
              Nile
            </div>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
