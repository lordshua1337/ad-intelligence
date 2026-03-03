"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Competitor } from "@/lib/types";
import { generateCompetitorId } from "@/lib/custom-competitors";

interface AddCompetitorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd: (competitor: Competitor) => void;
}

const INDUSTRIES = ["SaaS", "Fintech", "E-commerce", "Health", "Marketing", "Education", "Media"];
const CHANNELS = ["google", "meta", "native"];

export function AddCompetitorModal({ isOpen, onClose, onAdd }: AddCompetitorModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("SaaS");
  const [budget, setBudget] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["google"]);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isOpen]);

  function handleChannelToggle(channel: string) {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Competitor name is required.");
      return;
    }
    if (!domain.trim()) {
      setError("Domain is required.");
      return;
    }
    if (selectedChannels.length === 0) {
      setError("Select at least one channel.");
      return;
    }

    const budgetNum = budget ? parseInt(budget, 10) : 5000;
    const now = new Date().toISOString();

    const competitor: Competitor = {
      id: generateCompetitorId(),
      name: name.trim(),
      domain: domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""),
      industry,
      monthlyBudgetEstimate: isNaN(budgetNum) ? 5000 : budgetNum,
      activeAdCount: 0,
      channels: selectedChannels,
      firstSeenAt: now,
      lastUpdatedAt: now,
      trendScore: 50,
    };

    onAdd(competitor);
    setName("");
    setDomain("");
    setIndustry("SaaS");
    setBudget("");
    setSelectedChannels(["google"]);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-md rounded-xl overflow-hidden"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-hover)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
                  Add Competitor
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-hover)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                {error && (
                  <div
                    className="px-3 py-2 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    Company Name *
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    Domain *
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. acme.com"
                    className="px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      Est. Monthly Budget
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="5000"
                      className="px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    Channels
                  </label>
                  <div className="flex gap-2">
                    {CHANNELS.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleChannelToggle(ch)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={{
                          background: selectedChannels.includes(ch)
                            ? ch === "google"
                              ? "rgba(59,130,246,0.15)"
                              : ch === "meta"
                              ? "rgba(139,92,246,0.15)"
                              : "rgba(100,116,139,0.15)"
                            : "var(--bg)",
                          color: selectedChannels.includes(ch)
                            ? ch === "google"
                              ? "#60A5FA"
                              : ch === "meta"
                              ? "#A78BFA"
                              : "#94A3B8"
                            : "var(--text-dim)",
                          border: `1px solid ${
                            selectedChannels.includes(ch)
                              ? ch === "google"
                                ? "rgba(59,130,246,0.3)"
                                : ch === "meta"
                                ? "rgba(139,92,246,0.3)"
                                : "rgba(100,116,139,0.3)"
                              : "var(--border)"
                          }`,
                        }}
                      >
                        {ch.charAt(0).toUpperCase() + ch.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] mt-2"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                    boxShadow: "0 0 16px rgba(59,130,246,0.25)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Competitor
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
