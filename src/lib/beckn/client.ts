// src/lib/beckn/client.ts

/**
 * Beckn client helper for sending actions to a Beckn gateway.
 * Fixes TS build error by guaranteeing headers are valid HeadersInit.
 */

export type BecknAction =
  | "search"
  | "select"
  | "init"
  | "confirm"
  | "status"
  | string;

export type BecknEnvelope = {
  context: Record<string, any>;
  message: Record<string, any>;
};

/**
 * Optional request signer.
 * MUST return only string header values.
 * If you already have your own signing logic, keep it but ensure the return type is Record<string, string>.
 */
export function signRequest(_envelope: BecknEnvelope): Record<string, string> {
  const token = process.env.BECKN_AUTH_TOKEN;

  // No auth configured → no extra headers
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Send a Beckn action to the gateway.
 */
export async function sendBecknAction(
  action: BecknAction,
  envelope: BecknEnvelope,
  opts?: {
    gatewayUrl?: string;
    timeoutMs?: number;
  }
) {
  const gateway =
    opts?.gatewayUrl ||
    process.env.BECKN_GATEWAY_URL ||
    process.env.NEXT_PUBLIC_BECKN_GATEWAY_URL;

  if (!gateway) {
    throw new Error(
      "BECKN_GATEWAY_URL is not set (env: BECKN_GATEWAY_URL or NEXT_PUBLIC_BECKN_GATEWAY_URL)."
    );
  }

  const url = gateway.endsWith("/")
    ? `${gateway}${action}`
    : `${gateway}/${action}`;

  // ---- TS-safe headers (no undefined union) ----
  const signed = signRequest(envelope);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...signed, // safe because signed is Record<string,string>
  };

  // Optional timeout support
  const controller = new AbortController();
  const timeout =
    opts?.timeoutMs != null
      ? setTimeout(() => controller.abort(), opts.timeoutMs)
      : null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(envelope),
      signal: controller.signal,
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        `Beckn gateway error (${res.status}): ${
          data?.error || data?.message || text || "Unknown error"
        }`
      );
    }

    return { ok: true as const, status: res.status, data };
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

/**
 * Convenience wrappers (optional)
 * Use if you call these actions directly.
 */
export const beckn = {
  search: (env: BecknEnvelope, opts?: any) => sendBecknAction("search", env, opts),
  select: (env: BecknEnvelope, opts?: any) => sendBecknAction("select", env, opts),
  init: (env: BecknEnvelope, opts?: any) => sendBecknAction("init", env, opts),
  confirm: (env: BecknEnvelope, opts?: any) => sendBecknAction("confirm", env, opts),
  status: (env: BecknEnvelope, opts?: any) => sendBecknAction("status", env, opts),
};

export default sendBecknAction;
