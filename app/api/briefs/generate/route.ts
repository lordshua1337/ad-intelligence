import { NextRequest, NextResponse } from "next/server"

// Claude-powered competitive intelligence brief generation
// Takes tracked competitor data and generates an actionable weekly brief

const CLAUDE_API_URL = "https://ctax-api-proxy.vercel.app/api/claude"

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const competitors = body.competitors as CompetitorInput[] | undefined
  if (!competitors?.length) {
    return NextResponse.json(
      { error: "competitors array required (at least 1)" },
      { status: 400 }
    )
  }

  // Build the intelligence prompt
  const competitorSummaries = competitors
    .map(
      (c) =>
        `- ${c.name} (${c.domain}): Tech: ${c.techStack?.join(", ") || "unknown"}. ` +
        `Ad pixels: ${c.adPixels?.join(", ") || "none detected"}. ` +
        `Performance: ${c.performanceScore ?? "N/A"}/100. ` +
        `Site age: ${c.siteAge || "unknown"}. ` +
        `Analytics: ${c.analytics?.join(", ") || "unknown"}.`
    )
    .join("\n")

  const prompt = `You are a competitive intelligence analyst. Generate a weekly competitive intelligence brief based on the following tracked competitors:

${competitorSummaries}

Generate a brief with exactly these sections:
1. SUMMARY: 2-3 paragraph executive summary of the competitive landscape
2. KEY TAKEAWAYS: Exactly 5 actionable insights
3. TOP COMPETITORS: Rank the top 5 competitors by threat level, with estimated monthly ad spend and active ad count
4. TRENDING KEYWORDS: List 8-10 keywords these competitors are likely targeting
5. RECOMMENDATIONS: Exactly 5 strategic recommendations

Format your response as JSON with this structure:
{
  "summary": "string",
  "keyTakeaways": ["string", ...],
  "topCompetitors": [{"name": "string", "spend": number, "adCount": number}, ...],
  "trendingKeywords": ["string", ...],
  "recommendations": ["string", ...]
}

Be specific and actionable. Use real competitive intelligence terminology. Estimate spend based on tech stack and ad platform presence.`

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Claude API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const content =
      data.content?.[0]?.text ?? data.choices?.[0]?.message?.content ?? ""

    // Parse the JSON from Claude's response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse brief JSON from response")
    }

    const brief = JSON.parse(jsonMatch[0]) as BriefOutput

    return NextResponse.json({
      id: `brief-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      summary: brief.summary,
      keyTakeaways: brief.keyTakeaways,
      topCompetitors: brief.topCompetitors,
      trendingKeywords: brief.trendingKeywords,
      recommendations: brief.recommendations,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Brief generation failed",
        details: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    )
  }
}

interface CompetitorInput {
  name: string
  domain: string
  techStack?: string[]
  adPixels?: string[]
  analytics?: string[]
  performanceScore?: number
  siteAge?: string
}

interface BriefOutput {
  summary: string
  keyTakeaways: string[]
  topCompetitors: { name: string; spend: number; adCount: number }[]
  trendingKeywords: string[]
  recommendations: string[]
}
