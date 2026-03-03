"use client";

import { useState, useMemo } from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { CompetitorCard } from "@/components/dashboard/CompetitorCard";
import { getCompetitors } from "@/lib/mock-data/index";

const INDUSTRIES = ["All", "SaaS", "Fintech", "E-commerce", "Health"];

export default function DashboardPage() {
  const competitors = getCompetitors();
  const [query, setQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return competitors.filter((c) => {
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q);
      const matchesIndustry =
        activeIndustry === "All" ||
        c.industry.toLowerCase().includes(activeIndustry.toLowerCase());
      return matchesQuery && matchesIndustry;
    });
  }, [competitors, query, activeIndustry]);

  const totalBudget = competitors.reduce((s, c) => s + c.monthlyBudgetEstimate, 0);
  const totalAds = competitors.reduce((s, c) => s + c.activeAdCount, 0);

  function formatBig(n: number): string {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${Math.round(n / 1000)}K`;
    return `$${n}`;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Competitor Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Tracking {competitors.length} competitors across {totalAds} active ads
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Competitors", value: competitors.length.toString(), color: "var(--accent)" },
          { label: "Active Ads", value: totalAds.toString(), color: "var(--accent-violet)" },
          { label: "Est. Monthly Spend", value: formatBig(totalBudget), color: "var(--success)" },
          { label: "Channels", value: "3", color: "var(--warning)" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="card p-4"
          >
            <div className="text-xl font-bold mb-0.5" style={{ color }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-dim)" }}
          />
          <input
            type="text"
            placeholder="Search competitors by name, domain, or industry..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-dim)" }} />
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background:
                  activeIndustry === ind ? "var(--accent-soft)" : "var(--surface)",
                color:
                  activeIndustry === ind ? "var(--accent)" : "var(--text-secondary)",
                border: `1px solid ${
                  activeIndustry === ind
                    ? "rgba(59,130,246,0.3)"
                    : "var(--border)"
                }`,
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Competitors grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--text-dim)" }}
        >
          No competitors match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((competitor, i) => (
            <motion.div
              key={competitor.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <CompetitorCard competitor={competitor} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
