"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ComputeJob } from "@/lib/compute/mock-jobs";
import { motion } from "framer-motion";
import { Clock, Zap, MapPin, TrendingDown } from "lucide-react";

function statusColor(status: ComputeJob["status"]) {
  switch (status) {
    case "queued":
      return "bg-yellow-600";
    case "running":
      return "bg-emerald-600";
    case "deferred":
      return "bg-rose-600";
    case "shifted":
      return "bg-blue-600";
    case "done": // ✅ was "completed"
      return "bg-slate-600";
    default:
      return "bg-slate-400";
  }
}

export default function JobQueue({ jobs }: { jobs: ComputeJob[] }) {
  return (
    <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Job Queue</h2>
          <Badge variant="secondary" className="text-xs">
            {jobs.length} jobs
          </Badge>
        </div>

        <div className="space-y-2">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/60 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs text-neutral-500">
                  {job.id}
                </div>

                <div
                  className={`px-2 py-0.5 text-[10px] rounded-full text-white ${statusColor(
                    job.status
                  )}`}
                >
                  {job.status.toUpperCase()}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                <div className="flex items-center gap-1">
                  <Zap size={12} />
                  {job.energyKwh} kWh
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {job.windowMins} min
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown size={12} />
                  deadline {job.deadlineMins}m
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {job.region}
                </div>
              </div>
            </motion.div>
          ))}

          {!jobs.length && (
            <div className="text-xs text-neutral-500">
              No jobs queued yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
