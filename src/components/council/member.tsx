"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function CouncilMember({
  name,
  role,
  emoji,
  color,
  speaking = false,
}: {
  name: string;
  role: string;
  emoji: string;
  color: string;       // tailwind color name hint
  speaking?: boolean;
}) {
  const ring =
    color === "emerald" ? "from-emerald-400 to-emerald-600" :
    color === "blue"    ? "from-blue-400 to-blue-600" :
    color === "violet"  ? "from-violet-400 to-violet-600" :
    color === "teal"    ? "from-teal-400 to-teal-600" :
    color === "amber"   ? "from-amber-400 to-amber-600" :
    "from-cyan-400 to-cyan-600";

  return (
    <div className="rounded-xl border p-3 bg-background">
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            className={clsx(
              "h-12 w-12 rounded-full grid place-items-center text-xl select-none",
              "bg-gradient-to-br text-white shadow",
              ring
            )}
            animate={speaking ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ repeat: speaking ? Infinity : 0, duration: 1.2 }}
            aria-label={`${name} avatar`}
          >
            {emoji}
          </motion.div>
          {speaking && (
            <motion.span
              className="absolute -inset-1 rounded-full bg-current opacity-15"
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          )}
        </div>
        <div>
          <div className="text-sm font-medium leading-tight">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}
