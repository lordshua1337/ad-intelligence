"use client";

import type { Ad } from "@/lib/types";

interface SourceBadgeProps {
  readonly source: Ad["source"];
}

const config: Record<Ad["source"], { label: string; className: string }> = {
  google: {
    label: "Google",
    className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  meta: {
    label: "Meta",
    className: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  },
  native: {
    label: "Native",
    className: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  },
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const { label, className } = config[source];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
