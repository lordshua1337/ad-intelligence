"use client";

import type { Ad } from "@/lib/types";

interface StatusBadgeProps {
  readonly status: Ad["status"];
}

const config: Record<Ad["status"], { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  paused: {
    label: "Paused",
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  ended: {
    label: "Ended",
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "active"
            ? "bg-emerald-400"
            : status === "paused"
            ? "bg-amber-400"
            : "bg-red-400"
        } ${status === "active" ? "animate-pulse" : ""}`}
      />
      {label}
    </span>
  );
}
