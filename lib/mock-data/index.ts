import { COMPETITORS } from "./competitors";
import { ADS } from "./ads";
import { AD_ANALYSES } from "./analysis";
import { KEYWORDS } from "./keywords";
import { ALERTS } from "./alerts";
import { BRIEFS } from "./briefs";
import type { Competitor, Ad, AdAnalysis, Keyword, Alert, WeeklyBrief, ChannelMix } from "../types";

export { COMPETITORS, ADS, AD_ANALYSES, KEYWORDS, ALERTS, BRIEFS };

// Competitor helpers
export function getCompetitors(): readonly Competitor[] {
  return COMPETITORS;
}

export function getCompetitorById(id: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.id === id);
}

// Ad helpers
export function getAdsForCompetitor(competitorId: string): readonly Ad[] {
  return ADS.filter((a) => a.competitorId === competitorId);
}

export function getAdById(id: string): Ad | undefined {
  return ADS.find((a) => a.id === id);
}

// Analysis helpers
export function getAnalysisForAd(adId: string): AdAnalysis | undefined {
  return AD_ANALYSES.find((a) => a.adId === adId);
}

export function getAnalysisForCompetitor(competitorId: string): readonly AdAnalysis[] {
  const competitorAdIds = new Set(
    ADS.filter((a) => a.competitorId === competitorId).map((a) => a.id)
  );
  return AD_ANALYSES.filter((a) => competitorAdIds.has(a.adId));
}

// Keyword helpers
export function getKeywords(): readonly Keyword[] {
  return KEYWORDS;
}

export function getKeywordsByIntent(
  intent: Keyword["intent"]
): readonly Keyword[] {
  return KEYWORDS.filter((k) => k.intent === intent);
}

export function getKeywordsByCompetition(
  level: Keyword["competitionLevel"]
): readonly Keyword[] {
  return KEYWORDS.filter((k) => k.competitionLevel === level);
}

// Alert helpers
export function getAlerts(unreadOnly = false): readonly Alert[] {
  return unreadOnly ? ALERTS.filter((a) => !a.isRead) : ALERTS;
}

export function getAlertCount(): { readonly total: number; readonly unread: number; readonly critical: number } {
  const unread = ALERTS.filter((a) => !a.isRead).length;
  const critical = ALERTS.filter((a) => a.severity === "critical").length;
  return { total: ALERTS.length, unread, critical };
}

// Brief helpers
export function getLatestBrief(): WeeklyBrief {
  return [...BRIEFS].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  )[0];
}

export function getAllBriefs(): readonly WeeklyBrief[] {
  return [...BRIEFS].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
}

// Channel mix helper
export function getChannelMix(competitorId?: string): readonly ChannelMix[] {
  const source = competitorId
    ? ADS.filter((a) => a.competitorId === competitorId)
    : ADS;

  const googleAds = source.filter((a) => a.source === "google");
  const metaAds = source.filter((a) => a.source === "meta");
  const nativeAds = source.filter((a) => a.source === "native");

  const googleSpend = googleAds.reduce((sum, a) => sum + a.estimatedSpendMonthly, 0);
  const metaSpend = metaAds.reduce((sum, a) => sum + a.estimatedSpendMonthly, 0);
  const nativeSpend = nativeAds.reduce((sum, a) => sum + a.estimatedSpendMonthly, 0);
  const totalSpend = googleSpend + metaSpend + nativeSpend;

  if (totalSpend === 0) {
    return [];
  }

  return [
    {
      channel: "Google",
      adCount: googleAds.length,
      estimatedSpend: googleSpend,
      percentage: Math.round((googleSpend / totalSpend) * 100),
      color: "#3B82F6",
    },
    {
      channel: "Meta",
      adCount: metaAds.length,
      estimatedSpend: metaSpend,
      percentage: Math.round((metaSpend / totalSpend) * 100),
      color: "#8B5CF6",
    },
    {
      channel: "Native",
      adCount: nativeAds.length,
      estimatedSpend: nativeSpend,
      percentage: Math.round((nativeSpend / totalSpend) * 100),
      color: "#64748B",
    },
  ];
}

// Format helpers
export function formatBudget(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`;
  }
  return `$${amount}`;
}

export function formatRelativeTime(isoString: string): string {
  const now = new Date("2026-03-03T00:00:00Z");
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
