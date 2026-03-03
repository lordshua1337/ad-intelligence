"use client";

import { ExternalLink } from "lucide-react";
import { SourceBadge } from "@/components/common/SourceBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatBudget } from "@/lib/mock-data/index";
import type { Ad } from "@/lib/types";

interface AdCardProps {
  readonly ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  const domain = (() => {
    try {
      return new URL(ad.landingUrl).hostname;
    } catch {
      return ad.landingUrl;
    }
  })();

  return (
    <div className="card p-4 flex flex-col gap-3 h-full">
      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        <SourceBadge source={ad.source} />
        <StatusBadge status={ad.status} />
        <span className="ml-auto text-xs font-semibold text-emerald-400">
          {formatBudget(ad.estimatedSpendMonthly)}/mo
        </span>
      </div>

      {/* Headline */}
      <h4 className="text-sm font-semibold text-[var(--text)] leading-snug">
        {ad.headline}
      </h4>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">
        {ad.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-blue-500/20">
          {ad.cta}
        </span>
        <a
          href={ad.landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {domain}
        </a>
      </div>
    </div>
  );
}
