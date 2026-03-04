import { NextRequest, NextResponse } from "next/server"

// Generate competitive intelligence alerts from tracked competitor data
// Analyzes enrichment data and produces actionable alerts

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
      { error: "competitors array required" },
      { status: 400 }
    )
  }

  const alerts: GeneratedAlert[] = []
  const now = new Date().toISOString()

  for (const comp of competitors) {
    // Alert: Ad pixels detected (they're spending money)
    if (comp.adPixels && comp.adPixels.length > 0) {
      const platforms = comp.adPixels.join(", ")
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "budget_spike",
        title: `${comp.name} Running Ads on ${comp.adPixels.length} Platform${comp.adPixels.length > 1 ? "s" : ""}`,
        description: `${comp.domain} has active ad pixels for: ${platforms}. This indicates active paid advertising campaigns across these channels.`,
        severity: comp.adPixels.length >= 3 ? "critical" : comp.adPixels.length >= 2 ? "warning" : "info",
        isRead: false,
        competitorDomain: comp.domain,
        createdAt: now,
        metadata: { platforms: comp.adPixels, domain: comp.domain },
      })
    }

    // Alert: Strong performance score (they're investing in their site)
    if (comp.performanceScore !== undefined && comp.performanceScore >= 90) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "position_change",
        title: `${comp.name} Has Excellent Site Performance (${comp.performanceScore}/100)`,
        description: `${comp.domain} scores ${comp.performanceScore}/100 on Google PageSpeed. High performance sites typically rank better in organic search and convert more ad traffic.`,
        severity: "info",
        isRead: false,
        competitorDomain: comp.domain,
        createdAt: now,
        metadata: { performanceScore: comp.performanceScore },
      })
    }

    // Alert: Poor performance (opportunity to beat them)
    if (comp.performanceScore !== undefined && comp.performanceScore < 50) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "position_change",
        title: `${comp.name} Has Poor Site Performance (${comp.performanceScore}/100)`,
        description: `${comp.domain} scores only ${comp.performanceScore}/100 on PageSpeed. This is an opportunity -- a faster site will outperform them in both organic rankings and ad quality score.`,
        severity: "warning",
        isRead: false,
        competitorDomain: comp.domain,
        createdAt: now,
        metadata: { performanceScore: comp.performanceScore },
      })
    }

    // Alert: Rich tech stack (serious competitor)
    if (comp.techStack && comp.techStack.length >= 5) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "new_competitor",
        title: `${comp.name} Has a Mature Tech Stack (${comp.techStack.length} technologies)`,
        description: `${comp.domain} is using ${comp.techStack.slice(0, 5).join(", ")}${comp.techStack.length > 5 ? ` and ${comp.techStack.length - 5} more` : ""}. This indicates a well-funded, technically sophisticated competitor.`,
        severity: comp.techStack.length >= 8 ? "warning" : "info",
        isRead: false,
        competitorDomain: comp.domain,
        createdAt: now,
        metadata: { techCount: comp.techStack.length, stack: comp.techStack },
      })
    }

    // Alert: Multiple analytics tools (data-driven competitor)
    if (comp.analytics && comp.analytics.length >= 3) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "new_keyword",
        title: `${comp.name} Using ${comp.analytics.length} Analytics Tools`,
        description: `${comp.domain} is tracking with ${comp.analytics.join(", ")}. Heavy analytics usage signals aggressive optimization and A/B testing.`,
        severity: "info",
        isRead: false,
        competitorDomain: comp.domain,
        createdAt: now,
        metadata: { analytics: comp.analytics },
      })
    }

    // Alert: Established site (long-running competitor)
    if (comp.siteAge && parseInt(comp.siteAge) < 2010) {
      const yearsActive = new Date().getFullYear() - parseInt(comp.siteAge)
      alerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "new_competitor",
        title: `${comp.name} Has ${yearsActive}+ Years of Domain Authority`,
        description: `${comp.domain} has been online since ${comp.siteAge}. Established domains have strong organic authority that's difficult to compete against in SEO.`,
        severity: yearsActive >= 15 ? "warning" : "info",
        isRead: false,
        competitorDomain: comp.domain,
        createdAt: now,
        metadata: { firstSeen: comp.siteAge, yearsActive },
      })
    }
  }

  // Sort by severity (critical first, then warning, then info)
  const severityOrder = { critical: 0, warning: 1, info: 2 }
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return NextResponse.json({
    alerts,
    totalGenerated: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  })
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

interface GeneratedAlert {
  id: string
  type: "new_competitor" | "position_change" | "budget_spike" | "new_keyword"
  title: string
  description: string
  severity: "info" | "warning" | "critical"
  isRead: boolean
  competitorDomain: string
  createdAt: string
  metadata: Record<string, unknown>
}
