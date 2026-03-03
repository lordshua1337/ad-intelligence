import { notFound } from "next/navigation";
import { getCompetitors, getCompetitorById } from "@/lib/mock-data/index";
import { CompetitorDetailClient } from "./CompetitorDetailClient";

interface PageProps {
  readonly params: Promise<{ competitorId: string }>;
}

export function generateStaticParams() {
  return getCompetitors().map((c) => ({ competitorId: c.id }));
}

export default async function CompetitorDetailPage({ params }: PageProps) {
  const { competitorId } = await params;
  const competitor = getCompetitorById(competitorId);

  if (!competitor) {
    notFound();
  }

  return <CompetitorDetailClient competitor={competitor} />;
}
