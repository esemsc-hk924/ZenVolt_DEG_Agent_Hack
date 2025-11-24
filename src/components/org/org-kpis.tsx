"use client";

import demo from "@/data/org_demo.json";
import StatCard from "@/components/stat-card";
import CountUp from "@/components/count-up";

function reductionVs2020(): { reduction: number; tone: "ok" | "warn"; hint: string } {
  const b = demo.baselines;
  const c = demo.thisYear;
  const base = (b.scope1_tCO2e || 0) + (b.scope2_location_tCO2e || 0) + (b.scope3_cat4_upstream_tCO2e || 0);
  const curr = (c.scope1_tCO2e || 0) + (c.scope2_location_tCO2e || 0) + (c.scope3_cat4_upstream_tCO2e || 0);
  const r = base ? ((base - curr) / base) * 100 : 0;

  // compare against pro-rata path to 2030
  const short = demo.org?.targets?.shortTerm;
  const expected = (() => {
    const start = demo.baselines?.year ?? 2020;
    const end = short?.year ?? 2030;
    const totalReduction = short?.reductionVs2020Pct ?? 42;
    const year = demo.thisYear?.year ?? 2025;
    const progress = Math.max(0, Math.min(1, (year - start) / (end - start)));
    return totalReduction * progress;
  })();

  const tone = r >= expected ? "ok" as const : "warn" as const;
  const hint = `Target path ${expected.toFixed(1)}%`;
  return { reduction: r, tone, hint };
}

export default function OrgKpis() {
  const ytd = demo.kpis?.ytdSavedKg ?? 0;
  const ver = demo.kpis?.estCreditsVerified ?? 0;
  const unver = demo.kpis?.estCreditsUnverified ?? 0;
  const credits = ver + unver;
  const red = reductionVs2020();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard 
        label="YTD Saved Emissions" 
        value={<CountUp value={ytd} suffix=" kg" />} 
        hint="All sources" 
      />
      <StatCard 
        label="Internal Credits" 
        value={<CountUp value={credits} />} 
        hint={<><CountUp value={ver} /> verified / <CountUp value={unver} /> pending</>} 
      />
      <StatCard 
        label="Reduction vs 2020" 
        value={<CountUp value={red.reduction} decimals={1} suffix="%" />} 
        hint={red.hint} 
        tone={red.tone} 
      />
    </div>
  );
}
