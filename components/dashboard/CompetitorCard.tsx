"use client";

import Link from "next/link";
import { ExternalLink, TrendingUp } from "lucide-react";
import { formatBudget, formatRelativeTime } from "@/lib/mock-data/index";
import type { Competitor } from "@/lib/types";

interface CompetitorCardProps {
  readonly competitor: Competitor;
}

function TrendColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <Link href={`/ad-intelligence/dashboard/${competitor.id}`}>
      <div className="card card-hover p-5 cursor-pointer h-full flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text)] text-base leading-tight truncate">
              {competitor.name}
            </h3>
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
              <ExternalLink className="w-3 h-3" />
              {competitor.domain}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-blue-500/20 flex-shrink-0">
            {competitor.industry.split(" ")[0]}
          </span>
        </div>

        {/* Budget and Ads */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-lg font-bold text-emerald-400">
              {formatBudget(competitor.monthlyBudgetEstimate)}
            </span>
            <span className="text-xs text-[var(--text-dim)] block">est. monthly</span>
          </div>
          <div>
            <span className="text-lg font-bold text-[var(--text)]">
              {competitor.activeAdCount}
            </span>
            <span className="text-xs text-[var(--text-dim)] block">active ads</span>
          </div>
        </div>

        {/* Channels */}
        <div className="flex items-center gap-1.5">
          {competitor.channels.map((channel) => (
            <span
              key={channel}
              className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                channel === "google"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : channel === "meta"
                  ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}
            >
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </span>
          ))}
        </div>

        {/* Trend Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trend Score
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: TrendColor(competitor.trendScore) }}
            >
              {competitor.trendScore}/100
            </span>
          </div>
          <div className="trend-bar">
            <div
              className="trend-fill"
              style={{
                width: `${competitor.trendScore}%`,
                backgroundColor: TrendColor(competitor.trendScore),
              }}
            />
          </div>
        </div>

        {/* Last Updated */}
        <span className="text-xs text-[var(--text-dim)] mt-auto">
          Updated {formatRelativeTime(competitor.lastUpdatedAt)}
        </span>
      </div>
    </Link>
  );
}
