"use client";

import Link from "next/link";
import { ExternalLink, TrendingUp } from "lucide-react";
import { formatBudget, formatRelativeTime } from "@/lib/mock-data/index";
import { getFaviconUrl } from "@/lib/intelligence-sources";
import type { Competitor } from "@/lib/types";

interface CompetitorCardProps {
  readonly competitor: Competitor;
  readonly onClick?: () => void;
}

function TrendColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export function CompetitorCard({ competitor, onClick }: CompetitorCardProps) {
  const isCustom = competitor.id.startsWith("custom-");
  const faviconSrc = getFaviconUrl(competitor.domain, 32);

  const cardContent = (
    <div className="card card-hover p-5 cursor-pointer h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Real favicon */}
          <img
            src={faviconSrc}
            alt=""
            className="w-6 h-6 rounded flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text)] text-base leading-tight truncate">
              {competitor.name}
            </h3>
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
              <ExternalLink className="w-3 h-3" />
              {competitor.domain}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-blue-500/20 flex-shrink-0">
          {competitor.industry.split(" ")[0]}
        </span>
      </div>

      {/* Quick intel links */}
      <div className="flex gap-1.5">
        <a
          href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(competitor.domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
          style={{
            background: "rgba(139,92,246,0.1)",
            color: "#A78BFA",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          Meta Ads
        </a>
        <a
          href={`https://adstransparency.google.com/?domain=${encodeURIComponent(competitor.domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#60A5FA",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          Google Ads
        </a>
        <a
          href={`https://www.spyfu.com/overview/domain?query=${encodeURIComponent(competitor.domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
          style={{
            background: "rgba(245,158,11,0.1)",
            color: "#F59E0B",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          SpyFu
        </a>
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
  );

  // Custom competitors use onClick (modal), mock competitors use Link
  if (isCustom && onClick) {
    return (
      <div onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/dashboard/${competitor.id}`}>
      {cardContent}
    </Link>
  );
}
