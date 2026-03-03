"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Plus, Trash2, Globe, ArrowRight, Eye, RefreshCw,
  Zap, BarChart3, Shield, Clock, Code, Megaphone, Users,
  ExternalLink, Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CompetitorDetailModal } from "@/components/dashboard/CompetitorDetailModal";
import {
  getCustomCompetitors,
  saveCustomCompetitor,
  removeCustomCompetitor,
  generateCompetitorId,
  updateCompetitorEnrichment,
  updateCompetitorStatus,
} from "@/lib/custom-competitors";
import { getFaviconUrl } from "@/lib/intelligence-sources";
import type { Competitor } from "@/lib/types";
import type { EnrichmentData } from "@/lib/enrichment-types";

export default function DashboardPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailCompetitor, setDetailCompetitor] = useState<Competitor | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompetitors(getCustomCompetitors());
  }, []);

  const enrichCompetitor = useCallback(async (comp: Competitor) => {
    setEnrichingIds((prev) => new Set([...prev, comp.id]));
    updateCompetitorStatus(comp.id, "loading");
    setCompetitors(getCustomCompetitors());

    try {
      const response = await fetch(`/api/enrich?domain=${encodeURIComponent(comp.domain)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: EnrichmentData = await response.json();
      updateCompetitorEnrichment(comp.id, data);
    } catch {
      updateCompetitorStatus(comp.id, "error");
    } finally {
      setEnrichingIds((prev) => {
        const next = new Set(prev);
        next.delete(comp.id);
        return next;
      });
      setCompetitors(getCustomCompetitors());
    }
  }, []);

  function handleTrack() {
    const q = searchQuery.trim();
    if (!q) return;

    const isDomain = q.includes(".");
    const domain = isDomain
      ? q.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^www\./, "")
      : `${q.toLowerCase().replace(/\s+/g, "")}.com`;
    const name = isDomain
      ? q.split(".")[0].charAt(0).toUpperCase() + q.split(".")[0].slice(1)
      : q;

    const now = new Date().toISOString();
    const competitor: Competitor = {
      id: generateCompetitorId(),
      name,
      domain,
      industry: "Unknown",
      monthlyBudgetEstimate: 0,
      activeAdCount: 0,
      channels: [],
      firstSeenAt: now,
      lastUpdatedAt: now,
      trendScore: 0,
      enrichmentStatus: "pending",
    };

    saveCustomCompetitor(competitor);
    setCompetitors(getCustomCompetitors());
    setSearchQuery("");
    setShowResults(false);

    // Auto-enrich
    enrichCompetitor(competitor);
  }

  function handleRemove(id: string) {
    removeCustomCompetitor(id);
    setCompetitors(getCustomCompetitors());
  }

  const searchDomain = searchQuery.trim().includes(".")
    ? searchQuery.trim().replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^www\./, "")
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
          Search any company to scan their tech stack, ad pixels, analytics, and site performance.
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
                handleTrack();
              }
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowResults(true);
            }}
            placeholder="Enter a company domain... (e.g. nike.com, shopify.com)"
            className="w-full pl-12 pr-4 py-4 rounded-xl text-base outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
              boxShadow: "0 0 30px rgba(59,130,246,0.08)",
            }}
          />
        </div>

        {/* Quick preview when typing */}
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
                <div className="p-4 flex items-center gap-3">
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
                      {searchDomain}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                      Press Enter or click Track to scan this domain
                    </div>
                  </div>
                  <button
                    onClick={handleTrack}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.97] flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                      color: "white",
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Scan & Track
                  </button>
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
                {competitors.length} competitor{competitors.length !== 1 ? "s" : ""} scanned
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {competitors.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <CompetitorCard
                  competitor={comp}
                  isEnriching={enrichingIds.has(comp.id)}
                  onView={() => setDetailCompetitor(comp)}
                  onRemove={() => handleRemove(comp.id)}
                  onRefresh={() => enrichCompetitor(comp)}
                />
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
            Enter a domain above to scan their tech stack, ad pixels, and site performance.
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

// --- Competitor Card with real data ---

function CompetitorCard({
  competitor: comp,
  isEnriching,
  onView,
  onRemove,
  onRefresh,
}: {
  readonly competitor: Competitor;
  readonly isEnriching: boolean;
  readonly onView: () => void;
  readonly onRemove: () => void;
  readonly onRefresh: () => void;
}) {
  const e = comp.enrichment;
  const activePixels = e?.adPixels.filter((p) => p.detected) ?? [];
  const activeAnalytics = e?.analytics.filter((a) => a.detected) ?? [];
  const techStack = e?.techStack ?? [];
  const perfScore = e?.pageSpeed?.performanceScore;

  return (
    <div
      className="card card-hover p-5 cursor-pointer h-full flex flex-col gap-3"
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <img
            src={getFaviconUrl(comp.domain, 32)}
            alt=""
            className="w-8 h-8 rounded flex-shrink-0"
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
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              onRefresh();
            }}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-hover)]"
            style={{ color: "var(--text-dim)" }}
            title="Re-scan"
            disabled={isEnriching}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEnriching ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              onRemove();
            }}
            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.15)]"
            style={{ color: "var(--text-dim)" }}
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {(isEnriching || comp.enrichmentStatus === "loading") && (
        <div className="flex items-center gap-2 py-3">
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--accent)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Scanning {comp.domain}...
          </span>
        </div>
      )}

      {/* Enriched data */}
      {e && comp.enrichmentStatus === "complete" && (
        <>
          {/* Company description */}
          {e.companyInfo.description && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
              {e.companyInfo.description}
            </p>
          )}

          {/* Performance score */}
          {perfScore !== undefined && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" style={{ color: scoreColor(perfScore) }} />
                <span className="text-xs font-semibold" style={{ color: scoreColor(perfScore) }}>
                  {perfScore}/100
                </span>
                <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                  Performance
                </span>
              </div>
              {e.pageSpeed?.seoScore !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" style={{ color: scoreColor(e.pageSpeed.seoScore) }} />
                  <span className="text-xs font-semibold" style={{ color: scoreColor(e.pageSpeed.seoScore) }}>
                    {e.pageSpeed.seoScore}/100
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                    SEO
                  </span>
                </div>
              )}
              {e.siteAge && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: "var(--text-dim)" }} />
                  <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                    Since {e.siteAge.firstSeen.substring(0, 4)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tech stack pills */}
          {techStack.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Code className="w-3 h-3" style={{ color: "var(--accent)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                  Tech Stack
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {techStack.slice(0, 6).map((tech) => (
                  <span
                    key={tech.name}
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      background: techCategoryColor(tech.category).bg,
                      color: techCategoryColor(tech.category).text,
                      border: `1px solid ${techCategoryColor(tech.category).border}`,
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
                {techStack.length > 6 && (
                  <span className="text-[10px] px-1 py-0.5" style={{ color: "var(--text-dim)" }}>
                    +{techStack.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Ad pixels detected */}
          {activePixels.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Megaphone className="w-3 h-3" style={{ color: "#F59E0B" }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                  Ad Platforms Detected
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {activePixels.map((pixel) => (
                  <span
                    key={pixel.platform}
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      color: "#F59E0B",
                      border: "1px solid rgba(245,158,11,0.2)",
                    }}
                  >
                    {pixel.platform}
                    {pixel.pixelId && (
                      <span style={{ color: "var(--text-dim)" }}> ({pixel.pixelId})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Analytics tools */}
          {activeAnalytics.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Users className="w-3 h-3" style={{ color: "#10B981" }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                  Analytics & Tools
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {activeAnalytics.slice(0, 5).map((tool) => (
                  <span
                    key={tool.name}
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      color: "#10B981",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    {tool.name}
                  </span>
                ))}
                {activeAnalytics.length > 5 && (
                  <span className="text-[10px] px-1 py-0.5" style={{ color: "var(--text-dim)" }}>
                    +{activeAnalytics.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Social links */}
          {e.socialLinks.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {e.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => ev.stopPropagation()}
                  className="flex items-center gap-1 text-[10px] font-medium hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {comp.enrichmentStatus === "error" && !isEnriching && (
        <div className="flex items-center gap-2 py-2">
          <span className="text-xs" style={{ color: "var(--danger)" }}>
            Scan failed.
          </span>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              onRefresh();
            }}
            className="text-xs underline"
            style={{ color: "var(--accent)" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Pending state (no enrichment yet, not loading) */}
      {!e && !isEnriching && comp.enrichmentStatus !== "error" && comp.enrichmentStatus !== "loading" && (
        <div className="flex items-center gap-2 py-2">
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            Not yet scanned.
          </span>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              onRefresh();
            }}
            className="text-xs underline"
            style={{ color: "var(--accent)" }}
          >
            Scan now
          </button>
        </div>
      )}

      {/* Footer: view details */}
      <div className="flex items-center gap-1 text-xs mt-auto pt-1" style={{ color: "var(--accent)" }}>
        <Eye className="w-3 h-3" />
        View full intelligence
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  );
}

// --- Helpers ---

function scoreColor(score: number): string {
  if (score >= 90) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

function techCategoryColor(category: string): { bg: string; text: string; border: string } {
  switch (category) {
    case "framework":
      return { bg: "rgba(59,130,246,0.1)", text: "#60A5FA", border: "rgba(59,130,246,0.2)" };
    case "cms":
      return { bg: "rgba(139,92,246,0.1)", text: "#A78BFA", border: "rgba(139,92,246,0.2)" };
    case "ecommerce":
      return { bg: "rgba(245,158,11,0.1)", text: "#F59E0B", border: "rgba(245,158,11,0.2)" };
    case "hosting":
      return { bg: "rgba(16,185,129,0.1)", text: "#10B981", border: "rgba(16,185,129,0.2)" };
    case "cdn":
      return { bg: "rgba(236,72,153,0.1)", text: "#EC4899", border: "rgba(236,72,153,0.2)" };
    default:
      return { bg: "rgba(100,116,139,0.1)", text: "#94A3B8", border: "rgba(100,116,139,0.2)" };
  }
}
