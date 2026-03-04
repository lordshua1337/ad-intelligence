import { NextRequest, NextResponse } from "next/server"

// SerpAPI-powered ad discovery
// Searches Google for a keyword and extracts paid ads + organic competitors

const SERPAPI_BASE = "https://serpapi.com/search.json"

interface SerpAd {
  position: number
  title: string
  link: string
  displayed_link: string
  tracking_link?: string
  description: string
  sitelinks?: { title: string; link: string }[]
}

interface SerpOrganicResult {
  position: number
  title: string
  link: string
  displayed_link: string
  snippet: string
  domain?: string
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")
  const domain = request.nextUrl.searchParams.get("domain")

  if (!query && !domain) {
    return NextResponse.json(
      { error: "q (keyword) or domain parameter required" },
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

  const searchQuery = domain ? `site:${domain}` : query!

  try {
    const params = new URLSearchParams({
      engine: "google",
      q: searchQuery,
      api_key: apiKey,
      num: "20",
      gl: "us",
      hl: "en",
    })

    const response = await fetch(`${SERPAPI_BASE}?${params}`)
    if (!response.ok) {
      throw new Error(`SerpAPI returned ${response.status}`)
    }

    const data = await response.json()

    // Extract paid ads
    const topAds: SerpAd[] = data.ads ?? []
    const shoppingAds = data.shopping_results ?? []

    // Extract organic results as competitors
    const organicResults: SerpOrganicResult[] = (data.organic_results ?? []).map(
      (r: Record<string, unknown>) => ({
        position: r.position,
        title: r.title,
        link: r.link,
        displayed_link: r.displayed_link,
        snippet: r.snippet,
        domain: extractDomain(r.link as string),
      })
    )

    // Extract related searches for keyword expansion
    const relatedSearches: string[] = (data.related_searches ?? []).map(
      (r: Record<string, unknown>) => r.query as string
    )

    // Extract People Also Ask
    const relatedQuestions: string[] = (data.related_questions ?? []).map(
      (r: Record<string, unknown>) => r.question as string
    )

    // Build competitor domains from organic results
    const competitorDomains = [
      ...new Set(organicResults.map((r) => r.domain).filter(Boolean)),
    ]

    return NextResponse.json({
      query: searchQuery,
      ads: topAds.map((ad) => ({
        position: ad.position,
        headline: ad.title,
        description: ad.description,
        landingUrl: ad.link,
        displayUrl: ad.displayed_link,
        domain: extractDomain(ad.link),
        source: "google" as const,
        sitelinks: ad.sitelinks ?? [],
      })),
      shoppingAds: shoppingAds.slice(0, 10),
      organicCompetitors: organicResults.slice(0, 10),
      competitorDomains,
      relatedSearches,
      relatedQuestions,
      searchInfo: {
        totalResults: data.search_information?.total_results,
        timeTaken: data.search_information?.time_taken_displayed,
      },
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Ad search failed",
        details: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    )
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}
