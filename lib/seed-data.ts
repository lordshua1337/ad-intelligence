// Pre-cached enrichment data for demo companies
// These load on first visit so the dashboard looks alive instantly

import type { Competitor } from "./types";
import type { EnrichmentData } from "./enrichment-types";

const SEED_ENRICHMENTS: Record<string, EnrichmentData> = {
  "shopify.com": {
    domain: "shopify.com",
    fetchedAt: "2026-03-05T12:00:00Z",
    companyInfo: {
      title: "Shopify",
      description: "The commerce platform powering millions of businesses worldwide. Start, run, and grow your business.",
      ogImage: "https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-og.png",
    },
    techStack: [
      { name: "React", category: "framework", confidence: "high" },
      { name: "Next.js", category: "framework", confidence: "high" },
      { name: "Cloudflare", category: "cdn", confidence: "high" },
      { name: "Ruby on Rails", category: "framework", confidence: "medium" },
      { name: "Google Cloud", category: "hosting", confidence: "medium" },
    ],
    adPixels: [
      { platform: "Google Ads", detected: true, pixelId: "AW-XXXXXXXXX" },
      { platform: "Meta Pixel", detected: true, pixelId: "XXXXXXXXXX" },
      { platform: "LinkedIn Insight", detected: true },
      { platform: "TikTok Pixel", detected: true },
    ],
    analytics: [
      { name: "Google Analytics 4", detected: true },
      { name: "Segment", detected: true },
      { name: "Optimizely", detected: true },
      { name: "Hotjar", detected: false },
    ],
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/shopify" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/shopify" },
      { platform: "Instagram", url: "https://instagram.com/shopify" },
      { platform: "YouTube", url: "https://youtube.com/shopify" },
    ],
    pageSpeed: {
      performanceScore: 78,
      seoScore: 92,
      accessibilityScore: 85,
      firstContentfulPaint: "1.2s",
      largestContentfulPaint: "2.8s",
    },
    siteAge: { firstSeen: "2006-06-02", snapshotCount: 45000 },
    status: "complete",
    errors: [],
  },
  "hubspot.com": {
    domain: "hubspot.com",
    fetchedAt: "2026-03-05T12:00:00Z",
    companyInfo: {
      title: "HubSpot",
      description: "HubSpot's CRM platform has all the tools and integrations you need for marketing, sales, content management, and customer service.",
    },
    techStack: [
      { name: "React", category: "framework", confidence: "high" },
      { name: "HubSpot CMS", category: "cms", confidence: "high" },
      { name: "Cloudflare", category: "cdn", confidence: "high" },
      { name: "AWS", category: "hosting", confidence: "high" },
    ],
    adPixels: [
      { platform: "Google Ads", detected: true, pixelId: "AW-XXXXXXXXX" },
      { platform: "Meta Pixel", detected: true, pixelId: "XXXXXXXXXX" },
      { platform: "LinkedIn Insight", detected: true },
      { platform: "Bing Ads", detected: true },
    ],
    analytics: [
      { name: "Google Analytics 4", detected: true },
      { name: "HubSpot Analytics", detected: true },
      { name: "Drift", detected: true },
      { name: "Clearbit", detected: true },
    ],
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/HubSpot" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/hubspot" },
      { platform: "YouTube", url: "https://youtube.com/hubspot" },
    ],
    pageSpeed: {
      performanceScore: 65,
      seoScore: 95,
      accessibilityScore: 88,
      firstContentfulPaint: "1.8s",
      largestContentfulPaint: "3.5s",
    },
    siteAge: { firstSeen: "2006-06-09", snapshotCount: 38000 },
    status: "complete",
    errors: [],
  },
  "notion.so": {
    domain: "notion.so",
    fetchedAt: "2026-03-05T12:00:00Z",
    companyInfo: {
      title: "Notion",
      description: "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
    },
    techStack: [
      { name: "React", category: "framework", confidence: "high" },
      { name: "Next.js", category: "framework", confidence: "medium" },
      { name: "Cloudflare", category: "cdn", confidence: "high" },
      { name: "AWS", category: "hosting", confidence: "medium" },
    ],
    adPixels: [
      { platform: "Google Ads", detected: true },
      { platform: "Meta Pixel", detected: true },
      { platform: "LinkedIn Insight", detected: false },
    ],
    analytics: [
      { name: "Google Analytics 4", detected: true },
      { name: "Amplitude", detected: true },
      { name: "Segment", detected: true },
    ],
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/NotionHQ" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/notionhq" },
    ],
    pageSpeed: {
      performanceScore: 82,
      seoScore: 88,
      accessibilityScore: 91,
      firstContentfulPaint: "0.9s",
      largestContentfulPaint: "2.1s",
    },
    siteAge: { firstSeen: "2016-03-01", snapshotCount: 12000 },
    status: "complete",
    errors: [],
  },
  "stripe.com": {
    domain: "stripe.com",
    fetchedAt: "2026-03-05T12:00:00Z",
    companyInfo: {
      title: "Stripe",
      description: "Online payment processing for internet businesses. Stripe is a suite of payment APIs that powers commerce for online businesses.",
    },
    techStack: [
      { name: "React", category: "framework", confidence: "high" },
      { name: "Ruby", category: "framework", confidence: "medium" },
      { name: "Cloudflare", category: "cdn", confidence: "high" },
      { name: "AWS", category: "hosting", confidence: "high" },
    ],
    adPixels: [
      { platform: "Google Ads", detected: true },
      { platform: "LinkedIn Insight", detected: true },
      { platform: "Meta Pixel", detected: false },
    ],
    analytics: [
      { name: "Google Analytics 4", detected: true },
      { name: "Segment", detected: true },
      { name: "Sentry", detected: true },
    ],
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/stripe" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/stripe" },
      { platform: "GitHub", url: "https://github.com/stripe" },
    ],
    pageSpeed: {
      performanceScore: 91,
      seoScore: 96,
      accessibilityScore: 93,
      firstContentfulPaint: "0.7s",
      largestContentfulPaint: "1.5s",
    },
    siteAge: { firstSeen: "2010-09-30", snapshotCount: 22000 },
    status: "complete",
    errors: [],
  },
};

export function getSeedCompetitors(): Competitor[] {
  const now = new Date().toISOString();

  return Object.entries(SEED_ENRICHMENTS).map(([domain, enrichment], idx) => ({
    id: `seed-${idx}-${domain.replace(/\./g, "-")}`,
    domain,
    name: enrichment.companyInfo.title,
    industry: "Technology",
    monthlyBudgetEstimate: [150000, 280000, 95000, 200000][idx] ?? 100000,
    activeAdCount: [42, 67, 28, 35][idx] ?? 30,
    channels: enrichment.adPixels.filter(p => p.detected).map(p => p.platform),
    firstSeenAt: enrichment.siteAge?.firstSeen ?? now,
    lastUpdatedAt: now,
    trendScore: [85, 72, 90, 88][idx] ?? 70,
    enrichment,
    enrichmentStatus: "complete" as const,
  }));
}

// Deep Dive pre-cached analyses
export const DEEP_DIVE_ANALYSES: Record<string, string> = {
  "shopify.com": `## Shopify Competitive Intelligence Deep Dive

### Advertising Strategy
Shopify runs aggressive multi-platform campaigns across Google, Meta, LinkedIn, and TikTok. Their pixel coverage suggests a full-funnel approach -- awareness on TikTok/Meta, consideration on LinkedIn, conversion on Google.

**Key insight:** The presence of 4 ad platforms simultaneously indicates they're spending $150K+/month on paid acquisition. Most SaaS companies this size use 2-3 platforms.

### Tech Stack Analysis
Running React + Next.js on their marketing site with Ruby on Rails powering the core platform. Cloudflare CDN for performance. This is a mature, well-optimized stack.

**Opportunity:** Their performance score of 78 is surprisingly low for a tech company. Core Web Vitals could be better -- LCP at 2.8s suggests heavy JavaScript bundles. If you're competing, a faster site gives you an edge in SEO.

### Analytics & Optimization
Segment + Google Analytics 4 + Optimizely shows a data-driven culture. They're running A/B tests continuously on their marketing pages.

**What this means:** Don't try to out-copy Shopify. They've tested every headline and CTA. Instead, compete on positioning -- find the niche they're not optimizing for.

### Recommended Actions
1. Monitor their Google Ads keywords -- they likely bid on competitor terms
2. Their TikTok presence is newer -- opportunity to establish your brand there before they dominate
3. Their LCP is slow. Use this in your positioning if you're a competing platform
4. They're heavy on LinkedIn B2B -- if you're B2C, focus ad spend on Instagram/TikTok instead`,

  "hubspot.com": `## HubSpot Competitive Intelligence Deep Dive

### Advertising Strategy
Full-spectrum campaign across Google, Meta, LinkedIn, and Bing. The Bing Ads pixel is notable -- most SaaS companies skip it. HubSpot is clearly optimizing for every available channel.

**Key insight:** Running their own CMS means they have total control over conversion optimization. Every page is a funnel.

### Tech Stack Analysis
React frontend on their own HubSpot CMS with AWS infrastructure. They eat their own dog food -- smart for credibility and fast iteration.

**Opportunity:** Performance score of 65 is weak for a marketing platform. LCP at 3.5s means slow landing pages. This is their biggest vulnerability -- if you're competing, speed wins.

### Analytics & Optimization
HubSpot Analytics + Drift (chat) + Clearbit (visitor identification) = they know who's on their site and what company they're from before you even fill out a form.

**What this means:** HubSpot's playbook is ABM (Account-Based Marketing). They identify high-value visitors, trigger Drift chat, and route to sales. To compete, you need similar visitor intelligence or a fundamentally different GTM motion.

### Recommended Actions
1. Their site speed is a real weakness -- emphasize speed/simplicity in your positioning
2. They're running Drift -- be prepared for aggressive chat outreach if you visit
3. SEO score of 95 means they dominate organic. Compete on long-tail, not head terms
4. Bing Ads presence means they're targeting enterprise (Bing skews older, enterprise users)`,

  "notion.so": `## Notion Competitive Intelligence Deep Dive

### Advertising Strategy
Lighter ad footprint than Shopify/HubSpot -- Google + Meta only, no LinkedIn. This suggests a product-led growth (PLG) strategy where organic/viral channels do most of the work.

**Key insight:** No LinkedIn pixel means Notion is relying on bottom-up adoption rather than top-down enterprise sales. Users sell it internally to their companies.

### Tech Stack Analysis
React + Next.js on Cloudflare with AWS. Clean, modern stack. Performance score of 82 is solid, and their 0.9s FCP shows they prioritize perceived speed.

**Opportunity:** Notion's .so domain means SEO plays differently. If you're competing in the productivity space, .com gives you a small but real advantage in brand searches.

### Analytics & Optimization
Amplitude + Segment = deep product analytics. They're tracking everything users do inside the app and optimizing onboarding flows aggressively.

**What this means:** Notion knows exactly where users drop off and what features drive retention. Their PLG engine is extremely data-driven. Competing means you need similar product analytics depth.

### Recommended Actions
1. Notion's weakness is complexity -- position as simpler/faster for specific use cases
2. Their lack of LinkedIn targeting creates an opening for enterprise-focused competitors
3. Monitor their product changelog -- Notion ships fast and expands into adjacent categories
4. Community and template ecosystem is their moat -- build your own or find a different wedge`,

  "stripe.com": `## Stripe Competitive Intelligence Deep Dive

### Advertising Strategy
Focused approach: Google + LinkedIn only, no Meta. This is classic developer/enterprise targeting. No TikTok, no Instagram -- Stripe sells to builders, not browsers.

**Key insight:** The absence of Meta Pixel is deliberate. Stripe's buyer persona doesn't respond to social media ads. They convert through docs, GitHub, and word-of-mouth.

### Tech Stack Analysis
React with Ruby backend on AWS + Cloudflare. Performance score of 91 is elite -- best in this comparison. 0.7s FCP and 1.5s LCP show engineering excellence extends to their marketing site.

**Opportunity:** Their GitHub presence is a key growth channel. Developer evangelism drives Stripe's adoption. If you're competing, you need strong developer docs and open-source presence.

### Analytics & Optimization
Segment + Sentry = reliability-focused culture. They're tracking errors as carefully as conversions. This is a payments company -- uptime and trust are the product.

**What this means:** Stripe doesn't optimize for clicks -- they optimize for trust. Their marketing is technical documentation that happens to convert. Competing means matching their technical credibility.

### Recommended Actions
1. Stripe's SEO score of 96 means they own developer-related payment queries
2. Their speed advantage (91 performance) reinforces the "reliable" brand perception
3. Compete on niche verticals Stripe under-serves (specific countries, specific industries)
4. Developer experience is their true moat -- competing means investing heavily in DX`,
};
