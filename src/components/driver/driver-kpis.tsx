"use client";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  // NEW (optional)
  rewards?: number | null; // ZVOLT balance for connected wallet (or 0)

  distance_km: number;
  fuel_liters: number;
  l_per_100km: number;
  idle_share_pct: number;
  overspeed: number;
  harsh_accel: number;
  harsh_brake: number;
};

function fmt(n: number | null | undefined, opts?: Intl.NumberFormatOptions) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, opts);
}

function Stat({
  label,
  value,
  suffix,
  help,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  help?: string;
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4 md:p-5">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="text-xl font-semibold">
          {value}
          {suffix ? <span className="ml-1 text-sm font-medium text-muted-foreground">{suffix}</span> : null}
        </div>
        {help ? <div className="mt-1 text-xs text-muted-foreground">{help}</div> : null}
      </CardContent>
    </Card>
  );
}

export function DriverKPIs({
  rewards = null,
  distance_km,
  fuel_liters,
  l_per_100km,
  idle_share_pct,
  overspeed,
  harsh_accel,
  harsh_brake,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* NEW: Rewards first */}
      <Stat
        label="Rewards (ZVOLT)"
        value={rewards === null ? "0.00" : fmt(rewards, { maximumFractionDigits: 2 })}
        help="Minted for verified savings"
      />

      <Stat
        label="Distance"
        value={fmt(distance_km, { maximumFractionDigits: 0 })}
        suffix="km"
      />
      <Stat
        label="Fuel Use"
        value={fmt(fuel_liters, { maximumFractionDigits: 1 })}
        suffix="L"
      />
      <Stat
        label="Intensity"
        value={fmt(l_per_100km, { maximumFractionDigits: 1 })}
        suffix="L/100km"
      />

      <Stat
        label="Idling"
        value={fmt(idle_share_pct, { maximumFractionDigits: 1 })}
        suffix="%"
        help="Share of engine-on time"
      />
      <Stat
        label="Overspeed Events"
        value={fmt(overspeed, { maximumFractionDigits: 0 })}
      />
      <Stat
        label="Harsh Accel"
        value={fmt(harsh_accel, { maximumFractionDigits: 0 })}
      />
      <Stat
        label="Harsh Brake"
        value={fmt(harsh_brake, { maximumFractionDigits: 0 })}
      />
    </div>
  );
}

export default DriverKPIs;
