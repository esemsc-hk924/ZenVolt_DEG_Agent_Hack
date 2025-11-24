"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Region } from "@/lib/compute/mock-jobs";
import { motion } from "framer-motion";
import { MapPin, Zap, Wind, Cpu } from "lucide-react";

interface RegionMapProps {
  regions: Region[];
  selectedRegion?: string | null;
  onRegionClick?: (regionId: string) => void;
}

export default function RegionMap({ regions, selectedRegion, onRegionClick }: RegionMapProps) {
  const getRegionColor = (carbonIntensity: number) => {
    if (carbonIntensity > 300) return "red";
    if (carbonIntensity > 150) return "yellow";
    return "green";
  };

  const getRegionIcon = (id: string) => {
    switch (id) {
      case "london":
        return MapPin;
      case "scotland":
        return Wind;
      case "cudos":
        return Cpu;
      default:
        return Zap;
    }
  };

  return (
    <Card className="border-0 shadow-lg h-full">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium mb-4">Compute Regions</h3>
        <div className="space-y-4">
          {regions.map((region, index) => {
            const color = getRegionColor(region.carbonIntensity);
            const Icon = getRegionIcon(region.id);
            const isSelected = selectedRegion === region.id;

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onRegionClick?.(region.id)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    color === "red"
                      ? "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                      : color === "yellow"
                        ? "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50"
                        : "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                  }
                  ${isSelected ? "ring-2 ring-offset-2 ring-green-500" : ""}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`h-5 w-5 ${
                        color === "red"
                          ? "text-red-600"
                          : color === "yellow"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    />
                    <h4 className="font-semibold">{region.name}</h4>
                  </div>
                  <Badge
                    variant={
                      color === "red"
                        ? "destructive"
                        : color === "yellow"
                          ? "default"
                          : "default"
                    }
                    className={
                      color === "green"
                        ? "bg-green-600 text-white"
                        : color === "yellow"
                          ? "bg-yellow-600 text-white"
                          : ""
                    }
                  >
                    {region.carbonIntensity} g/kWh
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Energy Price</p>
                    <p className="font-medium">£{region.energyPrice.toFixed(2)}/kWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Renewable Share</p>
                    <p className="font-medium">{region.renewableShare}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">GPU Capacity</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            color === "red"
                              ? "bg-red-500"
                              : color === "yellow"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              ((region.gpuCapacity.total - region.gpuCapacity.available) /
                                region.gpuCapacity.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {region.gpuCapacity.available}/{region.gpuCapacity.total} free
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

