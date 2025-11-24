"use client";

import CountUp from "@/components/count-up";

export default function ReductionGauge({
  currentReductionPct,
  targetPct,
  proRataPct
}: {
  currentReductionPct: number; // e.g., 18.4
  targetPct: number;           // e.g., 42
  proRataPct: number;          // e.g., 21 for 2025
}) {
  const max = Math.max(targetPct, currentReductionPct, proRataPct, 50);
  const scale = (v: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
  const ahead = currentReductionPct >= proRataPct;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Reduction vs 2020 (path to {targetPct}% by 2030)</div>
      <div className="relative h-10 rounded-md bg-muted/60 overflow-hidden">
        {/* Achieved bar */}
        <div className={`absolute inset-y-0 left-0 ${ahead ? "bg-emerald-500/60" : "bg-amber-500/60"}`} style={{ width: scale(currentReductionPct) }} />
        {/* Pro-rata marker */}
        <Marker label={`Pro-rata ${proRataPct.toFixed(1)}%`} left={scale(proRataPct)} className="bg-blue-600" />
        {/* Target marker */}
        <Marker label={`2030 ${targetPct.toFixed(0)}%`} left={scale(targetPct)} className="bg-slate-600" />
      </div>
      <div className="text-xs text-muted-foreground">
        Current: <CountUp value={currentReductionPct} decimals={1} suffix="%" /> • Pro-rata: <CountUp value={proRataPct} decimals={1} suffix="%" /> • Target: <CountUp value={targetPct} decimals={0} suffix="%" />
      </div>
    </div>
  );
}

function Marker({ left, label, className }: { left: string; label: string; className: string }) {
  return (
    <div className="absolute -top-1" style={{ left }}>
      <div className={`h-10 w-0.5 ${className}`} />
      <div className="text-[11px] mt-1 -translate-x-1/2 whitespace-nowrap">{label}</div>
    </div>
  );
}
