"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import demo from "@/data/driver_demo.json";
import { computeMetrics, tripDerived } from "@/lib/coach/score";

import { DriverHeader } from "@/components/driver/driver-header";
import { DriverKPIs } from "@/components/driver/driver-kpis";
import { FuelIntensityTrend } from "@/components/driver/charts/fuel-intensity-trend";
import { IdlingAndEvents } from "@/components/driver/charts/idling-events";
import { TripTable } from "@/components/driver/trip-table";

import { Card, CardContent } from "@/components/ui/card";
import { getReadOnlyTronWeb } from "@/lib/tron";

/** ──────────────────────────────────────────────────────────────────────────
 * Hook: current wallet ZVOLT balance (for Rewards KPI)
 * ────────────────────────────────────────────────────────────────────────── */
function useWalletZVolt(): number | null {
  const [bal, setBal] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const FULLHOST = process.env.NEXT_PUBLIC_TRON_FULLHOST || "https://api.nileex.io";
        const TOKEN = process.env.NEXT_PUBLIC_ZVOLT_REWARDS_ADDRESS || "";
        if (!TOKEN) return setBal(0);

        // prefer TronLink wallet if available
        let owner = "";
        if (typeof window !== "undefined" && (window as any).tronWeb?.defaultAddress?.base58) {
          owner = (window as any).tronWeb.defaultAddress.base58;
        }
        // or fall back to demo treasury
        if (!owner) owner = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || "";

        if (!owner) return setBal(0);

        const tw = await getReadOnlyTronWeb();
        const erc20 = await tw.contract(
          [
            { constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" },
            { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
          ],
          TOKEN
        );
        const [dec, raw] = await Promise.all([
          erc20.decimals().call(),
          erc20.balanceOf(owner).call(),
        ]);
        const denom = Math.pow(10, Number(dec || 18));
        setBal(Number(raw) / denom);
      } catch {
        setBal(0);
      }
    })();
  }, []);
  return bal;
}

/** ──────────────────────────────────────────────────────────────────────────
 * Treasury mini card (TRX + ZVOLT balances)
 * ────────────────────────────────────────────────────────────────────────── */
function TreasuryMiniCard() {
  const [trx, setTrx] = useState<number | null>(null);
  const [zvolt, setZvolt] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string>("ZVOLT");
  const [err, setErr] = useState<string | null>(null);

  const FULLHOST = process.env.NEXT_PUBLIC_TRON_FULLHOST || "https://api.nileex.io";
  const TREASURY = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || "";
  const ZVOLT_ADDR = process.env.NEXT_PUBLIC_ZVOLT_REWARDS_ADDRESS || "";

  const scanUrl = useMemo(() => {
    const isNile = /nile/i.test(FULLHOST);
    const base = isNile ? "https://nile.tronscan.org/#" : "https://tronscan.org/#";
    return TREASURY ? `${base}/address/${TREASURY}` : undefined;
  }, [FULLHOST, TREASURY]);

  useEffect(() => {
    (async () => {
      try {
        if (!TREASURY) {
          setErr("Missing NEXT_PUBLIC_TREASURY_ADDRESS");
          return;
        }
        const tw = await getReadOnlyTronWeb();

        // TRX
        const sun = await tw.trx.getBalance(TREASURY);
        setTrx(Number(sun) / 1e6);

        // ZVOLT
        if (ZVOLT_ADDR) {
          const erc20 = await tw.contract(
            [
              { constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" },
              { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
              { constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], type: "function" },
            ],
            ZVOLT_ADDR
          );
          const [dec, sym, bal] = await Promise.all([
            erc20.decimals().call(),
            erc20.symbol().call(),
            erc20.balanceOf(TREASURY).call(),
          ]);
          setSymbol(sym || "ZVOLT");
          const denom = Math.pow(10, Number(dec || 18));
          setZvolt(Number(bal) / denom);
        }
      } catch (e: any) {
        setErr(e?.message || "Failed to load treasury balances");
      }
    })();
  }, [TREASURY, ZVOLT_ADDR]);

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium mb-0">Treasury</h3>
          {scanUrl && (
            <a
              href={scanUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-muted-foreground"
            >
              View on TronScan
            </a>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">TRX</div>
            <div className="text-base font-medium">
              {trx === null ? "—" : trx.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{symbol}</div>
            <div className="text-base font-medium">
              {zvolt === null ? "—" : zvolt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        {err && <div className="mt-2 text-xs text-red-500">{err}</div>}
      </CardContent>
    </Card>
  );
}

/** ──────────────────────────────────────────────────────────────────────────
 * Main Driver Dashboard
 * ────────────────────────────────────────────────────────────────────────── */
export default function DriverDashboard({
  driverId = "DRV-001",
  displayName = "Alex Driver",
}: {
  driverId?: string;
  displayName?: string;
}) {
  // Demo compute
  const data: any = demo;
  const metrics = computeMetrics(data);
  const perTrip = data.trips.map((t: any) => tripDerived(t));

  const fuelSeries = perTrip.map(({ tripId, l_per_100km }: any) => ({ tripId, l_per_100km }));
  const idleSeries = perTrip.map(({ tripId, idle_minutes, event_count }: any) => ({
    tripId,
    idle_minutes,
    event_count,
  }));

  // NEW: wallet rewards for KPI
  const zvoltKpi = useWalletZVolt();

  return (
    <div className="space-y-6">
      {/* Header */}
      <DriverHeader
        name={displayName}
        driverId={driverId}
        period={metrics.period}
        ecoScore={metrics.ecoScore}
        estSavingPct={metrics.est_saving_pct}
      />

      {/* KPIs (Rewards first) */}
      <DriverKPIs
        rewards={zvoltKpi ?? 0}
        distance_km={metrics.distance_km}
        fuel_liters={metrics.fuel_liters}
        l_per_100km={metrics.l_per_100km}
        idle_share_pct={metrics.idle_share_pct}
        overspeed={metrics.overspeed}
        harsh_accel={metrics.harsh_accel}
        harsh_brake={metrics.harsh_brake}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium mb-2">Fuel intensity trend</h3>
            </div>
            <FuelIntensityTrend series={fuelSeries} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-sm font-medium mb-2">Idling & events</h3>
            <IdlingAndEvents series={idleSeries} />
          </CardContent>
        </Card>
      </div>

      {/* On-chain: Treasury */}
      <TreasuryMiniCard />

      {/* Trips table */}
      <TripTable rows={perTrip} />
    </div>
  );
}
