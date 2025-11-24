"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function WalletConnect() {
  const [addr, setAddr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (typeof window === "undefined") return;
      if (window.tronWeb?.ready) {
        setAddr(window.tronWeb.defaultAddress.base58);
      }
    };
    check();
    const t = setInterval(check, 800);
    return () => clearInterval(t);
  }, []);

  const connect = async () => {
    if (typeof window === "undefined") return;
    if (!window.tronLink?.request) {
      alert("Install TronLink and switch to Nile Testnet.");
      return;
    }
    setBusy(true);
    try {
      const res = await window.tronLink.request({ method: "tron_requestAccounts" });
      if (res?.code === 200 && window.tronWeb?.ready) {
        setAddr(window.tronWeb.defaultAddress.base58);
      }
    } finally { setBusy(false); }
  };

  return addr ? (
    <div className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
      {addr.slice(0,6)}…{addr.slice(-4)}
    </div>
  ) : (
    <Button onClick={connect} disabled={busy}>
      {busy ? "Connecting…" : "Connect TronLink"}
    </Button>
  );
}
