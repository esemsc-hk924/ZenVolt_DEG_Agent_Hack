"use client";

import { Card } from "@/components/ui/card";

type Props = {
  ytdEmissionsTons: number;
  budgetTons: number;
  internalCarbonPricePerTonGBP: number;
};

export default function CarbonBudgetStrip({
  ytdEmissionsTons,
  budgetTons,
  internalCarbonPricePerTonGBP,
}: Props) {
  const variance = ytdEmissionsTons - budgetTons;
  const over = variance > 0;
  const exposure = Math.max(0, variance) * internalCarbonPricePerTonGBP;
  const pct = budgetTons > 0 ? Math.min(100, Math.max(0, (ytdEmissionsTons / budgetTons) * 100)) : 0;

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Carbon budget (YTD)</div>
          <div className="text-2xl font-semibold">
            {ytdEmissionsTons.toLocaleString()} tCO2e
            <span className="text-sm text-muted-foreground ml-2">of {budgetTons.toLocaleString()} tCO2e</span>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-sm text-muted-foreground">Exposure @ £{internalCarbonPricePerTonGBP}/t</div>
          <div className={`text-xl font-semibold ${over ? "text-amber-600" : "text-emerald-600"}`}>
            {over ? "£" + Math.round(exposure).toLocaleString() : "On budget"}
          </div>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={`h-full transition-all ${over ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}


