"use client";

import { useState, useEffect, useCallback } from "react";
import { NavBar } from "@/components/nav/NavBar";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Users,
  Tag,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRIEFS_STORAGE_KEY = "ad-intel-briefs";

type SectionKey = "summary" | "takeaways" | "competitors" | "keywords" | "recommendations";

interface StoredBrief {
  id: string;
  generatedAt: string;
  summary: string;
  keyTakeaways: string[];
  topCompetitors: { name: string; spend: number; adCount: number }[];
  trendingKeywords: string[];
  recommendations: string[];
}

function loadBriefs(): StoredBrief[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BRIEFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBriefs(briefs: StoredBrief[]): void {
  localStorage.setItem(BRIEFS_STORAGE_KEY, JSON.stringify(briefs));
}

function formatBudget(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${Math.round(amount / 1000)}K`;
  return `$${amount}`;
}

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<StoredBrief[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, Set<SectionKey>>>({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadBriefs();
    setBriefs(loaded);
    if (loaded.length > 0) {
      setExpandedSections({ [loaded[0].id]: new Set(["summary"]) });
    }
  }, []);

  const generateBrief = useCallback(async () => {
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
        .filter((c: Record<string, unknown>) => c.enrichment)
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
        setError("No enriched competitors. Scan your tracked domains on the Dashboard first.");
        setGenerating(false);
        return;
      }

      const res = await fetch("/api/briefs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitors: competitorInputs }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Brief generation failed");
      }

      const newBrief: StoredBrief = await res.json();

      // Prepend to existing briefs
      const updated = [newBrief, ...briefs];
      setBriefs(updated);
      saveBriefs(updated);
      setExpandedSections({ [newBrief.id]: new Set(["summary"]) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Brief generation failed");
    } finally {
      setGenerating(false);
    }
  }, [briefs]);

  function toggleSection(briefId: string, section: SectionKey) {
    setExpandedSections((prev) => {
      const current = prev[briefId] ?? new Set<SectionKey>();
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return { ...prev, [briefId]: next };
    });
  }

  function isExpanded(briefId: string, section: SectionKey): boolean {
    return expandedSections[briefId]?.has(section) ?? false;
  }

  const sections: Array<{
    key: SectionKey;
    label: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }> = [
    { key: "summary", label: "Summary", icon: FileText },
    { key: "takeaways", label: "Key Takeaways", icon: Lightbulb },
    { key: "competitors", label: "Top Competitors", icon: Users },
    { key: "keywords", label: "Trending Keywords", icon: Tag },
    { key: "recommendations", label: "Recommendations", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Competitive Intelligence Briefs
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              AI-generated intelligence summaries from your tracked competitors
            </p>
          </div>
          <button
            onClick={generateBrief}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              color: "white",
              boxShadow: "0 0 16px rgba(59,130,246,0.25)",
            }}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Brief...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate New Brief
              </>
            )}
          </button>
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

        {/* Empty state */}
        {briefs.length === 0 && !generating && (
          <div
            className="text-center py-16 flex flex-col items-center gap-3"
            style={{ color: "var(--text-dim)" }}
          >
            <FileText className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No briefs generated yet
            </p>
            <p className="text-xs">
              Track competitors on the Dashboard, then click &quot;Generate New Brief&quot;
              to create an AI-powered competitive intelligence summary.
            </p>
          </div>
        )}

        {/* Generating placeholder */}
        {generating && briefs.length === 0 && (
          <div className="card p-8 text-center">
            <Loader2
              className="w-8 h-8 animate-spin mx-auto mb-3"
              style={{ color: "var(--accent)" }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Analyzing your competitors...
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              Claude is generating a competitive intelligence brief from your tracked data
            </p>
          </div>
        )}

        {/* Briefs */}
        {briefs.map((brief, briefIndex) => (
          <motion.div
            key={brief.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: briefIndex * 0.1 }}
            className="card overflow-hidden"
          >
            {/* Brief header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{
                background: "var(--surface-hover)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  <FileText className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {briefIndex === 0 ? "Latest Brief" : "Previous Brief"}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Generated{" "}
                    {new Date(brief.generatedAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {briefIndex === 0 && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      color: "var(--success)",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    Latest
                  </span>
                )}
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    color: "var(--accent)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  AI Generated
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {sections.map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[var(--surface-hover)]"
                    onClick={() => toggleSection(brief.id, key)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {label}
                      </span>
                    </div>
                    {isExpanded(brief.id, key) ? (
                      <ChevronUp className="w-4 h-4" style={{ color: "var(--text-dim)" }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: "var(--text-dim)" }} />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded(brief.id, key) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          {key === "summary" && (
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {brief.summary}
                            </p>
                          )}

                          {key === "takeaways" && (
                            <ul className="flex flex-col gap-3">
                              {brief.keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                                    style={{
                                      background: "var(--accent-soft)",
                                      color: "var(--accent)",
                                      border: "1px solid rgba(59,130,246,0.2)",
                                    }}
                                  >
                                    {i + 1}
                                  </span>
                                  <span
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {takeaway}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {key === "competitors" && (
                            <div className="flex flex-col gap-2">
                              {brief.topCompetitors.map((comp, i) => (
                                <div
                                  key={comp.name}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                                  style={{ background: "var(--surface-hover)" }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className="text-xs font-bold w-5 text-center"
                                      style={{ color: "var(--text-dim)" }}
                                    >
                                      #{i + 1}
                                    </span>
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: "var(--text)" }}
                                    >
                                      {comp.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-right">
                                    <div>
                                      <div
                                        className="text-xs font-semibold"
                                        style={{ color: "var(--success)" }}
                                      >
                                        {formatBudget(comp.spend)}/mo
                                      </div>
                                      <div
                                        className="text-[10px]"
                                        style={{ color: "var(--text-dim)" }}
                                      >
                                        est. spend
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className="text-xs font-semibold"
                                        style={{ color: "var(--accent)" }}
                                      >
                                        {comp.adCount}
                                      </div>
                                      <div
                                        className="text-[10px]"
                                        style={{ color: "var(--text-dim)" }}
                                      >
                                        ads
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {key === "keywords" && (
                            <div className="flex flex-wrap gap-2">
                              {brief.trendingKeywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                                  style={{
                                    background: "var(--accent-violet-soft)",
                                    color: "var(--accent-violet)",
                                    border: "1px solid rgba(139,92,246,0.2)",
                                  }}
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}

                          {key === "recommendations" && (
                            <ul className="flex flex-col gap-3">
                              {brief.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <TrendingUp
                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                    style={{ color: "var(--success)" }}
                                  />
                                  <span
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {rec}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
