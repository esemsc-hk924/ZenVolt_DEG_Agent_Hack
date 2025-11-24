"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import orgDemo from "@/data/org_demo.json";

type Row = {
  dataHash: string;
  savedKg: number;
  category: string;
  orgId: string;
  model: string;
  time: number;
  uri: string;
  verified: boolean;
};

function isVerified(model: string, uri: string) {
  const m = (model || "").toLowerCase();
  const u = (uri || "").toLowerCase();
  return m.includes("verified") || /[?&]verified=1\b/.test(u) || u.includes("#verified");
}

export default function OrgRecentAtts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  const fetchRows = async () => {
    setBusy(true);
    try {
      const src = (orgDemo.attestations || []) as any[];
      const mapped: Row[] = src
        .slice(-50)
        .reverse()
        .map((a) => ({
          dataHash: String(a.dataHash),
          uri: String(a.uri || ""),
          savedKg: Number(a.savedKg || 0),
          orgId: String(a.orgId || ""),
          category: String(a.category || "scope3"),
          model: String(a.modelVersion || ""),
          time: Number(a.timestamp || 0),
          verified: isVerified(String(a.modelVersion || ""), String(a.uri || ""))
        }));
      setRows(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { fetchRows(); }, []);

  const totalSaved = useMemo(() => rows.reduce((acc, r) => acc + r.savedKg, 0), [rows]);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Recent Scope 3 PRE Attestations</div>
          <div className="text-xs text-muted-foreground">
            {rows.length ? `${rows.length} records · total saved ${totalSaved} kg` : "No data yet"}
          </div>
        </div>
        <Button size="sm" onClick={fetchRows} disabled={busy}>
          {busy ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="py-2 pr-4">Saved (kg)</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Org (hash)</th>
              <th className="py-2 pr-4">Model</th>
              <th className="py-2 pr-4">Verified</th>
              <th className="py-2 pr-4">Evidence</th>
              <th className="py-2 pr-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="py-4 text-muted-foreground" colSpan={7}>No data yet.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.dataHash} className="border-t">
                <td className="py-2 pr-4 font-medium">{r.savedKg.toLocaleString()}</td>
                <td className="py-2 pr-4 capitalize">{r.category.replace('_', ' ')}</td>
                <td className="py-2 pr-4 font-mono text-xs">{r.orgId.slice(0,12)}…</td>
                <td className="py-2 pr-4">{r.model || "—"}</td>
                <td className="py-2 pr-4">
                  {r.verified ? (
                    <Badge className="bg-emerald-600/10 text-emerald-700">Verified</Badge>
                  ) : (
                    <Badge variant="secondary">Non-verified</Badge>
                  )}
                </td>
                <td className="py-2 pr-4">
                  {r.uri ? (
                    <a className="text-blue-600 hover:underline" href={r.uri} target="_blank" rel="noreferrer">view</a>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="py-2 pr-4 text-xs">
                  {r.time ? new Date(r.time * 1000).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
