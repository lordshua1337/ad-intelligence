"use client";

import { useState, useMemo, useCallback } from "react";
import { NavBar } from "@/components/nav/NavBar";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Keyword } from "@/lib/types";

const INTENTS: Array<{ value: Keyword["intent"] | "all"; label: string }> = [
  { value: "all", label: "All Intents" },
  { value: "commercial", label: "Commercial" },
  { value: "transactional", label: "Transactional" },
  { value: "informational", label: "Informational" },
  { value: "navigational", label: "Navigational" },
];

const COMPETITION_LEVELS: Array<{
  value: Keyword["competitionLevel"] | "all";
  label: string;
}> = [
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

const sourceLabels: Record<string, { label: string; color: string }> = {
  seed: { label: "Primary", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  related: { label: "Related", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  people_also_ask: { label: "PAA", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  autocomplete: { label: "Suggest", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

interface ApiKeyword {
  keyword: string;
  searchVolume: number | null;
  cpcEstimate: number | null;
  competitionLevel: "low" | "medium" | "high";
  intent: "commercial" | "transactional" | "informational" | "navigational";
  topCompetitors: string[];
  source: string;
}

export default function KeywordsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [keywords, setKeywords] = useState<ApiKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState<Keyword["intent"] | "all">("all");
  const [competitionFilter, setCompetitionFilter] = useState<Keyword["competitionLevel"] | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("searchVolume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adsDetected, setAdsDetected] = useState(0);

  const handleResearch = useCallback(async () => {
    const q = searchInput.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/keywords/research?q=${encodeURIComponent(q)}`);

      if (!res.ok) {
        const data = await res.json();
        if (data.demo) {
          setError("SerpAPI key not configured. Set SERPAPI_API_KEY in Vercel environment variables to enable live keyword research.");
        } else {
          setError(data.error || "Research failed");
        }
        return;
      }

      const data = await res.json();
      setKeywords(data.keywords ?? []);
      setAdsDetected(data.searchInfo?.adsDetected ?? 0);
    } catch {
      setError("Failed to connect to research API");
    } finally {
      setLoading(false);
    }
  }, [searchInput]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
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
        if (sortKey === "keyword") {
          av = a.keyword;
          bv = b.keyword;
        } else if (sortKey === "searchVolume") {
          av = a.searchVolume ?? 0;
          bv = b.searchVolume ?? 0;
        } else if (sortKey === "cpcAvg") {
          av = a.cpcEstimate ?? 0;
          bv = b.cpcEstimate ?? 0;
        } else {
          const order = { low: 0, medium: 1, high: 2 };
          av = order[a.competitionLevel];
          bv = order[b.competitionLevel];
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [keywords, filterQuery, intentFilter, competitionFilter, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" style={{ color: "var(--accent)" }} />
    ) : (
      <ChevronDown className="w-3 h-3" style={{ color: "var(--accent)" }} />
    );
  }

  function formatVolume(v: number | null): string {
    if (v === null) return "--";
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v.toString();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Keyword Intelligence
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Research keywords with live Google data via SerpAPI
          </p>
        </div>

        {/* Research search bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-dim)" }}
            />
            <input
              type="text"
              placeholder="Enter a keyword to research... (e.g. project management software)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleResearch();
              }}
              className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
          <button
            onClick={handleResearch}
            disabled={loading || !searchInput.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              color: "white",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "Researching..." : "Research"}
          </button>
        </div>

        {/* Error state */}
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

        {/* Results info bar */}
        {searched && !loading && !error && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {keywords.length} keywords found
              </span>
            </div>
            {adsDetected > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  color: "#F59E0B",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                {adsDetected} Google Ads detected
              </span>
            )}
            <div className="flex gap-1 flex-wrap">
              {["seed", "related", "people_also_ask", "autocomplete"].map((src) => {
                const count = keywords.filter((k) => k.source === src).length;
                if (count === 0) return null;
                const info = sourceLabels[src];
                return (
                  <span
                    key={src}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${info.color}`}
                  >
                    {info.label}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter row */}
        {keywords.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-dim)" }}
              />
              <input
                type="text"
                placeholder="Filter results..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {INTENTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setIntentFilter(opt.value as Keyword["intent"] | "all")
                  }
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background:
                      intentFilter === opt.value
                        ? "var(--accent-soft)"
                        : "var(--surface)",
                    color:
                      intentFilter === opt.value
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    border: `1px solid ${
                      intentFilter === opt.value
                        ? "rgba(59,130,246,0.3)"
                        : "var(--border)"
                    }`,
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
                  onClick={() =>
                    setCompetitionFilter(
                      opt.value as Keyword["competitionLevel"] | "all"
                    )
                  }
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background:
                      competitionFilter === opt.value
                        ? "var(--accent-violet-soft)"
                        : "var(--surface)",
                    color:
                      competitionFilter === opt.value
                        ? "var(--accent-violet)"
                        : "var(--text-secondary)",
                    border: `1px solid ${
                      competitionFilter === opt.value
                        ? "rgba(139,92,246,0.3)"
                        : "var(--border)"
                    }`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        {keywords.length > 0 && (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: "var(--surface-hover)",
                      }}
                    >
                      {(
                        [
                          { key: "keyword", label: "Keyword" },
                          { key: "searchVolume", label: "Est. Volume" },
                          { key: "cpcAvg", label: "Est. CPC" },
                          { key: "competitionLevel", label: "Competition" },
                          { key: null, label: "Intent" },
                          { key: null, label: "Source" },
                          { key: null, label: "" },
                        ] as Array<{ key: SortKey | null; label: string }>
                      ).map(({ key, label }) => (
                        <th
                          key={label || "action"}
                          className={`text-left px-4 py-3 text-xs font-semibold whitespace-nowrap ${
                            key
                              ? "cursor-pointer hover:text-[var(--text)] select-none"
                              : ""
                          }`}
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
                    {filtered.map((kw, i) => {
                      const kwId = `${kw.keyword}-${i}`;
                      return (
                        <KeywordRow
                          key={kwId}
                          kw={kw}
                          kwId={kwId}
                          index={i}
                          expandedId={expandedId}
                          onToggle={() =>
                            setExpandedId(expandedId === kwId ? null : kwId)
                          }
                          formatVolume={formatVolume}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-dim)" }}
                >
                  No keywords match your filters.
                </div>
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Showing {filtered.length} of {keywords.length} keywords
            </p>
          </>
        )}

        {/* Empty state */}
        {!searched && (
          <div
            className="text-center py-16 flex flex-col items-center gap-3"
            style={{ color: "var(--text-dim)" }}
          >
            <Search className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Enter a keyword above to start researching
            </p>
            <p className="text-xs">
              Results include related searches, People Also Ask, and autocomplete
              suggestions from Google
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function KeywordRow({
  kw,
  kwId,
  index,
  expandedId,
  onToggle,
  formatVolume,
}: {
  readonly kw: ApiKeyword;
  readonly kwId: string;
  readonly index: number;
  readonly expandedId: string | null;
  readonly onToggle: () => void;
  readonly formatVolume: (v: number | null) => string;
}) {
  const srcInfo = sourceLabels[kw.source] ?? {
    label: kw.source,
    color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  };

  return (
    <>
      <tr
        className="cursor-pointer transition-colors"
        style={{
          borderBottom: "1px solid var(--border)",
          background:
            expandedId === kwId
              ? "var(--surface-hover)"
              : index % 2 === 0
              ? "transparent"
              : "rgba(255,255,255,0.01)",
        }}
        onClick={onToggle}
      >
        <td
          className="px-4 py-3 font-medium"
          style={{ color: "var(--text)" }}
        >
          {kw.keyword}
        </td>
        <td
          className="px-4 py-3 font-semibold"
          style={{ color: "var(--accent)" }}
        >
          {formatVolume(kw.searchVolume)}
        </td>
        <td
          className="px-4 py-3 font-semibold"
          style={{ color: "var(--success)" }}
        >
          {kw.cpcEstimate !== null ? `$${kw.cpcEstimate.toFixed(2)}` : "--"}
        </td>
        <td className="px-4 py-3">
          <span
            className={`font-semibold capitalize text-xs ${
              competitionColors[kw.competitionLevel]
            }`}
          >
            {kw.competitionLevel}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs border capitalize ${
              intentColors[kw.intent]
            }`}
          >
            {kw.intent}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${srcInfo.color}`}
          >
            {srcInfo.label}
          </span>
        </td>
        <td className="px-4 py-3">
          <ChevronRight
            className="w-4 h-4 transition-transform"
            style={{
              color: "var(--text-dim)",
              transform:
                expandedId === kwId ? "rotate(90deg)" : "none",
            }}
          />
        </td>
      </tr>
      <AnimatePresence>
        {expandedId === kwId && (
          <tr key={`${kwId}-expanded`}>
            <td
              colSpan={7}
              className="px-4 py-4"
              style={{ background: "var(--surface-hover)" }}
            >
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {kw.topCompetitors.length > 0 ? (
                  <>
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Top Competing Domains
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {kw.topCompetitors.map((domain) => (
                        <span
                          key={domain}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                          }}
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-dim)" }}
                  >
                    No competitor data available for this keyword. Research the
                    primary keyword for detailed competition analysis.
                  </p>
                )}
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
