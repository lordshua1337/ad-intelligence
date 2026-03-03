import { NextRequest, NextResponse } from "next/server";
import { enrichCompetitor } from "@/lib/enrichment-engine";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");

  if (!domain || domain.length === 0 || domain.length > 200) {
    return NextResponse.json(
      { error: "domain parameter required (1-200 chars)" },
      { status: 400 }
    );
  }

  // Clean the domain
  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "")
    .toLowerCase()
    .trim();

  if (!cleanDomain.includes(".")) {
    return NextResponse.json(
      { error: "Invalid domain format" },
      { status: 400 }
    );
  }

  try {
    const data = await enrichCompetitor(cleanDomain);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Enrichment failed", details: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
