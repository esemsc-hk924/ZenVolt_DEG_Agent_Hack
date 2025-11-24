import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({
  label, value, hint, right, tone,
}: { 
  label: string; 
  value: React.ReactNode; 
  hint?: string | React.ReactNode; 
  right?: React.ReactNode; 
  tone?: "ok" | "warn";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className={cn(
            "mt-1 text-2xl font-semibold",
            tone === "ok" && "text-emerald-600",
            tone === "warn" && "text-amber-600"
          )}>{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {right}
      </div>
    </Card>
  );
}
