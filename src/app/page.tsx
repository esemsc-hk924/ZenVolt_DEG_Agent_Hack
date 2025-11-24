"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Network, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const router = useRouter();

  const handleBegin = () => {
    router.push("/compute");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background - energy lines + nodes */}
      <div className="absolute inset-0">
        {/* Energy grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#16a34a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.line
              key={i}
              x1={i * 5 + "%"}
              y1="0%"
              x2={i * 5 + "%"}
              y2="100%"
              stroke="url(#gridGradient)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </svg>

        {/* Floating nodes (datacenters/energy zones) */}
        {[
          { x: 20, y: 30, label: "London" },
          { x: 60, y: 50, label: "Scotland" },
          { x: 80, y: 20, label: "CUDOS" },
        ].map((node, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-green-400 blur-sm" />
              <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-400" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-400/60 font-mono">
                {node.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Title */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
            >
              SYNC
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-slate-300 md:text-2xl lg:text-3xl"
            >
              Carbon-Aware Orchestration
              <br />
              <span className="text-green-400">for AI Compute</span>
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
              onClick={handleBegin}
              size="lg"
              className="group h-14 rounded-full bg-green-600 px-8 text-lg font-semibold text-white shadow-lg shadow-green-500/50 transition-all hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/60"
            >
              Begin Simulation
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Micro text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex items-center justify-center gap-4 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span>Digital Energy Grid</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-500" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Beckn Protocol</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-500" />
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>Multi-Agent AI</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
