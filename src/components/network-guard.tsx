"use client";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

function detectHost(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const w: any = window;
    return (
      w?.tronWeb?.fullNode?.host ||
      w?.tronWeb?._fullNode?.host ||
      w?.tronWeb?.eventServer?.host ||
      null
    );
  } catch {
    return null;
  }
}

export default function NetworkGuard() {
  const [ok, setOk] = useState(true);
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      const h = detectHost();
      setHost(h);
      // Nile endpoints usually include "nileex"
      const onNile = typeof h === "string" && h.includes("nile");
      setOk(onNile || h === null); // ok when not connected yet
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (ok) return null;

  return (
    <div className="bg-amber-50 text-amber-900 border-b border-amber-200 px-4 py-2 text-sm flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <div>
        You are connected to <span className="font-mono">{host}</span>. Please switch TronLink to <b>Nile Testnet</b>.
      </div>
    </div>
  );
}
