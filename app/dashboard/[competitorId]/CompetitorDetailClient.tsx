"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, TrendingUp, DollarSign, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdCard } from "@/components/dashboard/AdCard";
import { ChannelMixChart } from "@/components/dashboard/ChannelMixChart";
import { PatternInsights } from "@/components/dashboard/PatternInsights";
import {
  getAdsForCompetitor,
  getAnalysisForCompetitor,
  getChannelMix,
  formatBudget,
  formatRelativeTime,
} from "@/lib/mock-data/index";
import type { Competitor, Ad } from "@/lib/types";

const TABS = ["Overview", "Ad Library", "Analysis", "Timeline"] as const;
type Tab = (typeof TABS)[number];

interface CompetitorDetailClientProps {
  readonly competitor: Competitor;
}

export function CompetitorDetailClient({ competitor }: CompetitorDetailClientProps) {
  const ads = getAdsForCompetitor(competitor.id);
  const analyses = getAnalysisForCompetitor(competitor.id);
  const channelMix = getChannelMix(competitor.id);

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [sourceFilter, setSourceFilter] = useState<Ad["source"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Ad["status"] | "all">("all");
  const [adSearch, setAdSearch] = useState("");

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      if (sourceFilter !== "all" && ad.source !== sourceFilter) return false;
      if (statusFilter !== "all" && ad.status !== statusFilter) return false;
      if (
        adSearch.trim() &&
        !ad.headline.toLowerCase().includes(adSearch.toLowerCase()) &&
        !ad.description.toLowerCase().includes(adSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [ads, sourceFilter, statusFilter, adSearch]);

  const activeAds = ads.filter((a) => a.status === "active");
  const totalSpend = ads.reduce((s, a) => s + a.estimatedSpendMonthly, 0);

  const sortedByTime = [...ads].sort(
    (a, b) => new Date(a.firstSeenAt).getTime() - new Date(b.firstSeenAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm w-fit transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Competitor header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "var(--accent)",
              }}
            >
              {competitor.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                {competitor.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Globe className="w-3.5 h-3.5" style={{ color: "var(--text-dim)" }} />
                <a
                  href={`https://${competitor.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {competitor.domain}
                </a>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  {competitor.industry}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: "var(--success)" }}>
                {formatBudget(competitor.monthlyBudgetEstimate)}
              </div>
              <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                est. monthly budget
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: "var(--text)" }}>
                {competitor.activeAdCount}
              </div>
              <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                active ads
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{
                  color:
                    competitor.trendScore >= 80
                      ? "var(--success)"
                      : competitor.trendScore >= 60
                      ? "var(--warning)"
                      : "var(--danger)",
                }}
              >
                {competitor.trendScore}
              </div>
              <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                trend score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl w-fit"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? "var(--surface-hover)" : "transparent",
              color: activeTab === tab ? "var(--text)" : "var(--text-secondary)",
              border: activeTab === tab ? "1px solid var(--border-hover)" : "1px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                  Company Overview
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Industry", value: competitor.industry, icon: Layers },
                    { label: "Monthly Budget", value: formatBudget(competitor.monthlyBudgetEstimate), icon: DollarSign },
                    { label: "Active Ads", value: `${activeAds.length} / ${ads.length} total`, icon: TrendingUp },
                    { label: "Channels", value: competitor.channels.join(", "), icon: Globe },
                    { label: "First Tracked", value: new Date(competitor.firstSeenAt).toLocaleDateString(), icon: TrendingUp },
                    { label: "Last Updated", value: formatRelativeTime(competitor.lastUpdatedAt), icon: TrendingUp },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                  Channel Mix
                </h3>
                {channelMix.length > 0 ? (
                  <ChannelMixChart data={channelMix} />
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-dim)" }}>No channel data available.</p>
                )}
              </div>

              <div className="card p-5 lg:col-span-2">
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                  Ad Performance Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Total Ads Tracked", value: ads.length, color: "var(--accent)" },
                    { label: "Active Now", value: activeAds.length, color: "var(--success)" },
                    { label: "Paused", value: ads.filter((a) => a.status === "paused").length, color: "var(--warning)" },
                    { label: "Total Est. Spend", value: formatBudget(totalSpend), color: "var(--success)" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center p-3 rounded-lg" style={{ background: "var(--surface-hover)" }}>
                      <div className="text-2xl font-bold mb-1" style={{ color }}>{value}</div>
                      <div className="text-xs" style={{ color: "var(--text-dim)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Ad Library" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search ads..."
                  value={adSearch}
                  onChange={(e) => setAdSearch(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
                <div className="flex gap-2">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as Ad["source"] | "all")}
                    className="px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <option value="all">All Sources</option>
                    <option value="google">Google</option>
                    <option value="meta">Meta</option>
                    <option value="native">Native</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Ad["status"] | "all")}
                    className="px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Showing {filteredAds.length} of {ads.length} ads
              </p>
              {filteredAds.length === 0 ? (
                <div className="text-center py-12" style={{ color: "var(--text-dim)" }}>
                  No ads match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAds.map((ad, i) => (
                    <motion.div
                      key={ad.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <AdCard ad={ad} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Analysis" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Pattern analysis based on {analyses.length} analyzed ads.
              </p>
              <PatternInsights analyses={analyses} />
            </div>
          )}

          {activeTab === "Timeline" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Ad activity history — showing when each ad was first and last seen.
              </p>
              <div className="flex flex-col gap-3">
                {sortedByTime.map((ad, i) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-4 card p-4"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 mt-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            ad.status === "active"
                              ? "var(--success)"
                              : ad.status === "paused"
                              ? "var(--warning)"
                              : "var(--danger)",
                        }}
                      />
                      {i < sortedByTime.length - 1 && (
                        <div className="w-px flex-1 min-h-[20px]" style={{ background: "var(--border)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              ad.source === "google"
                                ? "rgba(59,130,246,0.1)"
                                : ad.source === "meta"
                                ? "rgba(139,92,246,0.1)"
                                : "rgba(100,116,139,0.1)",
                            color:
                              ad.source === "google"
                                ? "#60A5FA"
                                : ad.source === "meta"
                                ? "#A78BFA"
                                : "#94A3B8",
                          }}
                        >
                          {ad.source}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                          First seen: {new Date(ad.firstSeenAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                          Last seen: {new Date(ad.lastSeenAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {ad.headline}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--success)" }}>
                        {formatBudget(ad.estimatedSpendMonthly)}/mo est.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
