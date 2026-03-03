"use client";

import type { AdAnalysis } from "@/lib/types";

interface PatternInsightsProps {
  readonly analyses: readonly AdAnalysis[];
}

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  return items.reduce(
    (acc, item) => {
      const k = key(item);
      return { ...acc, [k]: (acc[k] ?? 0) + 1 };
    },
    {} as Record<string, number>
  );
}

function topN(counts: Record<string, number>, n: number): Array<{ label: string; count: number }> {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

export function PatternInsights({ analyses }: PatternInsightsProps) {
  if (analyses.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-dim)]">
        No analysis data available.
      </div>
    );
  }

  // Headline formulas
  const formulaCounts = countBy(analyses, (a) => a.headlineFormula);
  const topFormulas = topN(formulaCounts, 6);
  const maxFormulaCount = Math.max(...topFormulas.map((f) => f.count));

  // Emotional triggers (flatten)
  const allTriggers = analyses.flatMap((a) => [...a.emotionalTriggers]);
  const triggerCounts = countBy(allTriggers, (t) => t);
  const topTriggers = topN(triggerCounts, 8);
  const maxTriggerCount = Math.max(...topTriggers.map((t) => t.count));

  // Sentiment distribution
  const sentimentCounts = countBy(analyses, (a) => a.sentiment);
  const total = analyses.length;
  const sentimentData = [
    { label: "Positive", count: sentimentCounts["positive"] ?? 0, color: "#10B981" },
    { label: "Neutral", count: sentimentCounts["neutral"] ?? 0, color: "#F59E0B" },
    { label: "Negative", count: sentimentCounts["negative"] ?? 0, color: "#EF4444" },
  ];

  // Uniqueness distribution
  const buckets = [
    { label: "20-40", min: 20, max: 40, count: 0 },
    { label: "40-60", min: 40, max: 60, count: 0 },
    { label: "60-80", min: 60, max: 80, count: 0 },
    { label: "80-100", min: 80, max: 100, count: 0 },
  ];
  const updatedBuckets = buckets.map((b) => ({
    ...b,
    count: analyses.filter((a) => a.uniquenessScore >= b.min && a.uniquenessScore < b.max + 1).length,
  }));
  const maxBucketCount = Math.max(...updatedBuckets.map((b) => b.count), 1);

  const triggerColors: Record<string, string> = {
    social_proof: "#3B82F6",
    authority: "#8B5CF6",
    aspiration: "#10B981",
    trust: "#06B6D4",
    urgency: "#F59E0B",
    fomo: "#F97316",
    curiosity: "#EC4899",
    fear: "#EF4444",
    scarcity: "#EAB308",
    exclusivity: "#84CC16",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Headline Formulas */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
          Top Headline Formulas
        </h3>
        <div className="flex flex-col gap-2.5">
          {topFormulas.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-[var(--text-secondary)] truncate pr-2">
                  {f.label}
                </span>
                <span className="text-xs font-medium text-[var(--text)] flex-shrink-0">
                  {f.count}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                  style={{ width: `${(f.count / maxFormulaCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Triggers */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
          Emotional Trigger Frequency
        </h3>
        <div className="flex flex-col gap-2">
          {topTriggers.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary)] w-24 flex-shrink-0 capitalize">
                {t.label.replace("_", " ")}
              </span>
              <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(t.count / maxTriggerCount) * 100}%`,
                    backgroundColor: triggerColors[t.label] ?? "#64748B",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--text)] w-6 text-right flex-shrink-0">
                {t.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
          Sentiment Distribution
        </h3>
        <div className="flex items-end gap-3 h-24">
          {sentimentData.map((s) => {
            const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[var(--text)]">{pct}%</span>
                <div
                  className="w-full rounded-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(pct * 0.6, 4)}px`,
                    backgroundColor: s.color,
                    opacity: 0.85,
                  }}
                />
                <span className="text-xs text-[var(--text-dim)] text-center">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uniqueness Score Histogram */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
          Uniqueness Score Distribution
        </h3>
        <div className="flex items-end gap-3 h-24">
          {updatedBuckets.map((b) => {
            const pct = maxBucketCount > 0 ? (b.count / maxBucketCount) * 100 : 0;
            return (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[var(--text)]">{b.count}</span>
                <div
                  className="w-full rounded-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(pct * 0.6, 4)}px`,
                    backgroundColor: "#8B5CF6",
                    opacity: 0.8,
                  }}
                />
                <span className="text-xs text-[var(--text-dim)] text-center">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[var(--text-dim)] mt-2">Score range (0-100)</p>
      </div>
    </div>
  );
}
