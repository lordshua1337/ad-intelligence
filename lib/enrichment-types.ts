export interface EnrichmentData {
  readonly domain: string;
  readonly fetchedAt: string;

  // Company info (scraped from homepage)
  readonly companyInfo: {
    readonly title: string;
    readonly description: string;
    readonly ogImage?: string;
    readonly favicon?: string;
  };

  // Tech stack detected from HTML
  readonly techStack: readonly TechDetection[];

  // Ad pixels / tracking detected
  readonly adPixels: readonly AdPixelDetection[];

  // Analytics tools detected
  readonly analytics: readonly AnalyticsDetection[];

  // Social media links found
  readonly socialLinks: readonly SocialLink[];

  // Google PageSpeed data
  readonly pageSpeed?: {
    readonly performanceScore: number;
    readonly seoScore: number;
    readonly accessibilityScore: number;
    readonly firstContentfulPaint: string;
    readonly largestContentfulPaint: string;
  };

  // Wayback Machine data
  readonly siteAge?: {
    readonly firstSeen: string;
    readonly snapshotCount: number;
  };

  // Status
  readonly status: "complete" | "partial" | "error";
  readonly errors: readonly string[];
}

export interface TechDetection {
  readonly name: string;
  readonly category: "framework" | "cms" | "ecommerce" | "hosting" | "cdn" | "other";
  readonly confidence: "high" | "medium" | "low";
}

export interface AdPixelDetection {
  readonly platform: string;
  readonly detected: boolean;
  readonly pixelId?: string;
}

export interface AnalyticsDetection {
  readonly name: string;
  readonly detected: boolean;
}

export interface SocialLink {
  readonly platform: string;
  readonly url: string;
}
