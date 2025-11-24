"use client";

import Image from "next/image";
import { getProviderAccent, getProviderInitials, getProviderLogoPath } from "@/lib/marketplace/provider-logos";
import { useMemo, useState } from "react";

type Size = "sm" | "md" | "lg";

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ProviderLogoBadge({ provider, size = "md" }: { provider: string; size?: Size }) {
  const accent = getProviderAccent(provider);
  const logoPath = getProviderLogoPath(provider);
  const [logoError, setLogoError] = useState(false);
  const showLogo = !!logoPath && !logoError;

  const dims = useMemo(() => {
    switch (size) {
      case "lg":
        return { outer: 56, inner: 48, square: 32 };
      case "sm":
        return { outer: 48, inner: 42, square: 28 };
      case "md":
      default:
        return { outer: 52, inner: 46, square: 30 };
    }
  }, [size]);

  return (
    <div
      className="flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ width: dims.outer, height: dims.outer, backgroundColor: hexToRgba(accent.bg, 0.18) }}
      aria-label={provider}
      title={provider}
    >
      <div
        className="rounded-full flex items-center justify-center"
        style={{ 
          width: dims.inner, 
          height: dims.inner, 
          backgroundColor: hexToRgba(accent.ring, 0.35),
          border: `1.5px solid ${hexToRgba(accent.ring, 0.5)}`
        }}
      >
        {showLogo ? (
          <div
            className="relative rounded-md overflow-hidden"
            style={{ width: dims.square, height: dims.square }}
          >
            <Image
              src={logoPath!}
              alt={provider}
              fill
              className="object-contain"
              onError={() => setLogoError(true)}
            />
          </div>
        ) : (
          <div
            className="rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            style={{ width: dims.square, height: dims.square }}
          >
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              {getProviderInitials(provider)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


