"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@/components/nav/NavBar";
import { AlertTriangle, Bell, Zap, Search } from "lucide-react";
import { motion } from "framer-motion";
import { AlertCard } from "@/components/alerts/AlertCard";
import { getAlerts, getAlertCount } from "@/lib/mock-data/index";
import type { Alert } from "@/lib/types";

const FILTERS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "new_competitor", label: "New Competitor" },
  { value: "position_change", label: "Position Change" },
  { value: "budget_spike", label: "Budget Spike" },
  { value: "new_keyword", label: "New Keyword" },
];

export default function AlertsPage() {
  const allAlerts = getAlerts();
  const { total, unread, critical } = getAlertCount();
  const [filter, setFilter] = useState("all");
  const [readState, setReadState] = useState<Set<string>>(
    new Set(allAlerts.filter((a) => a.isRead).map((a) => a.id))
  );

  function markRead(id: string) {
    setReadState((prev) => new Set([...prev, id]));
  }

  const enrichedAlerts: Alert[] = useMemo(
    () =>
      allAlerts.map((a) => ({ ...a, isRead: readState.has(a.id) })),
    [allAlerts, readState]
  );

  const filtered = useMemo(() => {
    return enrichedAlerts.filter((a) => {
      if (filter === "unread") return !a.isRead;
      if (filter === "all") return true;
      return a.type === filter;
    });
  }, [enrichedAlerts, filter]);

  const unreadCount = enrichedAlerts.filter((a) => !a.isRead).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Alert Center
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Intelligence updates from your tracked competitors
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => setReadState(new Set(allAlerts.map((a) => a.id)))}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--accent)" }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Alerts", value: total, icon: Bell, color: "var(--accent)", bg: "var(--accent-soft)", border: "rgba(59,130,246,0.2)" },
            { label: "Unread", value: unreadCount, icon: Search, color: "var(--warning)", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
            { label: "Critical", value: critical, icon: Zap, color: "var(--danger)", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color }}>{value}</div>
                  <div className="text-xs" style={{ color: "var(--text-dim)" }}>{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: filter === value ? "var(--accent-soft)" : "var(--surface)",
                color: filter === value ? "var(--accent)" : "var(--text-secondary)",
                border: `1px solid ${filter === value ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
              }}
            >
              {label}
              {value === "unread" && unreadCount > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: "var(--danger)", color: "white" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Alert list */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-16 flex flex-col items-center gap-3"
            style={{ color: "var(--text-dim)" }}
          >
            <AlertTriangle className="w-10 h-10 opacity-30" />
            <p>No alerts match this filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <AlertCard alert={alert} onMarkRead={markRead} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
