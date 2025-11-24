// src/lib/tron.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}

export const FULLHOST =
  process.env.NEXT_PUBLIC_TRON_FULLHOST || "https://api.nileex.io";
export const EVENTSERVER =
  process.env.NEXT_PUBLIC_TRON_EVENTSERVER || "https://event.nileex.io";

/**
 * Safely load a TronWeb constructor across different module shapes.
 */
async function loadTronWebCtor(): Promise<any> {
  const mod: any = await import("tronweb");
  // Try common export patterns in order
  return (
    mod?.TronWeb ||           // named export
    mod?.default?.TronWeb ||  // default has TronWeb
    mod?.default ||           // default is the constructor
    mod                        // module itself is the constructor
  );
}

/**
 * Prefer injected TronLink if available and ready; otherwise return a read-only TronWeb.
 */
export async function getReadOnlyTronWeb(): Promise<any> {
  if (typeof window !== "undefined") {
    // Prefer injected provider
    const injected = window.tronWeb;
    if (injected?.ready) return injected;
  }
  const TronWebCtor = await loadTronWebCtor();
  return new TronWebCtor({
    fullHost: FULLHOST,
    eventServer: EVENTSERVER,
  });
}

/**
 * Tiny helper to get a contract instance (read-only OK).
 */
export async function getContract(abi: any[], address: string): Promise<any> {
  const tw = await getReadOnlyTronWeb();
  return await tw.contract(abi, address);
}

/**
 * Unit helpers that don’t depend on TronWeb.
 */
export function toWei(amount: string | number, dec = 18): string {
  const v = BigInt(amount.toString());
  const base = BigInt(10) ** BigInt(dec);
  return (v * base).toString();
}

export function fromWei(amount: string | number, dec = 18): string {
  const v = BigInt(amount.toString());
  const base = BigInt(10) ** BigInt(dec);
  const whole = v / base;
  const frac = v % base;
  const fracStr = frac.toString().padStart(dec, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : whole.toString();
}

/**
 * Get the current user's wallet address.
 */
export async function getUserAddress(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const tw = await getReadOnlyTronWeb();
  return tw?.defaultAddress?.base58 || null;
}
