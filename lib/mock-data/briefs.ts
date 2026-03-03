import type { WeeklyBrief } from "../types";

export const BRIEFS: readonly WeeklyBrief[] = [
  {
    id: "brief-001",
    generatedAt: "2026-03-02T06:00:00Z",
    summary: "This week marked a significant escalation in competitive ad spend across the SaaS landscape. HubSpot led the surge with an 82% budget spike, signaling an aggressive Q1 push. Shopify continued dominating e-commerce keywords while expanding into creator and founder-story video formats on Meta. Asana lost its top position for \"project management software\" as ClickUp and Monday.com intensified their Google campaigns. Three new competitors entered monitored keyword spaces, indicating growing market interest across productivity and collaboration categories. The AI positioning war intensified, with HubSpot, Slack, Intercom, and Notion all launching AI-themed campaigns in the same 7-day window.",
    keyTakeaways: [
      "HubSpot's 82% budget spike is the largest single-week increase observed in the past 6 months — expect new landing pages and creative tests to follow within 2 weeks.",
      "AI-themed headlines now appear in 34% of all active ads across tracked competitors, up from 18% in January — this framing is becoming table stakes, not a differentiator.",
      "Shopify's $1/month offer is aggressively dominating the top-of-funnel for \"start online store\" queries and driving CTR well above category average based on observed ad frequency.",
      "Competitor conquest campaigns (bidding on rivals' brand terms) increased 40% week-over-week — Asana targeting Monday.com and Intercom targeting Zendesk are the most aggressive examples.",
      "Native ad spend across tracked competitors grew 28% — content-first formats like reports, guides, and case studies are being used to reach audiences not responding to direct-response ads.",
    ],
    topCompetitors: [
      { name: "HubSpot", spend: 720000, adCount: 243 },
      { name: "Shopify", spend: 1250000, adCount: 318 },
      { name: "Zoom", spend: 620000, adCount: 201 },
      { name: "Slack", spend: 540000, adCount: 162 },
      { name: "Asana", spend: 485000, adCount: 187 },
    ],
    trendingKeywords: [
      "ai crm software",
      "monday.com alternative",
      "project management software",
      "customer support ai",
      "team collaboration tools",
      "buy payment software",
    ],
    recommendations: [
      "Counter HubSpot's budget surge by launching comparison landing pages targeting \"HubSpot alternative\" — CPC is currently low with minimal competition from smaller players.",
      "Develop AI-forward ad copy for your existing campaigns. AI-themed headlines are generating significantly higher CTR across the category; not adopting this framing puts you at a disadvantage.",
      "Monitor Asana's conquest campaign against Monday.com. If effective, consider similar strategies targeting the brand keywords of your top 2-3 direct competitors.",
      "Launch a native content campaign with a research report or benchmark study. High-performing content assets from Zoom, HubSpot, and Intercom are driving strong brand awareness at lower CPCs than search.",
      "Increase Meta video ad investment. Shopify and HubSpot are both scaling video on Meta aggressively — static image ads may be losing impression share to video formats.",
    ],
  },
  {
    id: "brief-002",
    generatedAt: "2026-02-23T06:00:00Z",
    summary: "Last week saw measured but notable shifts in competitive positioning. Figma tripled its native ad budget ahead of Config 2026, signaling a major brand awareness push targeting design and engineering audiences. Intercom launched a direct comparison campaign against Zendesk that is gaining visibility rapidly. Zoom consolidated its position in the video conferencing keyword category while expanding into phone and contact center product lines. The week's most significant pattern was the proliferation of \"free trial\" and \"no credit card required\" messaging across 67% of new active ads — a response to longer B2B sales cycles in the current environment.",
    keyTakeaways: [
      "Figma's Config 2026 campaign is generating unusually high brand search volume — organic search for \"figma\" increased 18% week-over-week alongside their paid push.",
      "Intercom's Zendesk comparison page is among the highest-traffic competitor comparison pages observed this month based on estimated traffic and ad frequency data.",
      "\"No credit card required\" and \"free forever\" messaging now appears in 67% of active SaaS ads monitored — friction reduction is the dominant conversion lever being tested.",
      "Zoom's expansion into phone and contact center is backed by substantial paid search investment, suggesting these product lines are strategic priorities for Q1 and Q2.",
      "Drift's ad activity dropped 32% from the prior week — possible campaign pause, creative refresh, or budget reallocation. Worth watching for re-launch signal.",
    ],
    topCompetitors: [
      { name: "Shopify", spend: 980000, adCount: 289 },
      { name: "HubSpot", spend: 395000, adCount: 198 },
      { name: "Zoom", spend: 520000, adCount: 187 },
      { name: "Slack", spend: 390000, adCount: 149 },
      { name: "Stripe", spend: 310000, adCount: 108 },
    ],
    trendingKeywords: [
      "video conferencing software",
      "customer support software",
      "figma config 2026",
      "intercom vs zendesk",
      "online store builder",
      "recurring billing software",
    ],
    recommendations: [
      "Leverage Figma's Config 2026 hype window by targeting design-adjacent keywords this week while their brand activity is driving broader category awareness.",
      "Build a structured comparison page strategy. Intercom vs. Zendesk is performing well — companies publishing direct comparison content are capturing high-intent buyers at the evaluation stage.",
      "Test \"no credit card required\" messaging in ad headlines if not already running. This framing is outperforming alternatives across multiple tracked competitors this week.",
      "Investigate Drift's reduced activity. If they are pausing campaigns, there may be an opportunity to capture their audience with targeted spend before they re-enter.",
      "Review your own landing page messaging against Zoom's contact center push — if your product competes in that space, counter-positioning now will be less expensive than after Zoom builds awareness.",
    ],
  },
];
