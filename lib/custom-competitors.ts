"use client";

import type { Competitor } from "./types";

const STORAGE_KEY = "ad-intel-custom-competitors";

export function getCustomCompetitors(): Competitor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Competitor[];
  } catch {
    return [];
  }
}

export function saveCustomCompetitor(competitor: Competitor): void {
  const existing = getCustomCompetitors();
  const updated = [...existing, competitor];
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
