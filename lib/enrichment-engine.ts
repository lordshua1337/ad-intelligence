import type {
  EnrichmentData,
  TechDetection,
  AdPixelDetection,
  AnalyticsDetection,
  SocialLink,
} from "./enrichment-types";

// --- Tech stack detection patterns ---
const TECH_PATTERNS: readonly {
  readonly name: string;
  readonly category: TechDetection["category"];
  readonly patterns: readonly RegExp[];
}[] = [
  { name: "React", category: "framework", patterns: [/react[-.]/, /__NEXT_DATA__/, /react\.production/, /_next\//] },
  { name: "Next.js", category: "framework", patterns: [/__NEXT_DATA__/, /_next\/static/, /next\/router/] },
  { name: "Vue.js", category: "framework", patterns: [/vue\.runtime/, /vue\.global/, /__vue_app__/, /vue@/] },
  { name: "Nuxt", category: "framework", patterns: [/__nuxt/, /nuxt\.js/, /_nuxt\//] },
  { name: "Angular", category: "framework", patterns: [/ng-version/, /angular\.io/, /zone\.js/] },
  { name: "Svelte", category: "framework", patterns: [/svelte/, /__svelte/] },
  { name: "jQuery", category: "framework", patterns: [/jquery[-.]/, /jquery\.min/] },
  { name: "WordPress", category: "cms", patterns: [/wp-content/, /wp-includes/, /wp-json/, /wordpress/i] },
  { name: "Webflow", category: "cms", patterns: [/webflow\.com/, /wf-page/, /webflow\.js/] },
  { name: "Wix", category: "cms", patterns: [/wix\.com/, /wixstatic\.com/, /parastorage\.com/] },
  { name: "Squarespace", category: "cms", patterns: [/squarespace\.com/, /sqsp\.com/, /squarespace-cdn/] },
  { name: "Ghost", category: "cms", patterns: [/ghost\.org/, /ghost\.io/, /ghost-/] },
  { name: "Shopify", category: "ecommerce", patterns: [/shopify\.com/, /cdn\.shopify/, /myshopify\.com/] },
  { name: "WooCommerce", category: "ecommerce", patterns: [/woocommerce/, /wc-ajax/] },
  { name: "BigCommerce", category: "ecommerce", patterns: [/bigcommerce\.com/, /bigcommerce-/] },
  { name: "Magento", category: "ecommerce", patterns: [/magento/, /mage\//, /varien/] },
  { name: "Vercel", category: "hosting", patterns: [/vercel\.app/, /vercel-analytics/, /_vercel\//] },
  { name: "Netlify", category: "hosting", patterns: [/netlify\.app/, /netlify-/] },
  { name: "AWS", category: "hosting", patterns: [/amazonaws\.com/, /cloudfront\.net/, /aws-/] },
  { name: "Cloudflare", category: "cdn", patterns: [/cloudflare/, /cdnjs\.cloudflare/, /cf-ray/] },
  { name: "Fastly", category: "cdn", patterns: [/fastly/, /fastlylabs/] },
  { name: "Tailwind CSS", category: "other", patterns: [/tailwindcss/, /tailwind\./, /tw-/] },
  { name: "Bootstrap", category: "other", patterns: [/bootstrap[-.]/, /bootstrap\.min/] },
  { name: "TypeScript", category: "other", patterns: [/\.tsx?/, /typescript/] },
  { name: "HubSpot CMS", category: "cms", patterns: [/hubspot\.com/, /hs-scripts/, /hbspt\./] },
];

// --- Ad pixel detection patterns ---
const AD_PIXEL_PATTERNS: readonly {
  readonly platform: string;
  readonly patterns: readonly RegExp[];
  readonly idPattern?: RegExp;
}[] = [
  {
    platform: "Facebook Pixel",
    patterns: [/fbq\(/, /facebook\.com\/tr/, /connect\.facebook\.net\/.*\/fbevents/],
    idPattern: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/,
  },
  {
    platform: "Google Ads",
    patterns: [/googleadservices\.com/, /google_tag_id/, /gtag.*AW-/, /conversion\.js/],
    idPattern: /AW-(\d+)/,
  },
  {
    platform: "Google Tag Manager",
    patterns: [/googletagmanager\.com\/gtm/, /GTM-[A-Z0-9]+/],
    idPattern: /(GTM-[A-Z0-9]+)/,
  },
  {
    platform: "LinkedIn Insight",
    patterns: [/snap\.licdn\.com/, /linkedin\.com\/px/, /linkedin_partner_id/],
    idPattern: /linkedin_partner_id\s*=\s*['"](\d+)['"]/,
  },
  {
    platform: "Twitter Pixel",
    patterns: [/static\.ads-twitter\.com/, /twq\(/, /twitter\.com\/i\/adsct/],
  },
  {
    platform: "TikTok Pixel",
    patterns: [/analytics\.tiktok\.com/, /ttq\.load/],
  },
  {
    platform: "Pinterest Tag",
    patterns: [/pintrk\(/, /ct\.pinterest\.com/],
  },
  {
    platform: "Microsoft Ads (Bing)",
    patterns: [/bat\.bing\.com/, /uetag/, /UET tag/],
  },
  {
    platform: "Snapchat Pixel",
    patterns: [/sc-static\.net\/scevent/, /snapchat\.com.*pixel/],
  },
];

// --- Analytics detection patterns ---
const ANALYTICS_PATTERNS: readonly {
  readonly name: string;
  readonly patterns: readonly RegExp[];
}[] = [
  { name: "Google Analytics (GA4)", patterns: [/gtag.*G-/, /googletagmanager\.com.*GA/] },
  { name: "Google Analytics (UA)", patterns: [/google-analytics\.com/, /UA-\d+/] },
  { name: "Hotjar", patterns: [/hotjar\.com/, /hj\(/, /hotjar-/] },
  { name: "Mixpanel", patterns: [/mixpanel\.com/, /mixpanel\.init/] },
  { name: "Amplitude", patterns: [/amplitude\.com/, /amplitude\.init/] },
  { name: "Segment", patterns: [/segment\.com\/analytics/, /analytics\.load/] },
  { name: "Heap", patterns: [/heap-\d+/, /heapanalytics\.com/] },
  { name: "Plausible", patterns: [/plausible\.io/] },
  { name: "Fathom", patterns: [/usefathom\.com/] },
  { name: "Crisp Chat", patterns: [/crisp\.chat/, /crisp\.im/] },
  { name: "Intercom", patterns: [/intercom\.com/, /intercomSettings/] },
  { name: "Drift", patterns: [/drift\.com/, /driftt\.com/] },
  { name: "Zendesk", patterns: [/zendesk\.com/, /zdassets\.com/] },
  { name: "HubSpot Analytics", patterns: [/js\.hs-analytics/, /hubspot\.com.*analytics/] },
  { name: "Clarity (Microsoft)", patterns: [/clarity\.ms/] },
  { name: "FullStory", patterns: [/fullstory\.com/] },
  { name: "PostHog", patterns: [/posthog\.com/, /posthog-js/] },
];

// --- Social link patterns ---
const SOCIAL_PATTERNS: readonly {
  readonly platform: string;
  readonly pattern: RegExp;
}[] = [
  { platform: "Twitter/X", pattern: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+/ },
  { platform: "LinkedIn", pattern: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9_-]+/ },
  { platform: "Facebook", pattern: /https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9._-]+/ },
  { platform: "Instagram", pattern: /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9._]+/ },
  { platform: "YouTube", pattern: /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/)[a-zA-Z0-9_-]+/ },
  { platform: "GitHub", pattern: /https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/ },
  { platform: "TikTok", pattern: /https?:\/\/(?:www\.)?tiktok\.com\/@[a-zA-Z0-9._]+/ },
];

// --- Main enrichment functions ---

function extractHeadAndScripts(html: string): string {
  // Only look at <head>, <script>, <link>, and <meta> tags to avoid false positives
  // from body content (e.g. "WordPress" mentioned in marketing text)
  const parts: string[] = [];

  // Extract <head> content
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) parts.push(headMatch[1]);

  // Extract all <script> tags (including src attributes and inline content)
  const scriptMatches = html.matchAll(/<script[^>]*(?:src=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of scriptMatches) {
    if (m[1]) parts.push(m[1]); // src attribute
    if (m[2]) parts.push(m[2]); // inline content
  }

  // Extract all <link> href attributes
  const linkMatches = html.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*>/gi);
  for (const m of linkMatches) {
    if (m[1]) parts.push(m[1]);
  }

  // Extract all <meta> content
  const metaMatches = html.matchAll(/<meta[^>]*>/gi);
  for (const m of metaMatches) {
    parts.push(m[0]);
  }

  // Extract style href attributes
  const styleMatches = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  for (const m of styleMatches) {
    if (m[1]) parts.push(m[1]);
  }

  return parts.join("\n");
}

export function detectTechStack(html: string): TechDetection[] {
  // Only scan head/script/link/meta sections to avoid false positives from body text
  const techHtml = extractHeadAndScripts(html);
  const detected: TechDetection[] = [];
  const seen = new Set<string>();

  for (const tech of TECH_PATTERNS) {
    if (seen.has(tech.name)) continue;

    let matchCount = 0;
    for (const pattern of tech.patterns) {
      if (pattern.test(techHtml)) matchCount++;
    }

    if (matchCount > 0) {
      seen.add(tech.name);
      detected.push({
        name: tech.name,
        category: tech.category,
        confidence: matchCount >= 2 ? "high" : "medium",
      });
    }
  }

  return detected;
}

export function detectAdPixels(html: string): AdPixelDetection[] {
  // Scan both head/scripts AND full HTML for ad pixels since they can be anywhere
  const techHtml = extractHeadAndScripts(html);
  const combined = techHtml + "\n" + html;

  return AD_PIXEL_PATTERNS.map((pixel) => {
    const isDetected = pixel.patterns.some((p) => p.test(combined));
    let pixelId: string | undefined;

    if (isDetected && pixel.idPattern) {
      const match = combined.match(pixel.idPattern);
      if (match) pixelId = match[1];
    }

    return {
      platform: pixel.platform,
      detected: isDetected,
      pixelId,
    };
  });
}

export function detectAnalytics(html: string): AnalyticsDetection[] {
  const techHtml = extractHeadAndScripts(html);
  const combined = techHtml + "\n" + html;

  return ANALYTICS_PATTERNS.map((tool) => ({
    name: tool.name,
    detected: tool.patterns.some((p) => p.test(combined)),
  }));
}

export function extractSocialLinks(html: string): SocialLink[] {
  const links: SocialLink[] = [];
  const seen = new Set<string>();

  for (const social of SOCIAL_PATTERNS) {
    const matches = html.match(new RegExp(social.pattern.source, "gi"));
    if (matches) {
      for (const url of matches) {
        // Skip generic platform URLs and login/share links
        if (url.includes("/sharer") || url.includes("/share") || url.includes("/intent")) continue;
        if (url.includes("/login") || url.includes("/signup")) continue;

        const key = `${social.platform}:${url}`;
        if (!seen.has(key)) {
          seen.add(key);
          links.push({ platform: social.platform, url });
          break; // One per platform
        }
      }
    }
  }

  return links;
}

export function extractCompanyInfo(html: string): {
  title: string;
  description: string;
  ogImage?: string;
} {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : "";

  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const ogImage = ogImageMatch ? ogImageMatch[1] : undefined;

  return { title, description, ogImage };
}

// --- Google PageSpeed Insights ---
export async function fetchPageSpeed(url: string): Promise<EnrichmentData["pageSpeed"] | null> {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=seo&category=accessibility`;

    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) return null;

    const data = await response.json();
    const categories = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    if (!categories) return null;

    return {
      performanceScore: Math.round((categories.performance?.score ?? 0) * 100),
      seoScore: Math.round((categories.seo?.score ?? 0) * 100),
      accessibilityScore: Math.round((categories.accessibility?.score ?? 0) * 100),
      firstContentfulPaint: audits?.["first-contentful-paint"]?.displayValue ?? "N/A",
      largestContentfulPaint: audits?.["largest-contentful-paint"]?.displayValue ?? "N/A",
    };
  } catch {
    return null;
  }
}

// --- Wayback Machine ---
export async function fetchSiteAge(domain: string): Promise<EnrichmentData["siteAge"] | null> {
  try {
    // Get first snapshot
    const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}&output=json&limit=1&fl=timestamp&sort=asc`;
    const cdxResponse = await fetch(cdxUrl, { signal: AbortSignal.timeout(10000) });

    if (!cdxResponse.ok) return null;

    const cdxData = await cdxResponse.json();
    if (!cdxData || cdxData.length < 2) return null;

    const timestamp = cdxData[1][0]; // First row after header
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const firstSeen = `${year}-${month}-${day}`;

    // Get snapshot count (approximate)
    const countUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}&output=json&limit=0&showNumPages=true`;
    const countResponse = await fetch(countUrl, { signal: AbortSignal.timeout(10000) });
    let snapshotCount = 0;
    if (countResponse.ok) {
      const countText = await countResponse.text();
      snapshotCount = parseInt(countText, 10) || 0;
    }

    return { firstSeen, snapshotCount };
  } catch {
    return null;
  }
}

// --- Full enrichment pipeline (server-side) ---
export async function enrichCompetitor(domain: string): Promise<EnrichmentData> {
  const errors: string[] = [];
  const url = `https://${domain}`;

  // Fetch homepage HTML
  let html = "";
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AdIntelBot/1.0)",
        "Accept": "text/html",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      html = await response.text();
    } else {
      errors.push(`Homepage returned ${response.status}`);
    }
  } catch (err) {
    errors.push(`Failed to fetch homepage: ${err instanceof Error ? err.message : "unknown"}`);
  }

  // Extract data from HTML
  const companyInfo = html ? extractCompanyInfo(html) : { title: "", description: "" };
  const techStack = html ? detectTechStack(html) : [];
  const adPixels = html ? detectAdPixels(html) : [];
  const analytics = html ? detectAnalytics(html) : [];
  const socialLinks = html ? extractSocialLinks(html) : [];

  // Fetch PageSpeed and Wayback in parallel (with short timeouts so they don't block)
  const [pageSpeed, siteAge] = await Promise.all([
    fetchPageSpeed(url).catch(() => null),
    fetchSiteAge(domain).catch(() => null),
  ]);

  const hasData = html.length > 0 || pageSpeed !== null || siteAge !== null;

  return {
    domain,
    fetchedAt: new Date().toISOString(),
    companyInfo: {
      ...companyInfo,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    },
    techStack,
    adPixels,
    analytics,
    socialLinks,
    pageSpeed: pageSpeed ?? undefined,
    siteAge: siteAge ?? undefined,
    status: errors.length === 0 ? "complete" : hasData ? "partial" : "error",
    errors,
  };
}
