"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Shield, Globe, BarChart3, Code, ExternalLink, AlertCircle } from "lucide-react";
import type { EnrichmentData } from "@/lib/enrichment-types";

const SUGGESTIONS = ["stripe.com", "notion.so", "vercel.com", "shopify.com", "linear.app"];

export function LiveSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [result, setResult] = useState<EnrichmentData | null>(null);
  const [error, setError] = useState("");

  const runSearch = useCallback(async (domain: string) => {
    const clean = domain
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/^www\./, "")
      .toLowerCase()
      .trim();

    if (!clean || !clean.includes(".")) {
      setError("Enter a valid domain (e.g. stripe.com)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setLoadingPhase("Gathering intelligence...");

    const phases = [
      "Scanning ad networks...",
      "Detecting tech stack...",
      "Checking analytics...",
      "Compiling dossier...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < phases.length) setLoadingPhase(phases[i]);
    }, 2000);

    try {
      const res = await fetch(`/api/enrich?domain=${encodeURIComponent(clean)}`);
      if (!res.ok) throw new Error(`Target not found (${res.status})`);
      const data: EnrichmentData = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Intelligence gathering failed. Try a different target.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingPhase("");
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  const activePixels = result?.adPixels.filter((p) => p.detected) ?? [];
  const activeAnalytics = result?.analytics.filter((a) => a.detected) ?? [];
  const techItems = result?.techStack ?? [];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search form */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: loading ? "0 0 20px rgba(59,130,246,0.15)" : "none",
          }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a domain to run intel (e.g. stripe.com)"
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: "var(--text)" }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              "Run Intel"
            )}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      {!result && !loading && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); runSearch(s); }}
              className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
                border: "1px solid rgba(59,130,246,0.15)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "var(--accent)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{loadingPhase}</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
            Scanning 6 intelligence sources...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#ef4444" }} />
          <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Header */}
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              {result.companyInfo.favicon && (
                <img
                  src={result.companyInfo.favicon}
                  alt=""
                  className="w-8 h-8 rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
                  {result.companyInfo.title || result.domain}
                </h3>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{result.domain}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-1 rounded"
                style={{
                  background: result.status === "complete" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                  color: result.status === "complete" ? "var(--success)" : "#f59e0b",
                }}
              >
                {result.status === "complete" ? "Full Dossier" : "Partial Intel"}
              </span>
              <a
                href={`https://${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-hover)]"
              >
                <ExternalLink className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
              </a>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-0" style={{ borderBottom: "1px solid var(--border)" }}>
            <StatCell icon={Shield} label="Ad Pixels" value={`${activePixels.length} found`} color="var(--accent)" />
            <StatCell icon={Code} label="Tech Stack" value={`${techItems.length} detected`} color="var(--accent-violet)" />
            <StatCell icon={BarChart3} label="Analytics" value={`${activeAnalytics.length} tools`} color="var(--success)" />
            <StatCell icon={Globe} label="Social" value={`${result.socialLinks.length} links`} color="#f59e0b" />
          </div>

          {/* Ad Pixels */}
          {activePixels.length > 0 && (
            <Section title="Ad Pixels Detected" color="var(--accent)">
              <div className="flex flex-wrap gap-2">
                {activePixels.map((p) => (
                  <span
                    key={p.platform}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(59,130,246,0.15)" }}
                  >
                    {p.platform}
                    {p.pixelId && <span className="opacity-60 ml-1">({p.pixelId})</span>}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Tech Stack */}
          {techItems.length > 0 && (
            <Section title="Tech Stack" color="var(--accent-violet)">
              <div className="flex flex-wrap gap-2">
                {techItems.map((t) => (
                  <span
                    key={t.name}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: t.confidence === "high" ? "rgba(139,92,246,0.12)" : "var(--surface-hover)",
                      color: t.confidence === "high" ? "#8b5cf6" : "var(--text-secondary)",
                      border: `1px solid ${t.confidence === "high" ? "rgba(139,92,246,0.2)" : "var(--border)"}`,
                    }}
                  >
                    {t.name}
                    <span className="opacity-50 ml-1 text-[10px]">{t.category}</span>
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Analytics */}
          {activeAnalytics.length > 0 && (
            <Section title="Analytics & Tools" color="var(--success)">
              <div className="flex flex-wrap gap-2">
                {activeAnalytics.map((a) => (
                  <span
                    key={a.name}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)", border: "1px solid rgba(16,185,129,0.15)" }}
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* PageSpeed */}
          {result.pageSpeed && (
            <Section title="Performance Scores" color="#f59e0b">
              <div className="grid grid-cols-3 gap-3">
                <ScoreCard label="Performance" score={result.pageSpeed.performanceScore} />
                <ScoreCard label="SEO" score={result.pageSpeed.seoScore} />
                <ScoreCard label="Accessibility" score={result.pageSpeed.accessibilityScore} />
              </div>
            </Section>
          )}

          {/* Site Age */}
          {result.siteAge && (
            <div className="px-5 py-3 text-xs" style={{ color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
              First seen on Wayback Machine: {result.siteAge.firstSeen} ({result.siteAge.snapshotCount.toLocaleString()} snapshots)
            </div>
          )}

          {/* CTA */}
          <div className="p-4 text-center" style={{ background: "var(--bg)" }}>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
            >
              Track This Competitor
              <Shield className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCell({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-3 text-center" style={{ borderRight: "1px solid var(--border)" }}>
      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
      <div className="text-xs font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    </div>
  );
}

function Section({ title, color, children }: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>{title}</h4>
      {children}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const color = score >= 90 ? "var(--success)" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="text-center p-3 rounded-lg" style={{ background: "var(--bg)" }}>
      <div className="text-2xl font-bold mb-0.5" style={{ color }}>{score}</div>
      <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    </div>
  );
}
