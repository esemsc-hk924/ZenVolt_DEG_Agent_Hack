"use client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Verdict({
  data,
}: {
  data: {
    title?: string;
    rationale?: string;
    actions?: { title: string; owner: string; effort: string; impact: string; costRange: string; timeline: string; notes?: string }[];
    risks?: string[];
    metrics?: string[];
  };
}) {
  const actions = Array.isArray(data.actions) ? data.actions : [];
  const risks = Array.isArray(data.risks) ? data.risks : [];
  const metrics = Array.isArray(data.metrics) ? data.metrics : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <Card className="p-5 lg:col-span-3">
        <div className="text-lg font-semibold">{data.title || "Council Decision"}</div>
        <p className="text-sm text-muted-foreground mt-1">{data.rationale || "—"}</p>
      </Card>

      <div className="lg:col-span-2 space-y-3">
        {actions.map((a, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">
                  Owner {a.owner} • Effort {a.effort} • Impact {a.impact} • Cost {a.costRange} • Timeline {a.timeline}
                </div>
                {a.notes && <div className="text-sm mt-1">{a.notes}</div>}
              </div>
            </div>
          </Card>
        ))}
        {actions.length === 0 && <Card className="p-4 text-sm text-muted-foreground">No actions.</Card>}
      </div>

      <div className="space-y-3">
        <Card className="p-4">
          <div className="font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Risks</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {risks.map((r, i) => <li key={i}>{r}</li>)}
            {risks.length === 0 && <li className="text-muted-foreground">None recorded.</li>}
          </ul>
        </Card>

        <Card className="p-4">
          <div className="font-medium flex items-center gap-2"><Target className="h-4 w-4" /> Metrics</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {metrics.map((m, i) => <li key={i}>{m}</li>)}
            {metrics.length === 0 && <li className="text-muted-foreground">None recorded.</li>}
          </ul>
        </Card>
      </div>
    </motion.div>
  );
}
