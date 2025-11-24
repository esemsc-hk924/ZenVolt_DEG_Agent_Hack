"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Leaf, Coins, Target } from "lucide-react";
import { motion } from "framer-motion";

interface KPIData {
  costPerInference: {
    before: number;
    after: number;
    reduction: number;
  };
  carbonPerInference: {
    before: number;
    after: number;
    reduction: number;
  };
  flexibilityCredits: number;
  carbonCap: {
    cap: number;
    current: number;
  };
}

interface ComputeKPIsProps {
  data: KPIData;
}

export default function ComputeKPIs({ data }: ComputeKPIsProps) {
  const kpis = [
    {
      label: "£ per inference",
      before: `£${data.costPerInference.before.toFixed(3)}`,
      after: `£${data.costPerInference.after.toFixed(3)}`,
      reduction: data.costPerInference.reduction,
      icon: Coins,
      color: "green",
    },
    {
      label: "Carbon per inference (gCO₂)",
      before: `${data.carbonPerInference.before} g`,
      after: `${data.carbonPerInference.after} g`,
      reduction: data.carbonPerInference.reduction,
      icon: Leaf,
      color: "blue",
    },
    {
      label: "Flexibility Credits (P415)",
      value: `+£${data.flexibilityCredits.toFixed(3)} / inference`,
      icon: TrendingDown,
      color: "yellow",
    },
    {
      label: "Carbon Cap",
      value: `Cap: ${data.carbonCap.cap} gCO₂`,
      current: `Current: ${data.carbonCap.current} g`,
      icon: Target,
      color: "violet",
      withinLimit: data.carbonCap.current <= data.carbonCap.cap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    kpi.color === "green"
                      ? "bg-green-500/10 text-green-600"
                      : kpi.color === "blue"
                        ? "bg-blue-500/10 text-blue-600"
                        : kpi.color === "yellow"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-violet-500/10 text-violet-600"
                  }`}
                >
                  <kpi.icon className="h-5 w-5" />
                </div>
                {kpi.reduction !== undefined && (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingDown className="h-4 w-4" />
                    {kpi.reduction}%
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                {kpi.before && kpi.after ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold">{kpi.after}</span>
                      <span className="text-xs text-muted-foreground line-through">
                        {kpi.before}
                      </span>
                    </div>
                  </div>
                ) : kpi.value ? (
                  <p className="text-lg font-semibold">{kpi.value}</p>
                ) : null}

                {kpi.current && (
                  <p
                    className={`text-sm font-medium ${
                      kpi.withinLimit ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.current}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

