// Real competitive intelligence source URLs
// These link to actual, public ad transparency tools

export interface IntelSource {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly buildUrl: (domain: string) => string;
  readonly color: string;
  readonly bgColor: string;
  readonly borderColor: string;
}

export const INTEL_SOURCES: readonly IntelSource[] = [
  {
    id: "meta-ad-library",
    name: "Meta Ad Library",
    description: "View all active Facebook & Instagram ads",
    buildUrl: (domain) =>
      `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(domain)}`,
    color: "#A78BFA",
    bgColor: "rgba(139,92,246,0.1)",
    borderColor: "rgba(139,92,246,0.25)",
  },
  {
    id: "google-transparency",
    name: "Google Ads Transparency",
    description: "View all Google search and display ads",
    buildUrl: (domain) =>
      `https://adstransparency.google.com/?domain=${encodeURIComponent(domain)}`,
    color: "#60A5FA",
    bgColor: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.25)",
  },
  {
    id: "spyfu",
    name: "SpyFu",
    description: "Competitor keywords, ad history, and PPC data",
    buildUrl: (domain) =>
      `https://www.spyfu.com/overview/domain?query=${encodeURIComponent(domain)}`,
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.1)",
    borderColor: "rgba(245,158,11,0.25)",
  },
  {
    id: "similarweb",
    name: "SimilarWeb",
    description: "Traffic estimates, referral sources, audience data",
    buildUrl: (domain) =>
      `https://www.similarweb.com/website/${encodeURIComponent(domain)}/`,
    color: "#10B981",
    bgColor: "rgba(16,185,129,0.1)",
    borderColor: "rgba(16,185,129,0.25)",
  },
  {
    id: "semrush",
    name: "SEMrush",
    description: "Organic & paid search data, backlinks, content gaps",
    buildUrl: (domain) =>
      `https://www.semrush.com/analytics/overview/?q=${encodeURIComponent(domain)}&searchType=domain`,
    color: "#F97316",
    bgColor: "rgba(249,115,22,0.1)",
    borderColor: "rgba(249,115,22,0.25)",
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    description: "Backlink profile, organic keywords, content explorer",
    buildUrl: (domain) =>
      `https://ahrefs.com/site-explorer/overview/v2/exact/live?target=${encodeURIComponent(domain)}`,
    color: "#3B82F6",
    bgColor: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.25)",
  },
];

// Google Trends embed URL for a search term
export function getGoogleTrendsUrl(term: string): string {
  return `https://trends.google.com/trends/explore?q=${encodeURIComponent(term)}&geo=US`;
}

// Google favicon API
export function getFaviconUrl(domain: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

// Clearbit logo API (higher quality)
export function getLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${encodeURIComponent(domain)}`;
}
