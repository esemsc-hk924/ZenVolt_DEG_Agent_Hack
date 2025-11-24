"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface GridSignalsProps {
  carbonIntensity: number;
  energyPrice: number;
  flexibilityAvailable: number;
  spikeDetected?: boolean;
  spikeLocation?: string;
}

export default function GridSignalsPanel({
  carbonIntensity,
  energyPrice,
  flexibilityAvailable,
  spikeDetected,
  spikeLocation,
}: GridSignalsProps) {
  const getCarbonIndex = (intensity: number) => {
    if (intensity < 150) return { label: "Low", color: "green", icon: TrendingDown };
    if (intensity < 300) return { label: "Moderate", color: "yellow", icon: TrendingUp };
    return { label: "High", color: "red", icon: AlertTriangle };
  };

  const carbonIndex = getCarbonIndex(carbonIntensity);

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium mb-4">Grid Signals</h3>

        {spikeDetected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Carbon Spike Detected — {carbonIntensity} gCO₂/kWh
              </span>
            </div>
            {spikeLocation && (
              <p className="text-xs text-muted-foreground mt-1">Location: {spikeLocation}</p>
            )}
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Energy Price</span>
              </div>
              <Badge variant="outline" className="font-mono">
                £{energyPrice.toFixed(2)}/kWh
              </Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${Math.min((energyPrice / 0.15) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <carbonIndex.icon
                  className={`h-4 w-4 ${
                    carbonIndex.color === "green"
                      ? "text-green-600"
                      : carbonIndex.color === "yellow"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                />
                <span className="text-sm text-muted-foreground">Carbon Intensity</span>
              </div>
              <Badge
                variant="outline"
                className={`font-mono ${
                  carbonIndex.color === "green"
                    ? "border-green-500 text-green-600"
                    : carbonIndex.color === "yellow"
                      ? "border-yellow-500 text-yellow-600"
                      : "border-red-500 text-red-600"
                }`}
              >
                {carbonIntensity} g/kWh
              </Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  carbonIndex.color === "green"
                    ? "bg-green-500"
                    : carbonIndex.color === "yellow"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${Math.min((carbonIntensity / 500) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Status: <span className="font-medium">{carbonIndex.label}</span>
            </p>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Flexibility Available</span>
              <Badge className="bg-green-600 text-white">
                +£{flexibilityAvailable.toFixed(3)}/inference
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              P415 market opportunities
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

