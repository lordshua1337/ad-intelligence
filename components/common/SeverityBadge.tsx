"use client";

import type { Alert } from "@/lib/types";

interface SeverityBadgeProps {
  readonly severity: Alert["severity"];
  readonly showLabel?: boolean;
}

const config: Record<Alert["severity"], { label: string; className: string }> = {
  info: {
    label: "Info",
    className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  warning: {
    label: "Warning",
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
};

export function SeverityBadge({ severity, showLabel = true }: SeverityBadgeProps) {
  const { label, className } = config[severity];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          severity === "critical"
            ? "bg-red-400"
            : severity === "warning"
            ? "bg-amber-400"
            : "bg-blue-400"
        }`}
      />
      {showLabel && label}
    </span>
  );
}
