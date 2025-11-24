"use client";

import demo from "@/data/org_demo.json";
import OrgTopbar from "@/components/org/org-topbar";
import OrgKpis from "@/components/org/org-kpis";
import WeeklySavedArea from "@/components/charts/weekly-saved-area";
import MonthlyStacked from "@/components/charts/monthly-stacked";
import CreditsDonut from "@/components/charts/credits-donut";
import ReductionGauge from "@/components/charts/reduction-gauge";
import InitiativesTable from "@/components/org/initiatives-table";
import OffsetRecommendation from "@/components/marketplace/offset-recommendation";
import { Card } from "@/components/ui/card";
import ActionQueue from "@/components/org/action-queue";
import ProcurementHotspots from "@/components/org/procurement-hotspots";

// compute annual gap to 2030 target and required weekly savings line
function computeRequiredWeekly(): number {
  const short = demo.org?.targets?.shortTerm; // {year, reductionVs2020Pct}
  const baseSum =
    (demo.baselines.scope1_tCO2e || 0) +
    (demo.baselines.scope2_location_tCO2e || 0) +
    (demo.baselines.scope3_cat4_upstream_tCO2e || 0);
  const currSum =
    (demo.thisYear.scope1_tCO2e || 0) +
    (demo.thisYear.scope2_location_tCO2e || 0) +
    (demo.thisYear.scope3_cat4_upstream_tCO2e || 0);

  const targetPct = short?.reductionVs2020Pct ?? 42;
  const targetYear = short?.year ?? 2030;

  // Emissions allowed by target (2030): base * (1 - targetPct)
  const allowed2030 = baseSum * (1 - targetPct / 100);
  const gap = Math.max(0, currSum - allowed2030);

  // Not perfect (ignores trajectory), but gives an exec-friendly reference
  return gap / 52;
}

function currentReduction(): number {
  const b = demo.baselines;
  const c = demo.thisYear;
  const base = (b.scope1_tCO2e || 0) + (b.scope2_location_tCO2e || 0) + (b.scope3_cat4_upstream_tCO2e || 0);
  const curr = (c.scope1_tCO2e || 0) + (c.scope2_location_tCO2e || 0) + (c.scope3_cat4_upstream_tCO2e || 0);
  return base ? ((base - curr) / base) * 100 : 0;
}

function proRata(): number {
  const short = demo.org?.targets?.shortTerm;
  const year = demo.thisYear?.year ?? 2025;
  const start = demo.baselines?.year ?? 2020;
  const end = short?.year ?? 2030;
  const totalReduction = short?.reductionVs2020Pct ?? 42;
  const progress = Math.max(0, Math.min(1, (year - start) / (end - start)));
  return totalReduction * progress;
}

export default function OrgPage() {
  const weeklyRequired = computeRequiredWeekly();
  const weeklyWithTarget = (demo.timeSeriesWeekly ?? []).map((w: any) => ({
    ...w,
    required: weeklyRequired,
  }));

  const monthly = demo.timeSeriesMonthly ?? [];
  const ver = demo.kpis?.estCreditsVerified ?? 0;
  const unver = demo.kpis?.estCreditsUnverified ?? 0;

  const currRed = currentReduction();
  const targetPct = demo.org?.targets?.shortTerm?.reductionVs2020Pct ?? 42;
  const pro = proRata();

  // Get emissions data for offset recommendation
  const scope1Emissions = demo.thisYear?.scope1_tCO2e || 0;
  const scope2Emissions = demo.thisYear?.scope2_location_tCO2e || 0;
  const scope3Emissions = demo.thisYear?.scope3_cat4_upstream_tCO2e || 0;

  const handleViewRecommended = () => {
    // Scroll to marketplace or open marketplace page
    window.location.href = '/marketplace';
  };

  return (
    <div className="space-y-6 relative">
      {/* iOS-style neutral background pattern for glassy effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50/80 via-gray-100/60 to-gray-50/40 dark:from-gray-950/50 dark:via-gray-900/40 dark:to-gray-950/30 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.015),transparent_50%)] pointer-events-none" />
      
      {/* Top greeting and status chips */}
      <OrgTopbar />

      {/* KPI row */}
      <OrgKpis />

      {/* Row 1: Weekly trend + Reduction gauge & Credits */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-4 xl:col-span-2">
          <div className="text-sm text-muted-foreground mb-2">Weekly saved emissions by Scope 3 category (kg)</div>
          <WeeklySavedArea data={weeklyWithTarget as any} />
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-4">
            <ReductionGauge currentReductionPct={currRed} targetPct={targetPct} proRataPct={pro} />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-2">Carbon credits</div>
            <CreditsDonut verified={ver} unverified={unver} />
          </Card>
        </div>
      </div>

      {/* Row 2: Monthly breakdown + Action queue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-4 xl:col-span-2">
          <div className="text-sm text-muted-foreground mb-2">Monthly saved emissions by Scope 3 category (kg)</div>
          <MonthlyStacked data={monthly as any} />
        </Card>
        <ActionQueue />
      </div>

      {/* Row 3: Initiatives table (full width below chart) */}
      <InitiativesTable />

      {/* Procurement hotspots */}
      <ProcurementHotspots />

      {/* Offset Recommendation Banner */}
      <OffsetRecommendation
        scope1Emissions={scope1Emissions}
        scope2Emissions={scope2Emissions}
        scope3Emissions={scope3Emissions}
        onViewRecommended={handleViewRecommended}
      />
    </div>
  );
}
