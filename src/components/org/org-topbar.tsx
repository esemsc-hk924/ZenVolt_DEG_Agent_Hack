"use client";

import demo from "@/data/org_demo.json";
import ReportToolbar from "@/components/org/report-toolbar"

import { Award, Target, TrendingUp } from "lucide-react";

function computeReductionPct(): number {
  const b = demo.baselines;
  const c = demo.thisYear;
  const base = (b.scope1_tCO2e || 0) + (b.scope2_location_tCO2e || 0) + ((b as any).fleet_tCO2e || 0);
  const curr = (c.scope1_tCO2e || 0) + (c.scope2_location_tCO2e || 0) + ((c as any).fleet_tCO2e || 0);
  if (!base) return 0;
  return ((base - curr) / base) * 100;
}

function computeProRataTarget(): number {
  // Linear path from 2020 baseline to 2030 short-term reduction
  const short = demo.org?.targets?.shortTerm;
  const year = demo.thisYear?.year ?? 2025;
  const start = demo.baselines?.year ?? 2020;
  const end = short?.year ?? 2030;
  const totalReduction = short?.reductionVs2020Pct ?? 42;
  const progress = Math.max(0, Math.min(1, (year - start) / (end - start)));
  return totalReduction * progress; // expected reduction by current year
}

export default function OrgTopbar() {
  const name = demo.org?.name ?? "Your Organization";
  const user = "Welcome"; // personalize if you like (demo.org.user not provided in this schema)
  const period = demo.org?.reportingPeriod ?? "";

  const reduction = computeReductionPct();
  const proRata = computeProRataTarget();
  const ahead = reduction >= proRata;
  const chip =
    ahead
      ? "bg-emerald-600/10 text-emerald-700"
      : "bg-amber-600/10 text-amber-700";

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">
          {user}, <span className="text-muted-foreground">{name}</span>
        </h1>
        <div className="text-xs md:text-sm text-muted-foreground">{period}</div>
      </div>
      <div className="flex items-center gap-2">
      <ReportToolbar />

        <span className={`text-xs px-2 py-1 rounded-md ${chip} flex items-center gap-1`}>
          <Target className="h-3.5 w-3.5" />
          {ahead ? "On path" : "Behind"} • {reduction.toFixed(1)}% vs {proRata.toFixed(1)}% (pro-rata)
        </span>
        <span className="text-xs px-2 py-1 rounded-md bg-blue-600/10 text-blue-700 hidden sm:flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          Last 7d saved: {(demo.kpis?.last7dSavedKg ?? 0).toLocaleString()} kg
        </span>
        <span className="text-xs px-2 py-1 rounded-md bg-violet-600/10 text-violet-700 hidden md:flex items-center gap-1">
          <Award className="h-3.5 w-3.5" />
          Credits: {(demo.kpis?.estCreditsVerified ?? 0)}✓ / {(demo.kpis?.estCreditsUnverified ?? 0)}
        </span>
      </div>
    </div>
  );
}
