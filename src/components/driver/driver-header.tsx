"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export function DriverHeader({
  name, driverId, period, ecoScore, estSavingPct,
}: { name: string; driverId: string; period: string; ecoScore: number; estSavingPct: number; }) {
  return (
    <Card className="border-0 shadow-lg p-4 md:p-6">
      <div className="flex items-center gap-4">
        <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Avatar name={name} />
        </motion.div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl md:text-2xl font-semibold">{name}</h2>
            <Badge variant="secondary">ID: {driverId}</Badge>
            <span className="text-sm text-muted-foreground">Period: {period}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-600 hover:bg-emerald-600">EcoScore {ecoScore}</Badge>
            <Badge variant="outline">Potential saving ~{estSavingPct}%</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
