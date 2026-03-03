"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, Plus, Trash2, StickyNote, Globe } from "lucide-react";
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
              style={{
                background: "var(--bg)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={getFaviconUrl(competitor.domain, 32)}
                  alt=""
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
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
              {/* Live Intelligence Sources */}
              <section>
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  <ExternalLink className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  Live Intelligence
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-dim)" }}>
                  Click to view real ad data and competitive intelligence for {competitor.name}.
                </p>
                <div className="flex flex-col gap-2">
                  {INTEL_SOURCES.map((source) => (
                    <a
                      key={source.id}
                      href={source.buildUrl(competitor.domain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.01]"
                      style={{
                        background: source.bgColor,
                        border: `1px solid ${source.borderColor}`,
                      }}
                    >
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: source.color }}
                        >
                          {source.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {source.description}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: source.color }} />
                    </a>
                  ))}
                </div>
              </section>

              {/* Google Trends */}
              <section>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Trend Research
                </h3>
                <a
                  href={getGoogleTrendsUrl(competitor.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.01]"
                  style={{
                    background: "rgba(66,133,244,0.1)",
                    border: "1px solid rgba(66,133,244,0.25)",
                  }}
                >
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#4285F4" }}>
                      Google Trends
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      Search interest over time for &ldquo;{competitor.name}&rdquo;
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: "#4285F4" }} />
                </a>
              </section>

              {/* Competitor Info */}
              <section>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Competitor Profile
                </h3>
                <div className="card p-4">
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: "Industry", value: competitor.industry },
                      { label: "Channels", value: competitor.channels.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ") },
                      { label: "Added", value: new Date(competitor.firstSeenAt).toLocaleDateString() },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-1.5"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {label}
                        </span>
                        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Research Notes */}
              <section>
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  <StickyNote className="w-4 h-4" style={{ color: "var(--warning)" }} />
                  Research Notes
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNote();
                    }}
                    placeholder="Add a research note..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
