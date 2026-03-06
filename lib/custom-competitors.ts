import type { Competitor } from "./types";
import type { EnrichmentData } from "./enrichment-types";
import { getSeedCompetitors } from "./seed-data";

const STORAGE_KEY = "ad-intel-custom-competitors";
const SEEDED_KEY = "ad-intel-seeded";

export function getCustomCompetitors(): Competitor[] {
  if (typeof window === "undefined") return [];
  try {
    // Seed demo data on first visit
    if (!localStorage.getItem(SEEDED_KEY)) {
      const seeds = getSeedCompetitors();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      localStorage.setItem(SEEDED_KEY, "true");
      return seeds;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Competitor[];
  } catch {
    return [];
  }
}

export function saveCustomCompetitor(competitor: Competitor): void {
  const existing = getCustomCompetitors();
  // Prevent duplicates by domain
  const filtered = existing.filter((c) => c.domain !== competitor.domain);
  const updated = [...filtered, competitor];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateCompetitorEnrichment(id: string, enrichment: EnrichmentData): void {
  const existing = getCustomCompetitors();
  const updated = existing.map((c) =>
    c.id === id
      ? {
          ...c,
          enrichment,
          enrichmentStatus: "complete" as const,
          name: enrichment.companyInfo.title
            ? enrichment.companyInfo.title.split(/[|\-–—]/)[0].trim().substring(0, 50)
            : c.name,
          lastUpdatedAt: new Date().toISOString(),
        }
      : c
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateCompetitorStatus(id: string, status: Competitor["enrichmentStatus"]): void {
  const existing = getCustomCompetitors();
  const updated = existing.map((c) =>
    c.id === id ? { ...c, enrichmentStatus: status } : c
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeCustomCompetitor(id: string): void {
  const existing = getCustomCompetitors();
  const updated = existing.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function generateCompetitorId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
