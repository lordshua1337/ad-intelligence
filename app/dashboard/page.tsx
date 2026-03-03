"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, ExternalLink, Eye, Globe, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CompetitorDetailModal } from "@/components/dashboard/CompetitorDetailModal";
import { getCustomCompetitors, saveCustomCompetitor, removeCustomCompetitor, generateCompetitorId } from "@/lib/custom-competitors";
import { INTEL_SOURCES, getFaviconUrl } from "@/lib/intelligence-sources";
import type { Competitor } from "@/lib/types";

export default function DashboardPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailCompetitor, setDetailCompetitor] = useState<Competitor | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setCompetitors(getCustomCompetitors());
  }, []);

  function handleTrack() {
    const q = searchQuery.trim();
    if (!q) return;

    // Determine if it looks like a domain or a company name
    const isDomain = q.includes(".");
    const domain = isDomain ? q.replace(/^https?:\/\//, "").replace(/\/$/, "") : `${q.toLowerCase().replace(/\s+/g, "")}.com`;
    const name = isDomain ? q.split(".")[0].charAt(0).toUpperCase() + q.split(".")[0].slice(1) : q;

    const now = new Date().toISOString();
    const competitor: Competitor = {
      id: generateCompetitorId(),
      name,
      domain,
      industry: "Unknown",
      monthlyBudgetEstimate: 0,
      activeAdCount: 0,
      channels: ["google", "meta"],
      firstSeenAt: now,
      lastUpdatedAt: now,
      trendScore: 0,
    };

    saveCustomCompetitor(competitor);
    setCompetitors(getCustomCompetitors());
    setSearchQuery("");
    setShowResults(false);
  }

  function handleRemove(id: string) {
    removeCustomCompetitor(id);
    setCompetitors(getCustomCompetitors());
  }

  // Derive search domain for quick lookup
  const searchDomain = searchQuery.trim().includes(".")
    ? searchQuery.trim().replace(/^https?:\/\//, "").replace(/\/$/, "")
    : searchQuery.trim().length > 0
    ? `${searchQuery.trim().toLowerCase().replace(/\s+/g, "")}.com`
    : "";

  return (
    <div className="flex flex-col gap-8">
      {/* Hero search */}
      <div className="text-center pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Competitive Intelligence
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Look up any company to see their real ads, keywords, and traffic data.
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-dim)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(e.target.value.trim().length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                setShowResults(true);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowResults(true);
            }}
            placeholder="Search any company name or domain... (e.g. nike.com, Shopify)"
            className="w-full pl-12 pr-4 py-4 rounded-xl text-base outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
              boxShadow: "0 0 30px rgba(59,130,246,0.08)",
            }}
          />
        </div>

        {/* Quick lookup results */}
        <AnimatePresence>
          {showResults && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="max-w-xl mx-auto mt-3"
            >
              <div
                className="rounded-xl overflow-hidden text-left"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-hover)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                }}
              >
                {/* Company preview */}
                <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <img
                    src={getFaviconUrl(searchDomain, 32)}
                    alt=""
                    className="w-8 h-8 rounded flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                      {searchQuery.trim()}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                      {searchDomain}
                    </div>
                  </div>
                  <button
                    onClick={handleTrack}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.97] flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                      color: "white",
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Track
                  </button>
                </div>

                {/* Quick intel links */}
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--text-dim)" }}>
                    Quick Lookup
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {INTEL_SOURCES.slice(0, 4).map((source) => (
                      <a
                        key={source.id}
                        href={source.buildUrl(searchDomain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all hover:scale-[1.01]"
                        style={{
                          background: source.bgColor,
                          border: `1px solid ${source.borderColor}`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: source.color }}>
                            {source.name}
                          </div>
                          <div className="text-[10px] truncate" style={{ color: "var(--text-dim)" }}>
                            {source.description}
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color: source.color }} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tracked competitors */}
      {competitors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                Tracked Competitors
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                {competitors.length} competitor{competitors.length !== 1 ? "s" : ""} being monitored
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitors.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <div
                  className="card card-hover p-5 cursor-pointer h-full flex flex-col gap-3"
                  onClick={() => setDetailCompetitor(comp)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <img
                        src={getFaviconUrl(comp.domain, 32)}
                        alt=""
                        className="w-7 h-7 rounded flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight truncate" style={{ color: "var(--text)" }}>
                          {comp.name}
                        </h3>
                        <span className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          <Globe className="w-3 h-3" />
                          {comp.domain}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(comp.id);
                      }}
                      className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.15)] flex-shrink-0"
                      style={{ color: "var(--text-dim)" }}
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick intel buttons */}
                  <div className="flex gap-1.5 flex-wrap">
                    <a
                      href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(comp.domain)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                      style={{ background: "rgba(139,92,246,0.1)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.2)" }}
                    >
                      Meta Ads
                    </a>
                    <a
                      href={`https://adstransparency.google.com/?domain=${encodeURIComponent(comp.domain)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                      style={{ background: "rgba(59,130,246,0.1)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                      Google Ads
                    </a>
                    <a
                      href={`https://www.spyfu.com/overview/domain?query=${encodeURIComponent(comp.domain)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                      SpyFu
                    </a>
                    <a
                      href={`https://www.similarweb.com/website/${encodeURIComponent(comp.domain)}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      SimilarWeb
                    </a>
                  </div>

                  {/* Channels */}
                  <div className="flex items-center gap-1.5 mt-auto">
                    {comp.channels.map((ch) => (
                      <span
                        key={ch}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          ch === "google"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : ch === "meta"
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {ch.charAt(0).toUpperCase() + ch.slice(1)}
                      </span>
                    ))}
                  </div>

                  {/* View details hint */}
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                    <Eye className="w-3 h-3" />
                    View full intelligence
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {competitors.length === 0 && !showResults && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: "var(--text-dim)" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            No competitors tracked yet
          </p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Search for a company above to start gathering competitive intelligence.
          </p>
        </div>
      )}

      <CompetitorDetailModal
        competitor={detailCompetitor}
        onClose={() => setDetailCompetitor(null)}
      />
    </div>
  );
}
