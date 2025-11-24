"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import demo from "@/data/org_demo.json";
import CountUp from "@/components/count-up";
import { cn } from "@/lib/utils";

type Initiative = {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Planned" | "On Hold";
  capex_gbp: number;
  opex_gbp: number;
  est_saving_gbp: number;
  est_saving_t: number;
  payback_months: number;
  start: string;
};

const STORAGE_KEY = "zenvolt_initiatives";

function loadInitiatives(): Initiative[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load initiatives:", e);
  }
  // Fallback to demo data
  return (demo.initiatives as any[]) || [];
}

function saveInitiatives(initiatives: Initiative[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initiatives));
  } catch (e) {
    console.error("Failed to save initiatives:", e);
  }
}

export default function InitiativesTable() {
  // Initialize with demo data (consistent between server and client)
  const [rows, setRows] = useState<Initiative[]>(() => {
    // Always use demo data for initial render to match SSR
    return (demo.initiatives as any[]) || [];
  });
  const [editing, setEditing] = useState<Initiative | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Initiative>>({
    name: "",
    category: "",
    status: "Planned",
    capex_gbp: 0,
    opex_gbp: 0,
    est_saving_gbp: 0,
    est_saving_t: 0,
    payback_months: 0,
    start: new Date().toISOString().split('T')[0],
  });

  // Load from localStorage only on client side after mount
  useEffect(() => {
    const stored = loadInitiatives();
    if (stored.length > 0) {
      setRows(stored);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    saveInitiatives(rows);
  }, [rows]);

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      name: "",
      category: "",
      status: "Planned",
      capex_gbp: 0,
      opex_gbp: 0,
      est_saving_gbp: 0,
      est_saving_t: 0,
      payback_months: 0,
      start: new Date().toISOString().split('T')[0],
    });
    setShowDialog(true);
  };

  const handleEdit = (initiative: Initiative) => {
    setEditing(initiative);
    setFormData(initiative);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this initiative?")) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      alert("Please fill in name and category");
      return;
    }

    const invest = (formData.capex_gbp || 0) + (formData.opex_gbp || 0);
    const payback = invest && formData.est_saving_gbp ? Math.round((invest / formData.est_saving_gbp) * 12) : 0;

    const initiative: Initiative = {
      id: editing?.id || `init-${Date.now()}`,
      name: formData.name!,
      category: formData.category!,
      status: formData.status || "Planned",
      capex_gbp: formData.capex_gbp || 0,
      opex_gbp: formData.opex_gbp || 0,
      est_saving_gbp: formData.est_saving_gbp || 0,
      est_saving_t: formData.est_saving_t || 0,
      payback_months: payback,
      start: formData.start || new Date().toISOString().split('T')[0],
    };

    if (editing) {
      setRows(rows.map(r => r.id === editing.id ? initiative : r));
    } else {
      setRows([...rows, initiative]);
    }

    setShowDialog(false);
    setEditing(null);
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditing(null);
  };

  return (
    <>
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Initiatives & ROI</div>
          <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground">
          {rows.length ? `${rows.length} initiatives` : "No initiatives"}
            </div>
            <Button size="sm" variant="outline" onClick={handleAdd} className="rounded-full">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
        </div>
      </div>
      <div className={cn("overflow-x-auto transition-all duration-500", showDialog && "opacity-40 blur-sm pointer-events-none")}>
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="py-2 pr-4">Initiative</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">CapEx</th>
              <th className="py-2 pr-4">OpEx</th>
              <th className="py-2 pr-4">Est. Savings (£)</th>
              <th className="py-2 pr-4">Est. tCO₂e</th>
              <th className="py-2 pr-4">Payback</th>
              <th className="py-2 pr-4">ROI</th>
              <th className="py-2 pr-4">Start</th>
                <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                  <td className="py-4 text-muted-foreground" colSpan={11}>
                    No initiatives yet. Click "Add" to create one.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const invest = (r.capex_gbp || 0) + (r.opex_gbp || 0);
                const roi = invest ? (r.est_saving_gbp / invest) * 100 : 0;
                const statusBadge =
                  r.status === "Active"
                    ? "bg-emerald-600/10 text-emerald-700"
                    : r.status === "Planned"
                    ? "bg-blue-600/10 text-blue-700"
                    : "bg-amber-600/10 text-amber-700";
                return (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 pr-4 font-medium">{r.name}</td>
                    <td className="py-2 pr-4">{r.category}</td>
                    <td className="py-2 pr-4">
                      <Badge className={statusBadge}>{r.status}</Badge>
                    </td>
                      <td className="py-2 pr-4">£<CountUp value={r.capex_gbp || 0} /></td>
                      <td className="py-2 pr-4">£<CountUp value={r.opex_gbp || 0} /></td>
                      <td className="py-2 pr-4">£<CountUp value={r.est_saving_gbp || 0} /></td>
                      <td className="py-2 pr-4"><CountUp value={r.est_saving_t || 0} /></td>
                      <td className="py-2 pr-4"><CountUp value={r.payback_months || 0} /> mo</td>
                      <td className="py-2 pr-4"><CountUp value={roi} decimals={0} suffix="%" /></td>
                    <td className="py-2 pr-4">{r.start}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(r)}
                            className="h-6 w-6 p-0"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(r.id)}
                            className="h-6 w-6 p-0 text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Reveal Panel - Slides up from bottom of viewport */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          showDialog ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div
          className="mx-auto max-w-xl rounded-t-2xl bg-zinc-900/75 dark:bg-zinc-950/85 backdrop-blur-lg text-zinc-50 p-6 space-y-4 border-t border-zinc-700/50"
          style={{
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
        {showDialog && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit Initiative" : "Add New Initiative"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-zinc-300">Name *</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., LED Lighting Retrofit"
                className="bg-zinc-800/50 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-zinc-300">Category *</label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Energy Efficiency"
                className="bg-zinc-800/50 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-zinc-300">Status</label>
              <select
                value={formData.status || "Planned"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 text-zinc-50 px-3 py-2 text-sm"
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-zinc-300">CapEx (£)</label>
                <Input
                  type="number"
                  value={formData.capex_gbp || 0}
                  onChange={(e) => setFormData({ ...formData, capex_gbp: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-zinc-300">OpEx (£)</label>
                <Input
                  type="number"
                  value={formData.opex_gbp || 0}
                  onChange={(e) => setFormData({ ...formData, opex_gbp: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-zinc-300">Est. Savings (£)</label>
                <Input
                  type="number"
                  value={formData.est_saving_gbp || 0}
                  onChange={(e) => setFormData({ ...formData, est_saving_gbp: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-zinc-300">Est. tCO₂e</label>
                <Input
                  type="number"
                  value={formData.est_saving_t || 0}
                  onChange={(e) => setFormData({ ...formData, est_saving_t: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-zinc-300">Start Date</label>
              <Input
                type="date"
                value={formData.start || ""}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-700/50">
            <Button variant="outline" onClick={handleClose} className="border-zinc-700 text-zinc-300 hover:text-zinc-50">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-zinc-50 text-zinc-900 hover:bg-zinc-100">
              {editing ? "Save Changes" : "Add Initiative"}
            </Button>
          </div>
          </>
        )}
        </div>
      </div>
    </Card>
    </>
  );
}
