"use client";

import { useState } from "react";
import { useBecknEvents } from "@/lib/hooks/useBecknEvents";
import clsx from "clsx";
import { ChevronUp, ChevronDown } from "lucide-react";

const STEP_ORDER = [
  "search",
  "on_search",
  "select",
  "on_select",
  "init",
  "on_init",
  "confirm",
  "on_confirm",
  "status",
  "on_status",
];

function stepLabel(step: string) {
  return step.replace("on_", "ON-").toUpperCase();
}

export default function BecknViewer() {
  const [open, setOpen] = useState(true);
  const { events, isLoading, error } = useBecknEvents();

  // normalize actions (force string[] so TS knows types)
  const actions: string[] = events
    .map((e: any) => e.action)
    .filter((a: any): a is string => typeof a === "string");

  const txnIds = Array.from(
    new Set(events.map((e: any) => e.transactionId))
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
      >
        <div className="text-sm font-medium">
          Beckn Lifecycle Trace (Real Network)
        </div>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {open && (
        <div className="mt-3">
          {isLoading && (
            <div className="text-xs text-neutral-400">
              Loading Beckn events…
            </div>
          )}

          {error && (
            <div className="text-xs text-rose-300">
              Error loading Beckn events. Check prisma + on_event route.
            </div>
          )}

          {/* Step badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {STEP_ORDER.map((step) => {
              const seen = actions.some((a) => a.includes(step));
              return (
                <span
                  key={step}
                  className={clsx(
                    "px-2 py-1 rounded-full text-xs border",
                    seen
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-200"
                      : "bg-neutral-800 border-neutral-700 text-neutral-400"
                  )}
                >
                  {stepLabel(step)}
                </span>
              );
            })}
          </div>

          {/* Transactions */}
          <div className="text-xs text-neutral-400 mb-2">
            Active transactions: {txnIds.length || 0}
          </div>

          {/* Event list */}
          <div className="max-h-[180px] overflow-auto pr-1 space-y-2">
            {events.map((e: any) => (
              <div
                key={e.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-200">
                    {stepLabel(String(e.action ?? ""))}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 mt-1">
                  txn:{" "}
                  <span className="text-neutral-300">
                    {e.transactionId}
                  </span>
                </div>

                {/* light peek into message */}
                <details className="mt-1">
                  <summary className="cursor-pointer text-[11px] text-neutral-400">
                    view payload
                  </summary>
                  <pre className="mt-1 text-[10px] whitespace-pre-wrap text-neutral-300">
                    {JSON.stringify(e.message, null, 2)}
                  </pre>
                </details>
              </div>
            ))}

            {!events.length && !isLoading && (
              <div className="text-xs text-neutral-500">
                No Beckn callbacks yet. Trigger orchestration to generate real events.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
