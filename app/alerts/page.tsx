"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { NavBar } from "@/components/nav/NavBar";
import { AlertTriangle, Bell, Zap, Search, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { AlertCard } from "@/components/alerts/AlertCard";
import type { Alert } from "@/lib/types";

const ALERTS_STORAGE_KEY = "ad-intel-alerts";

const FILTERS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "new_competitor", label: "New Competitor" },
  { value: "position_change", label: "Position Change" },
  { value: "budget_spike", label: "Budget Spike" },
  { value: "new_keyword", label: "New Keyword" },
];

function loadAlerts(): Alert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: Alert[]): void {
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
}

export default function AlertsPage() {
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAllAlerts(loadAlerts());
  }, []);

  const generateAlerts = useCallback(async () => {
    setGenerating(true);
    setError(null);

    try {
      // Get tracked competitors from localStorage
      const raw = localStorage.getItem("ad-intel-custom-competitors");
      const competitors = raw ? JSON.parse(raw) : [];

      if (competitors.length === 0) {
        setError("No tracked competitors. Go to the Dashboard and scan some domains first.");
        setGenerating(false);
        return;
      }

      // Build competitor data for the API
      const competitorInputs = competitors
        .filter((c: Record<string, unknown>) => c.enrichmentStatus === "complete" && c.enrichment)
        .map((c: Record<string, unknown>) => {
          const e = c.enrichment as Record<string, unknown>;
          return {
            name: c.name,
            domain: c.domain,
            techStack: ((e.techStack as Array<{ name: string }>) ?? []).map((t) => t.name),
            adPixels: ((e.adPixels as Array<{ platform: string; detected: boolean }>) ?? [])
              .filter((p) => p.detected)
              .map((p) => p.platform),
            analytics: ((e.analytics as Array<{ name: string; detected: boolean }>) ?? [])
              .filter((a) => a.detected)
              .map((a) => a.name),
            performanceScore: (e.pageSpeed as Record<string, unknown>)?.performanceScore,
            siteAge: (e.siteAge as Record<string, unknown>)?.firstSeen
              ? String((e.siteAge as Record<string, unknown>).firstSeen).substring(0, 4)
              : undefined,
          };
        });

      if (competitorInputs.length === 0) {
        setError("No enriched competitors found. Scan your tracked domains first.");
        setGenerating(false);
        return;
      }

      const res = await fetch("/api/alerts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitors: competitorInputs }),
      });

      if (!res.ok) {
        throw new Error("Alert generation failed");
      }

      const data = await res.json();
      const newAlerts: Alert[] = (data.alerts ?? []).map(
        (a: Record<string, unknown>) => ({
          ...a,
          competitorId: a.competitorDomain,
        })
      );

      // Merge with existing alerts (don't duplicate)
      const existing = loadAlerts();
      const existingTitles = new Set(existing.map((a) => a.title));
      const unique = newAlerts.filter((a) => !existingTitles.has(a.title));
      const merged = [...unique, ...existing];

      saveAlerts(merged);
      setAllAlerts(merged);
    } catch {
      setError("Failed to generate alerts. Try again.");
    } finally {
      setGenerating(false);
    }
  }, []);

  function markRead(id: string) {
    const updated = allAlerts.map((a) =>
      a.id === id ? { ...a, isRead: true } : a
    );
    setAllAlerts(updated);
    saveAlerts(updated);
  }

  function markAllRead() {
    const updated = allAlerts.map((a) => ({ ...a, isRead: true }));
    setAllAlerts(updated);
    saveAlerts(updated);
  }

  const filtered = useMemo(() => {
    return allAlerts.filter((a) => {
      if (filter === "unread") return !a.isRead;
      if (filter === "all") return true;
      return a.type === filter;
    });
  }, [allAlerts, filter]);

  const unreadCount = allAlerts.filter((a) => !a.isRead).length;
  const criticalCount = allAlerts.filter((a) => a.severity === "critical").length;

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
              Intelligence updates generated from your tracked competitors
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateAlerts}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                color: "white",
              }}
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {generating ? "Analyzing..." : "Scan for Alerts"}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--accent)" }}
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="p-4 rounded-lg text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#EF4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Alerts",
              value: allAlerts.length,
              icon: Bell,
              color: "var(--accent)",
              bg: "var(--accent-soft)",
              border: "rgba(59,130,246,0.2)",
            },
            {
              label: "Unread",
              value: unreadCount,
              icon: Search,
              color: "var(--warning)",
              bg: "rgba(245,158,11,0.1)",
              border: "rgba(245,158,11,0.2)",
            },
            {
              label: "Critical",
              value: criticalCount,
              icon: Zap,
              color: "var(--danger)",
              bg: "rgba(239,68,68,0.1)",
              border: "rgba(239,68,68,0.2)",
            },
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
                  <div className="text-xl font-bold" style={{ color }}>
                    {value}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {label}
                  </div>
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
                background:
                  filter === value ? "var(--accent-soft)" : "var(--surface)",
                color:
                  filter === value
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                border: `1px solid ${
                  filter === value
                    ? "rgba(59,130,246,0.3)"
                    : "var(--border)"
                }`,
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
        {allAlerts.length === 0 ? (
          <div
            className="text-center py-16 flex flex-col items-center gap-3"
            style={{ color: "var(--text-dim)" }}
          >
            <AlertTriangle className="w-10 h-10 opacity-30" />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No alerts yet
            </p>
            <p className="text-xs">
              Track competitors on the Dashboard, then click &quot;Scan for
              Alerts&quot; to generate intelligence alerts.
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
