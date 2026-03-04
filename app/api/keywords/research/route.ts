import { NextRequest, NextResponse } from "next/server"

// SerpAPI-powered keyword research
// Takes a seed keyword, returns related keywords with competition data from SERPs

const SERPAPI_BASE = "https://serpapi.com/search.json"

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("q")

  if (!keyword || keyword.length < 2) {
    return NextResponse.json(
      { error: "q parameter required (min 2 chars)" },
      { status: 400 }
    )
  }

  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "SERPAPI_API_KEY not configured", demo: true },
      { status: 503 }
    )
  }

  try {
    // Run two SerpAPI calls in parallel:
    // 1. Standard Google search (gets ads, organic, related searches)
    // 2. Google Autocomplete (gets keyword suggestions)
    const [searchRes, autocompleteRes] = await Promise.all([
      fetch(
        `${SERPAPI_BASE}?${new URLSearchParams({
          engine: "google",
          q: keyword,
          api_key: apiKey,
          num: "20",
          gl: "us",
          hl: "en",
        })}`
      ),
      fetch(
        `${SERPAPI_BASE}?${new URLSearchParams({
          engine: "google_autocomplete",
          q: keyword,
          api_key: apiKey,
          gl: "us",
          hl: "en",
        })}`
      ),
    ])

    if (!searchRes.ok) {
      throw new Error(`SerpAPI search returned ${searchRes.status}`)
    }

    const searchData = await searchRes.json()
    const autocompleteData = autocompleteRes.ok ? await autocompleteRes.json() : null

    // Extract keywords from multiple sources
    const keywords: KeywordResult[] = []
    const seenKeywords = new Set<string>()

    // Seed keyword with SERP data
    const seedAds = searchData.ads ?? []
    const seedOrganic = searchData.organic_results ?? []
    const adCount = seedAds.length

    keywords.push({
      keyword,
      searchVolume: estimateVolumeFromResults(searchData),
      cpcEstimate: estimateCpcFromAds(seedAds),
      competitionLevel: adCount >= 4 ? "high" : adCount >= 2 ? "medium" : "low",
      intent: classifyIntent(keyword),
      topCompetitors: extractTopDomains(seedOrganic, seedAds),
      source: "seed",
    })
    seenKeywords.add(keyword.toLowerCase())

    // Related searches from Google
    const relatedSearches: string[] = (searchData.related_searches ?? []).map(
      (r: Record<string, unknown>) => r.query as string
    )

    for (const related of relatedSearches) {
      const lower = related.toLowerCase()
      if (!seenKeywords.has(lower)) {
        seenKeywords.add(lower)
        keywords.push({
          keyword: related,
          searchVolume: null,
          cpcEstimate: null,
          competitionLevel: "medium",
          intent: classifyIntent(related),
          topCompetitors: [],
          source: "related",
        })
      }
    }

    // People Also Ask
    const relatedQuestions: string[] = (searchData.related_questions ?? []).map(
      (r: Record<string, unknown>) => r.question as string
    )
    for (const question of relatedQuestions) {
      const lower = question.toLowerCase()
      if (!seenKeywords.has(lower)) {
        seenKeywords.add(lower)
        keywords.push({
          keyword: question,
          searchVolume: null,
          cpcEstimate: null,
          competitionLevel: "low",
          intent: "informational",
          topCompetitors: [],
          source: "people_also_ask",
        })
      }
    }

    // Autocomplete suggestions
    if (autocompleteData?.suggestions) {
      for (const suggestion of autocompleteData.suggestions) {
        const text = suggestion.value as string
        const lower = text.toLowerCase()
        if (!seenKeywords.has(lower)) {
          seenKeywords.add(lower)
          keywords.push({
            keyword: text,
            searchVolume: null,
            cpcEstimate: null,
            competitionLevel: "medium",
            intent: classifyIntent(text),
            topCompetitors: [],
            source: "autocomplete",
          })
        }
      }
    }

    return NextResponse.json({
      seed: keyword,
      keywords,
      totalFound: keywords.length,
      searchInfo: {
        totalResults: searchData.search_information?.total_results,
        adsDetected: adCount,
      },
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Keyword research failed",
        details: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    )
  }
}

interface KeywordResult {
  keyword: string
  searchVolume: number | null
  cpcEstimate: number | null
  competitionLevel: "low" | "medium" | "high"
  intent: "commercial" | "transactional" | "informational" | "navigational"
  topCompetitors: string[]
  source: "seed" | "related" | "people_also_ask" | "autocomplete"
}

function estimateVolumeFromResults(data: Record<string, unknown>): number | null {
  const info = data.search_information as Record<string, unknown> | undefined
  if (!info?.total_results) return null
  const total = Number(info.total_results)
  // Very rough heuristic: more results generally = higher search volume
  if (total > 1_000_000_000) return 500_000
  if (total > 500_000_000) return 200_000
  if (total > 100_000_000) return 100_000
  if (total > 10_000_000) return 50_000
  if (total > 1_000_000) return 20_000
  return 5_000
}

function estimateCpcFromAds(ads: Record<string, unknown>[]): number | null {
  if (ads.length === 0) return null
  // More ads = higher competition = higher CPC estimate
  if (ads.length >= 4) return 8.5 + Math.random() * 6
  if (ads.length >= 2) return 4.0 + Math.random() * 4
  return 1.5 + Math.random() * 3
}

function classifyIntent(
  keyword: string
): "commercial" | "transactional" | "informational" | "navigational" {
  const lower = keyword.toLowerCase()

  // Transactional
  if (/\b(buy|purchase|order|sign up|subscribe|download|get started|try free|pricing)\b/.test(lower)) {
    return "transactional"
  }

  // Navigational
  if (/\b(login|sign in|website|official|app)\b/.test(lower) || /\.(com|io|app|org)\b/.test(lower)) {
    return "navigational"
  }

  // Informational
  if (/\b(what|how|why|when|where|who|guide|tutorial|review|comparison|vs|versus|best)\b/.test(lower)) {
    return "informational"
  }

  // Default to commercial for product-related searches
  return "commercial"
}

function extractTopDomains(
  organic: Record<string, unknown>[],
  ads: Record<string, unknown>[]
): string[] {
  const domains = new Set<string>()

  for (const ad of ads) {
    const domain = extractDomain(ad.link as string)
    if (domain) domains.add(domain)
  }
  for (const result of organic.slice(0, 5)) {
    const domain = extractDomain(result.link as string)
    if (domain) domains.add(domain)
  }

  return [...domains].slice(0, 6)
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}
