"use client";

import { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBriefs, formatBudget } from "@/lib/mock-data/index";

type SectionKey = "summary" | "takeaways" | "competitors" | "keywords" | "recommendations";

export default function BriefsPage() {
  const briefs = getAllBriefs();
  const [expandedSections, setExpandedSections] = useState<Record<string, Set<SectionKey>>>(
    () => ({ [briefs[0]?.id ?? ""]: new Set(["summary"]) })
  );

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
              Weekly Competitive Briefs
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              AI-generated intelligence summaries for your competitive landscape
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              color: "white",
              boxShadow: "0 0 16px rgba(59,130,246,0.25)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Generate New Brief
          </button>
        </div>

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
                    Generated {new Date(brief.generatedAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
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
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {brief.summary}
                            </p>
                          )}

                          {key === "takeaways" && (
                            <ul className="flex flex-col gap-3">
                              {brief.keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                                    style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(59,130,246,0.2)" }}
                                  >
                                    {i + 1}
                                  </span>
                                  <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
                                    <span className="text-xs font-bold w-5 text-center" style={{ color: "var(--text-dim)" }}>
                                      #{i + 1}
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                                      {comp.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-right">
                                    <div>
                                      <div className="text-xs font-semibold" style={{ color: "var(--success)" }}>
                                        {formatBudget(comp.spend)}/mo
                                      </div>
                                      <div className="text-[10px]" style={{ color: "var(--text-dim)" }}>est. spend</div>
                                    </div>
                                    <div>
                                      <div className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                                        {comp.adCount}
                                      </div>
                                      <div className="text-[10px]" style={{ color: "var(--text-dim)" }}>ads</div>
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
                                  <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
