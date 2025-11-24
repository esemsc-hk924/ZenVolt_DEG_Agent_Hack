"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import CountUp from "@/components/count-up";

type ActionItem = {
  id: string;
  title: string;
  owner: string;
  due: string; // ISO date
  impact_tCO2e: number;
  abatement_cost_per_t_gbp?: number;
  status: "todo" | "in_progress" | "done";
  evidenceUrl?: string;
  councilDecisionId?: string;
};

// Format date consistently to avoid hydration mismatch
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Parse costRange string (e.g., "£45k–£65k" or "£15k–£25k") to extract average cost per ton
function parseCostRange(costRange: string): number | undefined {
  try {
    // Extract numbers from costRange (e.g., "£45k–£65k" -> [45, 65])
    const matches = costRange.match(/£?(\d+(?:\.\d+)?)k?/g);
    if (!matches || matches.length === 0) return undefined;
    
    const numbers = matches.map(m => {
      const num = parseFloat(m.replace(/£|k/g, ''));
      return m.includes('k') ? num * 1000 : num;
    });
    
    // Return average if range, or single value
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    return Math.round(avg);
  } catch (e) {
    return undefined;
  }
}

// Parse timeline string (e.g., "<90d", "Quarter", "Year") to extract due date
function parseTimeline(timeline: string): string {
  const now = new Date();
  let daysToAdd = 365; // Default to 1 year
  
  if (timeline.includes("<90d") || timeline.includes("90d")) {
    daysToAdd = 90;
  } else if (timeline.includes("Quarter") || timeline.toLowerCase().includes("quarter")) {
    daysToAdd = 90; // 3 months
  } else if (timeline.toLowerCase().includes("year")) {
    daysToAdd = 365;
  } else if (timeline.match(/\d+d/)) {
    const match = timeline.match(/(\d+)d/);
    if (match) daysToAdd = parseInt(match[1]);
  }
  
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  return dueDate.toISOString().split('T')[0];
}

// Extract impact_tCO2e from notes (look for numbers with tCO2e, tCO2, or similar)
function extractImpactFromNotes(notes: string | undefined): number {
  if (!notes) return 0;
  
  // Look for patterns like "180 tCO2e", "420 tCO2", "15-20%", etc.
  // Try to find explicit tCO2e mentions first
  const tco2eMatch = notes.match(/(\d+(?:\.\d+)?)\s*tCO2e/i);
  if (tco2eMatch) {
    return parseFloat(tco2eMatch[1]);
  }
  
  // Try tCO2
  const tco2Match = notes.match(/(\d+(?:\.\d+)?)\s*tCO2/i);
  if (tco2Match) {
    return parseFloat(tco2Match[1]);
  }
  
  // Try to find percentage reductions and estimate (rough heuristic)
  const pctMatch = notes.match(/(\d+(?:\.\d+)?)%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    // Rough estimate: 1% reduction ≈ 50-100 tCO2e for a typical organization
    // This is a placeholder - in real implementation, would need org context
    return Math.round(pct * 10); // Rough estimate
  }
  
  return 0;
}

// Parse actions from council decisions stored in localStorage
function parseActionsFromCouncilHistory(): ActionItem[] {
  try {
    const historyStr = localStorage.getItem("council_history");
    if (!historyStr) return [];
    
    const history = JSON.parse(historyStr);
    const actions: ActionItem[] = [];
    
    history.forEach((item: any, idx: number) => {
      // Extract actions from decision if available
      if (item.decision && Array.isArray(item.decision.actions)) {
        item.decision.actions.forEach((action: any, actionIdx: number) => {
          const costPerTon = parseCostRange(action.costRange || "");
          const dueDate = parseTimeline(action.timeline || "Year");
          const impact = extractImpactFromNotes(action.notes);
          
          actions.push({
            id: `action-${item.id || idx}-${actionIdx}`,
            title: action.title || "Untitled Action",
            owner: action.owner || "TBD",
            due: dueDate,
            impact_tCO2e: impact,
            abatement_cost_per_t_gbp: costPerTon,
            status: "todo",
            councilDecisionId: item.id,
          });
        });
      }
    });
    
    return actions;
  } catch (e) {
    console.error("Failed to parse council history:", e);
    return [];
  }
}

// Mocked consultant-level actions (fallback)
const MOCK_ACTIONS: ActionItem[] = [
  {
    id: "a1",
    title: "Retro-commission BMS in Lecture Centre A",
    owner: "Estates",
    due: "2025-12-15",
    impact_tCO2e: 180,
    abatement_cost_per_t_gbp: 22,
    status: "in_progress",
    evidenceUrl: "#",
  },
  {
    id: "a2",
    title: "Supplier engagement: Top 10 IT vendors (scope 3 factor update)",
    owner: "Procurement",
    due: "2026-01-10",
    impact_tCO2e: 420,
    abatement_cost_per_t_gbp: 35,
    status: "todo",
    evidenceUrl: "#",
  },
  {
    id: "a3",
    title: "Fleet idling reduction policy roll-out",
    owner: "Transport",
    due: "2025-12-05",
    impact_tCO2e: 75,
    abatement_cost_per_t_gbp: 12,
    status: "todo",
    evidenceUrl: "#",
  },
];

export default function ActionQueue() {
  const [actions, setActions] = useState<ActionItem[]>(MOCK_ACTIONS);
  const [showAllModal, setShowAllModal] = useState(false);

  useEffect(() => {
    // Try to load actions from council history
    const councilActions = parseActionsFromCouncilHistory();
    if (councilActions.length > 0) {
      // Prioritize council actions, then add mock actions as fallback
      setActions([...councilActions, ...MOCK_ACTIONS].slice(0, 10));
    } else {
      // Fallback to mock actions if no council history
      setActions(MOCK_ACTIONS);
    }
  }, []);

  const handleViewAll = () => {
    setShowAllModal(true);
  };

  const handleActionClick = (action: ActionItem) => {
    if (action.councilDecisionId) {
      window.location.href = `/council?decision=${action.councilDecisionId}`;
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">AI Council action queue</div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleViewAll}>
            View all
          </Button>
        </div>
        <div className="space-y-3">
          {actions.slice(0, 3).map((a) => (
            <div 
              key={a.id} 
              className={`rounded-xl border bg-background/60 p-3 ${a.councilDecisionId ? "cursor-pointer hover:bg-background/80 transition-colors" : ""}`}
              onClick={() => handleActionClick(a)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${a.status === "done" ? "text-emerald-600" : a.status === "in_progress" ? "text-blue-600" : "text-muted-foreground"}`} />
                  <div className="font-medium">{a.title}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Owner {a.owner} · Due {formatDate(a.due)} · Impact <CountUp value={a.impact_tCO2e} /> tCO2e · {a.abatement_cost_per_t_gbp ? <><CountUp value={a.abatement_cost_per_t_gbp} prefix="£" suffix="/t" /></> : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* View All Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All AI Council Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {actions.map((a) => (
              <div 
                key={a.id} 
                className={`rounded-xl border bg-background/60 p-3 ${a.councilDecisionId ? "cursor-pointer hover:bg-background/80 transition-colors" : ""}`}
                onClick={() => handleActionClick(a)}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${a.status === "done" ? "text-emerald-600" : a.status === "in_progress" ? "text-blue-600" : "text-muted-foreground"}`} />
                    <div className="font-medium">{a.title}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Owner {a.owner} · Due {formatDate(a.due)} · Impact {a.impact_tCO2e} tCO2e · {a.abatement_cost_per_t_gbp ? `£${a.abatement_cost_per_t_gbp}/t` : "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
