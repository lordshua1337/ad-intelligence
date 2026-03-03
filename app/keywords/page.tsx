"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@/components/nav/NavBar";
import { Search, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getKeywords } from "@/lib/mock-data/index";
import type { Keyword } from "@/lib/types";

const INTENTS: Array<{ value: Keyword["intent"] | "all"; label: string }> = [
  { value: "all", label: "All Intents" },
  { value: "commercial", label: "Commercial" },
  { value: "transactional", label: "Transactional" },
  { value: "informational", label: "Informational" },
  { value: "navigational", label: "Navigational" },
];

const COMPETITION_LEVELS: Array<{ value: Keyword["competitionLevel"] | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

type SortKey = "keyword" | "searchVolume" | "cpcAvg" | "competitionLevel";
type SortDir = "asc" | "desc";

const intentColors: Record<Keyword["intent"], string> = {
  commercial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  transactional: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  informational: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  navigational: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const competitionColors: Record<Keyword["competitionLevel"], string> = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

export default function KeywordsPage() {
  const keywords = getKeywords();
  const [query, setQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState<Keyword["intent"] | "all">("all");
  const [competitionFilter, setCompetitionFilter] = useState<Keyword["competitionLevel"] | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("searchVolume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return keywords
      .filter((k) => {
        if (q && !k.keyword.toLowerCase().includes(q)) return false;
        if (intentFilter !== "all" && k.intent !== intentFilter) return false;
        if (competitionFilter !== "all" && k.competitionLevel !== competitionFilter) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        let av: string | number;
        let bv: string | number;
        if (sortKey === "keyword") { av = a.keyword; bv = b.keyword; }
        else if (sortKey === "searchVolume") { av = a.searchVolume; bv = b.searchVolume; }
        else if (sortKey === "cpcAvg") { av = a.cpcAvg; bv = b.cpcAvg; }
        else {
          const order = { low: 0, medium: 1, high: 2 };
          av = order[a.competitionLevel];
          bv = order[b.competitionLevel];
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [keywords, query, intentFilter, competitionFilter, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" style={{ color: "var(--accent)" }} />
    ) : (
      <ChevronDown className="w-3 h-3" style={{ color: "var(--accent)" }} />
    );
  }

  function formatVolume(v: number): string {
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v.toString();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Keyword Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {keywords.length} keywords tracked across all competitors
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-dim)" }} />
            <input
              type="text"
              placeholder="Search keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {INTENTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setIntentFilter(opt.value as Keyword["intent"] | "all")}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: intentFilter === opt.value ? "var(--accent-soft)" : "var(--surface)",
                  color: intentFilter === opt.value ? "var(--accent)" : "var(--text-secondary)",
                  border: `1px solid ${intentFilter === opt.value ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {COMPETITION_LEVELS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCompetitionFilter(opt.value as Keyword["competitionLevel"] | "all")}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: competitionFilter === opt.value ? "var(--accent-violet-soft)" : "var(--surface)",
                  color: competitionFilter === opt.value ? "var(--accent-violet)" : "var(--text-secondary)",
                  border: `1px solid ${competitionFilter === opt.value ? "rgba(139,92,246,0.3)" : "var(--border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-hover)" }}>
                  {([
                    { key: "keyword", label: "Keyword" },
                    { key: "searchVolume", label: "Volume" },
                    { key: "cpcAvg", label: "Avg CPC" },
                    { key: null, label: "CPC Range" },
                    { key: "competitionLevel", label: "Competition" },
                    { key: null, label: "Intent" },
                    { key: null, label: "" },
                  ] as Array<{ key: SortKey | null; label: string }>).map(({ key, label }) => (
                    <th
                      key={label || "action"}
                      className={`text-left px-4 py-3 text-xs font-semibold whitespace-nowrap ${key ? "cursor-pointer hover:text-[var(--text)] select-none" : ""}`}
                      style={{ color: "var(--text-secondary)" }}
                      onClick={key ? () => handleSort(key) : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {key && <SortIcon col={key} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((kw, i) => (
                  <>
                    <tr
                      key={kw.id}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: expandedId === kw.id ? "var(--surface-hover)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      }}
                      onClick={() => setExpandedId(expandedId === kw.id ? null : kw.id)}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                        {kw.keyword}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--accent)" }}>
                        {formatVolume(kw.searchVolume)}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--success)" }}>
                        ${kw.cpcAvg.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                        ${kw.cpcLow.toFixed(2)}–${kw.cpcHigh.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold capitalize text-xs ${competitionColors[kw.competitionLevel]}`}>
                          {kw.competitionLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${intentColors[kw.intent]}`}>
                          {kw.intent}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight
                          className="w-4 h-4 transition-transform"
                          style={{
                            color: "var(--text-dim)",
                            transform: expandedId === kw.id ? "rotate(90deg)" : "none",
                          }}
                        />
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedId === kw.id && (
                        <tr key={`${kw.id}-expanded`}>
                          <td colSpan={7} className="px-4 py-4" style={{ background: "var(--surface-hover)" }}>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                                Top Competing Domains
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {kw.topCompetitors.map((domain) => (
                                  <span
                                    key={domain}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                                  >
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--text-dim)" }}>
              No keywords match your filters.
            </div>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          Showing {filtered.length} of {keywords.length} keywords
        </p>
      </main>
    </div>
  );
}
