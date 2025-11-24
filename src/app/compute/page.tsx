"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ComputeKPIs from "@/components/compute/compute-kpis";
import RegionMap from "@/components/compute/region-map";
import JobQueue from "@/components/compute/job-queue";
import GridSignalsPanel from "@/components/compute/grid-signals-panel";
import TimelineForecast from "@/components/compute/timeline-forecast";
import ImpactSection from "@/components/compute/impact-section";
import { Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ THE ONLY Region type allowed in the project
import type { Region } from "@/lib/compute/mock-jobs";

/* ------------------------------------------------------------------
   JOB TYPE
------------------------------------------------------------------- */

type ComputeJob = {
  id: string;
  type: "inference" | "training" | "batch";
  energyKwh: number;
  windowMins: number;
  deadlineMins: number;
  region: "london" | "scotland" | "cudos";
  status: "queued" | "running" | "deferred" | "shifted" | "done";
};

/* ------------------------------------------------------------------
   SEED JOBS
------------------------------------------------------------------- */

const SEED_JOBS: ComputeJob[] = [
  { id: "J12", type: "inference", energyKwh: 3.2, windowMins: 20, deadlineMins: 30, region: "london", status: "queued" },
  { id: "J17", type: "training", energyKwh: 8.0, windowMins: 40, deadlineMins: 240, region: "london", status: "queued" },
  { id: "J19", type: "batch", energyKwh: 2.1, windowMins: 15, deadlineMins: 60, region: "scotland", status: "running" },
  { id: "J21", type: "inference", energyKwh: 1.4, windowMins: 10, deadlineMins: 15, region: "london", status: "queued" },
  { id: "J44", type: "batch", energyKwh: 4.5, windowMins: 60, deadlineMins: 180, region: "cudos", status: "queued" },
];

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */

export default function ComputePage() {
  const [jobs, setJobs] = useState<ComputeJob[]>(SEED_JOBS);
  const [regions, setRegions] = useState<Region[]>([]);
  const [carbonIntensityNational, setCarbonIntensityNational] = useState<number>(0);
  const [forecast, setForecast] = useState<any[]>([]);
  const [spikeDetected, setSpikeDetected] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [orchStatus, setOrchStatus] = useState<string | null>(null);

  /* ------------------------------------------------------------------
     1) GRID SIGNAL FETCH — REAL LIVE DATA
  ------------------------------------------------------------------- */

  useEffect(() => {
    let alive = true;

    async function fetchRealSignals() {
      try {
        const [carbonRes, priceRes] = await Promise.all([
          fetch("/api/signals/carbon", { cache: "no-store" }),
          fetch("/api/signals/prices", { cache: "no-store" }),
        ]);

        const carbonData = await carbonRes.json();
        const priceData = await priceRes.json();

        const currentPrice =
          priceData?.series?.at(-1)?.price_gbp_per_kwh ??
          priceData?.series?.[0]?.price_gbp_per_kwh ??
          0.2;

        // -------------------------------------------
        // Build Regions using the SHARED Region type
        // -------------------------------------------

        const realRegions: Region[] = (carbonData?.regions ?? []).map((r: any) => ({
          id: r.id,
          name: r.name,
          carbonIntensity: Number(r.carbon ?? 0),
          renewableShare: Number(r.renewable ?? 0),
          energyPrice: Number(currentPrice.toFixed(2)),
          gpuCapacity: {
            available: r.id === "london" ? 6 : r.id === "scotland" ? 10 : 4,
            total: r.id === "london" ? 24 : r.id === "scotland" ? 16 : 8,
          },
        }));

        if (!alive) return;

        setRegions(realRegions);

        // National avg carbon
        const avgCarbon =
          realRegions.reduce((s, rg) => s + rg.carbonIntensity, 0) /
          Math.max(1, realRegions.length);
        setCarbonIntensityNational(Math.round(avgCarbon));

        // Forecast series
        setForecast(
          realRegions.map((rg) => ({
            region: rg.name,
            carbon: rg.carbonIntensity,
            price: rg.energyPrice,
            renewable: rg.renewableShare,
            ts: carbonData.ts,
          }))
        );

        // Spike detection
        const london = realRegions.find((x) => x.id === "london");
        setSpikeDetected(!!(london && london.carbonIntensity >= 300));

      } catch (err) {
        console.error("Real signals fetch failed:", err);
      }
    }

    fetchRealSignals();
    const interval = setInterval(fetchRealSignals, 60_000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  /* ------------------------------------------------------------------
     2) JOB STATE EVOLUTION (fake scheduling)
  ------------------------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.status === "queued" && Math.random() > 0.8) {
            return { ...job, status: "running" };
          }
          if (job.status === "running" && Math.random() > 0.9) {
            return { ...job, status: "done" };
          }
          return job;
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ------------------------------------------------------------------
     3) BECKN EVENTS (REAL)
  ------------------------------------------------------------------- */

  const [becknEvents, setBecknEvents] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;

    async function fetchBecknEvents() {
      try {
        const res = await fetch("/api/beckn/events", { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        setBecknEvents(data?.events ?? []);
      } catch (e) {
        console.error("Beckn events fetch failed:", e);
      }
    }

    fetchBecknEvents();
    const interval = setInterval(fetchBecknEvents, 4000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  /* ------------------------------------------------------------------
     4) ORCHESTRATION TRIGGER
  ------------------------------------------------------------------- */

  async function triggerOrchestration() {
    setOrchStatus("Triggering Beckn SEARCH…");

    try {
      const res = await fetch("/api/orchestrate", { method: "POST" });
      const data = await res.json();

      if (!data.ok) {
        setOrchStatus(`Beckn error: ${data.error}`);
        return;
      }
      setOrchStatus(`SEARCH sent. txn=${data.transactionId}`);
    } catch (e: any) {
      setOrchStatus(`Orchestration failed: ${e.message}`);
    }
  }

  /* ------------------------------------------------------------------
     5) KPI CALCULATIONS
  ------------------------------------------------------------------- */

  const kpiData = useMemo(() => {
    const baselineCost = 0.017;
    const baselineCarbon = 94;

    const avgCarbon =
      regions.reduce((s, r) => s + r.carbonIntensity, 0) /
      Math.max(1, regions.length);

    const avgPrice =
      regions.reduce((s, r) => s + r.energyPrice, 0) /
      Math.max(1, regions.length);

    const currentCost = baselineCost * (avgPrice / 0.2);
    const currentCarbon = baselineCarbon * (avgCarbon / 120);

    const flexCredits =
      jobs.filter((j) => j.status === "deferred" || j.status === "shifted")
        .length * 0.001;

    return {
      costPerInference: {
        before: baselineCost,
        after: Number(currentCost.toFixed(3)),
        reduction: Math.max(
          0,
          Math.round(((baselineCost - currentCost) / baselineCost) * 100)
        ),
      },
      carbonPerInference: {
        before: baselineCarbon,
        after: Number(currentCarbon.toFixed(0)),
        reduction: Math.max(
          0,
          Math.round(((baselineCarbon - currentCarbon) / baselineCarbon) * 100)
        ),
      },
      flexibilityCredits: Number(flexCredits.toFixed(3)),
      carbonCap: {
        cap: 300,
        current: Math.round(avgCarbon),
      },
    };
  }, [regions, jobs]);

  const energyPrice = regions.find((r) => r.id === "london")?.energyPrice ?? 0.2;

  /* ------------------------------------------------------------------
     6) FIXED — TYPE-SAFE BECKN TRANSACTIONS
  ------------------------------------------------------------------- */

  const becknTransactions = useMemo(() => {
    return becknEvents.map((e: any) => ({
      step: String(e.action || "").toUpperCase(),
      status: "completed" as const,       // ✔ literal type
      metadata: `txn=${e.transactionId}`,
      timestamp: new Date(e.createdAt).toLocaleTimeString(),
    }));
  }, [becknEvents]);

  /* ------------------------------------------------------------------
     UI
  ------------------------------------------------------------------- */

  return (
    <div className="space-y-6 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50/80 via-gray-100/60 to-gray-50/40 dark:from-gray-950/50 dark:via-gray-900/40 dark:to-gray-950/30 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Compute–Energy Dashboard (ZenVolt)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time orchestration of AI compute workloads with live carbon and price signals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Spike alert */}
      <AnimatePresence>
        {spikeDetected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-600">
                  London Carbon Spike Detected —{" "}
                  {regions.find((r) => r.id === "london")?.carbonIntensity ?? "…"} gCO₂/kWh
                </p>
                <p className="text-sm text-muted-foreground">
                  ZenVolt ready to orchestrate via Beckn…
                </p>
              </div>
            </div>

            <Button
              onClick={triggerOrchestration}
              className="bg-green-600 hover:bg-green-700"
            >
              Orchestrate via Beckn
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs */}
      <ComputeKPIs data={kpiData} />

      {/* Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <RegionMap
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionClick={setSelectedRegion}
          />
        </div>

        <div className="xl:col-span-1">
          <JobQueue jobs={jobs} />
        </div>

        <div className="xl:col-span-1">
          <GridSignalsPanel
            carbonIntensity={carbonIntensityNational}
            energyPrice={energyPrice}
            flexibilityAvailable={kpiData.flexibilityCredits}
            spikeDetected={spikeDetected}
            spikeLocation={spikeDetected ? "London" : undefined}
          />
        </div>
      </div>

      {/* Forecast */}
      <TimelineForecast forecast={forecast} />

      {/* CTA */}
      {!spikeDetected && (
        <div className="flex justify-center items-center gap-3">
          <Button
            onClick={triggerOrchestration}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Orchestrate via Beckn
          </Button>
          {orchStatus && (
            <div className="text-xs text-muted-foreground">{orchStatus}</div>
          )}
        </div>
      )}

      {/* Impact Section */}
      <ImpactSection
        data={{
          costReduction: kpiData.costPerInference.reduction,
          carbonReduction: kpiData.carbonPerInference.reduction,
          flexValueEarned: kpiData.flexibilityCredits,
          carbonCapMaintained: kpiData.carbonCap.current <= kpiData.carbonCap.cap,
          savings: {
            cost: {
              before: kpiData.costPerInference.before,
              after: kpiData.costPerInference.after,
            },
            carbon: {
              before: kpiData.carbonPerInference.before,
              after: kpiData.carbonPerInference.after,
            },
            flexCredits: { before: 0, after: kpiData.flexibilityCredits },
          },
          auditLog: becknEvents.slice(0, 8).map((e: any) => ({
            timestamp: new Date(e.createdAt).toLocaleTimeString(),
            action: `Beckn ${e.action}`,
            reason: `txn=${e.transactionId}`,
            savings: "computed by MILP (live soon)",
            dataSources: ["beckn_gateway", "grid_signals", "zenvolt_orchestrator"],
          })),
          becknTransactions,
        }}
      />
    </div>
  );
}
