"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/count-up";

type Hotspot = {
  category: string;
  supplier: string;
  spendGBP: number;
  emissions_tCO2e: number;
  status: "uncontacted" | "contacted" | "engaged";
};

const MOCK_HOTSPOTS: Hotspot[] = [
  { category: "IT Hardware", supplier: "TechSupply Ltd", spendGBP: 1250000, emissions_tCO2e: 960, status: "uncontacted" },
  { category: "Catering", supplier: "CampusCater Co", spendGBP: 620000, emissions_tCO2e: 410, status: "contacted" },
  { category: "Construction", supplier: "BuildRight", spendGBP: 2800000, emissions_tCO2e: 1380, status: "engaged" },
  { category: "Lab Supplies", supplier: "LabCore", spendGBP: 420000, emissions_tCO2e: 270, status: "uncontacted" },
  { category: "Cloud Services", supplier: "MegaCloud", spendGBP: 900000, emissions_tCO2e: 350, status: "contacted" },
];

function statusBadge(status: Hotspot["status"]) {
  switch (status) {
    case "engaged": return <Badge className="bg-emerald-600 hover:bg-emerald-700">Engaged</Badge>;
    case "contacted": return <Badge variant="secondary">Contacted</Badge>;
    default: return <Badge variant="outline">Uncontacted</Badge>;
  }
}

export default function ProcurementHotspots() {
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground mb-3">Top Scope 3 hotspots (by estimated tCO2e)</div>
      <div className="space-y-2">
        {MOCK_HOTSPOTS.sort((a, b) => b.emissions_tCO2e - a.emissions_tCO2e).slice(0, 5).map((h) => (
          <div key={h.supplier + h.category} className="rounded-xl border bg-background/60 p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{h.category} · {h.supplier}</div>
              <div className="text-xs text-muted-foreground">£<CountUp value={h.spendGBP} /> · <CountUp value={h.emissions_tCO2e} /> tCO2e</div>
            </div>
            {statusBadge(h.status)}
          </div>
        ))}
      </div>
    </Card>
  );
}


