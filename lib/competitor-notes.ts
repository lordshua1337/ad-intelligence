"use client";

// Persistent competitive research notes per competitor

export interface CompetitorNote {
  readonly id: string;
  readonly competitorId: string;
  readonly text: string;
  readonly createdAt: string;
}

const STORAGE_KEY = "ad-intel-notes";

function loadNotes(): CompetitorNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompetitorNote[];
  } catch {
    return [];
  }
}

function saveNotes(notes: CompetitorNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getNotesForCompetitor(competitorId: string): CompetitorNote[] {
  return loadNotes().filter((n) => n.competitorId === competitorId);
}

export function addNote(competitorId: string, text: string): CompetitorNote {
  const notes = loadNotes();
  const note: CompetitorNote = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    competitorId,
    text,
    createdAt: new Date().toISOString(),
  };
  saveNotes([...notes, note]);
  return note;
}

export function removeNote(noteId: string): void {
  const notes = loadNotes();
  saveNotes(notes.filter((n) => n.id !== noteId));
}
