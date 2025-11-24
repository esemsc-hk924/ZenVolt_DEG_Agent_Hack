"use client";

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name.split(/\s+/).map(p => p[0]?.toUpperCase()).slice(0,2).join("");
  return (
    <div
      className={"inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 font-semibold " + className}
      aria-label={name}
    >
      {initials || "DR"}
    </div>
  );
}
