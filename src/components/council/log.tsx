"use client";
import { Card } from "@/components/ui/card";

function fmt(ts?: number) {
  const d = ts ? new Date(ts) : new Date();
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DebateLog({
  rows,
}: {
  rows: { id: string; role: string; content: string; ts?: number }[];
}) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border p-3 bg-background">
            <div className="text-xs text-muted-foreground flex items-center justify-between mb-1">
              <span>{r.role}</span>
              <span>{fmt(r.ts)}</span>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{r.content}</div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-sm text-muted-foreground">No messages yet.</div>
        )}
      </div>
    </Card>
  );
}
