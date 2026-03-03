"use client";

import { AlertTriangle, Info, Zap, Bell, Search, TrendingUp } from "lucide-react";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { formatRelativeTime } from "@/lib/mock-data/index";
import type { Alert } from "@/lib/types";

interface AlertCardProps {
  readonly alert: Alert;
  readonly onMarkRead?: (id: string) => void;
}

function SeverityIcon({ severity }: { readonly severity: Alert["severity"] }) {
  const className =
    severity === "critical"
      ? "text-red-400"
      : severity === "warning"
      ? "text-amber-400"
      : "text-blue-400";

  if (severity === "critical") return <Zap className={`w-4 h-4 ${className}`} />;
  if (severity === "warning") return <AlertTriangle className={`w-4 h-4 ${className}`} />;
  return <Info className={`w-4 h-4 ${className}`} />;
}

function TypeIcon({ type }: { readonly type: Alert["type"] }) {
  const className = "w-3.5 h-3.5";
  if (type === "new_competitor") return <Bell className={className} />;
  if (type === "position_change") return <TrendingUp className={className} />;
  if (type === "new_keyword") return <Search className={className} />;
  return <Zap className={className} />;
}

const typeLabels: Record<Alert["type"], string> = {
  new_competitor: "New Competitor",
  position_change: "Position Change",
  budget_spike: "Budget Spike",
  new_keyword: "New Keyword",
};

export function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  return (
    <div
      className={`card p-4 transition-all ${
        !alert.isRead
          ? "border-[var(--border-hover)] bg-[var(--surface)]"
          : "opacity-70"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            alert.severity === "critical"
              ? "bg-red-500/10"
              : alert.severity === "warning"
              ? "bg-amber-500/10"
              : "bg-blue-500/10"
          }`}
        >
          <SeverityIcon severity={alert.severity} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <SeverityBadge severity={alert.severity} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
              <TypeIcon type={alert.type} />
              {typeLabels[alert.type]}
            </span>
            {!alert.isRead && (
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
            )}
          </div>

          <h3 className="text-sm font-semibold text-[var(--text)] mb-1 leading-snug">
            {alert.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {alert.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-[var(--text-dim)]">
              {formatRelativeTime(alert.createdAt)}
            </span>
            {!alert.isRead && onMarkRead && (
              <button
                onClick={() => onMarkRead(alert.id)}
                className="text-xs text-[var(--accent)] hover:underline transition-colors"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
