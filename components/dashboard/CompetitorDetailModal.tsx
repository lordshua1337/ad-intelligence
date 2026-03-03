"use client";

import { useState, useEffect } from "react";
import {
  X, ExternalLink, Plus, Trash2, StickyNote, Globe, Code, Megaphone,
  BarChart3, Shield, Clock, Users, Zap, ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INTEL_SOURCES, getFaviconUrl, getGoogleTrendsUrl } from "@/lib/intelligence-sources";
import { getNotesForCompetitor, addNote, removeNote } from "@/lib/competitor-notes";
import type { CompetitorNote } from "@/lib/competitor-notes";
import type { Competitor } from "@/lib/types";

interface CompetitorDetailModalProps {
  readonly competitor: Competitor | null;
  readonly onClose: () => void;
}

export function CompetitorDetailModal({ competitor, onClose }: CompetitorDetailModalProps) {
  const [notes, setNotes] = useState<CompetitorNote[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (competitor) {
      setNotes(getNotesForCompetitor(competitor.id));
    }
  }, [competitor]);

  function handleAddNote() {
    if (!competitor || !newNote.trim()) return;
    addNote(competitor.id, newNote.trim());
    setNotes(getNotesForCompetitor(competitor.id));
    setNewNote("");
  }

  function handleRemoveNote(noteId: string) {
    removeNote(noteId);
    if (competitor) {
      setNotes(getNotesForCompetitor(competitor.id));
    }
  }

  const e = competitor?.enrichment;
  const activePixels = e?.adPixels.filter((p) => p.detected) ?? [];
  const inactivePixels = e?.adPixels.filter((p) => !p.detected) ?? [];
  const activeAnalytics = e?.analytics.filter((a) => a.detected) ?? [];

  return (
    <AnimatePresence>
      {competitor && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto"
            style={{
              background: "var(--bg)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={getFaviconUrl(competitor.domain, 32)}
                  alt=""
                  className="w-6 h-6 rounded"
                  onError={(ev) => {
                    (ev.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div>
                  <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
                    {competitor.name}
                  </h2>
                  <a
                    href={`https://${competitor.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 hover:underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Globe className="w-3 h-3" />
                    {competitor.domain}
                  </a>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-hover)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-6">
              {/* Company description */}
              {e?.companyInfo.description && (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {e.companyInfo.description}
                </p>
              )}

              {/* Performance Scores */}
              {e?.pageSpeed && (
                <section>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                    <BarChart3 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    Site Performance (Google PageSpeed)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <ScoreCard label="Performance" score={e.pageSpeed.performanceScore} />
                    <ScoreCard label="SEO" score={e.pageSpeed.seoScore} />
                    <ScoreCard label="Accessibility" score={e.pageSpeed.accessibilityScore} />
                  </div>
                  <div className="mt-3 flex gap-4">
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                      FCP: <span style={{ color: "var(--text-secondary)" }}>{e.pageSpeed.firstContentfulPaint}</span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                      LCP: <span style={{ color: "var(--text-secondary)" }}>{e.pageSpeed.largestContentfulPaint}</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Tech Stack */}
              {e && e.techStack.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                    <Code className="w-4 h-4" style={{ color: "#60A5FA" }} />
                    Technology Stack
                  </h3>
                  <div className="flex flex-col gap-2">
                    {groupByCategory(e.techStack).map(([category, techs]) => (
                      <div key={category} className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold uppercase w-20 pt-1 flex-shrink-0" style={{ color: "var(--text-dim)" }}>
                          {category}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {techs.map((tech) => (
                            <span
                              key={tech.name}
                              className="px-2 py-0.5 rounded text-[11px] font-medium"
                              style={{
                                background: "rgba(59,130,246,0.1)",
                                color: "#60A5FA",
                                border: "1px solid rgba(59,130,246,0.2)",
                              }}
                            >
                              {tech.name}
                              {tech.confidence === "high" && (
                                <span className="ml-1 opacity-50">*</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Ad Pixels */}
              <section>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <Megaphone className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  Advertising Pixels
                </h3>
                {activePixels.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {activePixels.map((pixel) => (
                      <div
                        key={pixel.platform}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                            {pixel.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pixel.pixelId && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "var(--surface)", color: "var(--text-dim)" }}>
                              {pixel.pixelId}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                            ACTIVE
                          </span>
                        </div>
                      </div>
                    ))}
                    {inactivePixels.length > 0 && (
                      <p className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>
                        Not detected: {inactivePixels.map((p) => p.platform).join(", ")}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {e ? "No advertising pixels detected on their homepage." : "Scan competitor to detect ad pixels."}
                  </p>
                )}
              </section>

              {/* Analytics */}
              {activeAnalytics.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                    <Users className="w-4 h-4" style={{ color: "#10B981" }} />
                    Analytics & Tools ({activeAnalytics.length})
                  </h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {activeAnalytics.map((tool) => (
                      <span
                        key={tool.name}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", border: "1px solid rgba(16,185,129,0.15)" }}
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Social Links */}
              {e && e.socialLinks.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
                    Social Presence
                  </h3>
                  <div className="flex flex-col gap-2">
                    {e.socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg transition-all hover:scale-[1.01]"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                          {link.platform}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] truncate max-w-[200px]" style={{ color: "var(--text-dim)" }}>
                            {link.url.replace(/^https?:\/\/(?:www\.)?/, "")}
                          </span>
                          <ArrowUpRight className="w-3 h-3" style={{ color: "var(--accent)" }} />
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Site Age */}
              {e?.siteAge && (
                <section>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                    <Clock className="w-4 h-4" style={{ color: "var(--text-dim)" }} />
                    Domain History
                  </h3>
                  <div className="card p-4">
                    <div className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>First seen online</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{e.siteAge.firstSeen}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Archive snapshots</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        {e.siteAge.snapshotCount > 0 ? `~${e.siteAge.snapshotCount} pages` : "Limited data"}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Quick Research Links */}
              <section>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <ExternalLink className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  Deep Research
                </h3>
                <p className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
                  View detailed ad data and competitive intelligence on external platforms.
                </p>
                <div className="flex flex-col gap-2">
                  {INTEL_SOURCES.map((source) => (
                    <a
                      key={source.id}
                      href={source.buildUrl(competitor.domain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.01]"
                      style={{ background: source.bgColor, border: `1px solid ${source.borderColor}` }}
                    >
                      <div>
                        <div className="text-sm font-semibold" style={{ color: source.color }}>
                          {source.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {source.description}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: source.color }} />
                    </a>
                  ))}
                  <a
                    href={getGoogleTrendsUrl(competitor.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.01]"
                    style={{ background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.25)" }}
                  >
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#4285F4" }}>Google Trends</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        Search interest over time
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: "#4285F4" }} />
                  </a>
                </div>
              </section>

              {/* Research Notes */}
              <section>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <StickyNote className="w-4 h-4" style={{ color: "var(--warning)" }} />
                  Research Notes
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(ev) => setNewNote(ev.target.value)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") handleAddNote();
                    }}
                    placeholder="Add a research note..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: newNote.trim() ? "var(--accent-soft)" : "var(--surface)",
                      color: newNote.trim() ? "var(--accent)" : "var(--text-dim)",
                      border: `1px solid ${newNote.trim() ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {notes.length === 0 ? (
                  <p className="text-xs py-4 text-center" style={{ color: "var(--text-dim)" }}>
                    No notes yet. Research this competitor and save your findings here.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-start gap-2 p-3 rounded-lg"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        <p className="text-xs flex-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {note.text}
                        </p>
                        <button
                          onClick={() => handleRemoveNote(note.id)}
                          className="p-1 rounded transition-colors hover:bg-[rgba(239,68,68,0.15)] flex-shrink-0"
                          style={{ color: "var(--text-dim)" }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Scan metadata */}
              {e && (
                <div className="text-[10px] text-center py-2" style={{ color: "var(--text-dim)" }}>
                  Scanned {new Date(e.fetchedAt).toLocaleString()} | Status: {e.status}
                  {e.errors.length > 0 && ` | ${e.errors.length} warning(s)`}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Helper components ---

function ScoreCard({ label, score }: { readonly label: string; readonly score: number }) {
  const color = score >= 90 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="card p-3 text-center">
      <div className="text-2xl font-bold mb-0.5" style={{ color }}>
        {score}
      </div>
      <div className="text-[10px] font-medium" style={{ color: "var(--text-dim)" }}>
        {label}
      </div>
    </div>
  );
}

function groupByCategory(
  techStack: readonly { readonly name: string; readonly category: string; readonly confidence: string }[]
): [string, typeof techStack][] {
  const groups: Record<string, typeof techStack[number][]> = {};
  for (const tech of techStack) {
    if (!groups[tech.category]) groups[tech.category] = [];
    groups[tech.category].push(tech);
  }
  return Object.entries(groups);
}
