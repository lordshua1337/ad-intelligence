export interface Competitor {
  readonly id: string;
  readonly domain: string;
  readonly name: string;
  readonly industry: string;
  readonly monthlyBudgetEstimate: number;
  readonly activeAdCount: number;
  readonly channels: readonly string[];
  readonly firstSeenAt: string;
  readonly lastUpdatedAt: string;
  readonly trendScore: number;
}

export interface Ad {
  readonly id: string;
  readonly competitorId: string;
  readonly source: "google" | "meta" | "native";
  readonly headline: string;
  readonly description: string;
  readonly cta: string;
  readonly landingUrl: string;
  readonly imageUrl?: string;
  readonly status: "active" | "paused" | "ended";
  readonly firstSeenAt: string;
  readonly lastSeenAt: string;
  readonly estimatedSpendMonthly: number;
}

export interface AdAnalysis {
  readonly adId: string;
  readonly headlineFormula: string;
  readonly emotionalTriggers: readonly string[];
  readonly ctaType: string;
  readonly sentiment: "positive" | "negative" | "neutral";
  readonly uniquenessScore: number;
  readonly copyLength: number;
}

export interface Keyword {
  readonly id: string;
  readonly keyword: string;
  readonly searchVolume: number;
  readonly cpcAvg: number;
  readonly cpcLow: number;
  readonly cpcHigh: number;
  readonly competitionLevel: "low" | "medium" | "high";
  readonly intent: "commercial" | "transactional" | "informational" | "navigational";
  readonly topCompetitors: readonly string[];
}

export interface Alert {
  readonly id: string;
  readonly type: "new_competitor" | "position_change" | "budget_spike" | "new_keyword";
  readonly title: string;
  readonly description: string;
  readonly severity: "info" | "warning" | "critical";
  readonly isRead: boolean;
  readonly competitorId?: string;
  readonly keywordId?: string;
  readonly createdAt: string;
  readonly metadata?: Record<string, unknown>;
}

export interface WeeklyBrief {
  readonly id: string;
  readonly generatedAt: string;
  readonly summary: string;
  readonly keyTakeaways: readonly string[];
  readonly topCompetitors: readonly { readonly name: string; readonly spend: number; readonly adCount: number }[];
  readonly trendingKeywords: readonly string[];
  readonly recommendations: readonly string[];
}

export interface ChannelMix {
  readonly channel: string;
  readonly adCount: number;
  readonly estimatedSpend: number;
  readonly percentage: number;
  readonly color: string;
}
