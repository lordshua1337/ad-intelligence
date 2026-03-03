"use client";

import { formatBudget } from "@/lib/mock-data/index";
import type { ChannelMix } from "@/lib/types";

interface ChannelMixChartProps {
  readonly data: readonly ChannelMix[];
}

export function ChannelMixChart({ data }: ChannelMixChartProps) {
  const totalSpend = data.reduce((sum, d) => sum + d.estimatedSpend, 0);
  const totalAds = data.reduce((sum, d) => sum + d.adCount, 0);

  // Build SVG donut segments
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = data.map((d) => {
    const startPercent = cumulativePercent;
    cumulativePercent += d.percentage;
    const dashArray = (d.percentage / 100) * circumference;
    const dashOffset = circumference - (startPercent / 100) * circumference;
    return { ...d, dashArray, dashOffset };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.channel}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dashArray} ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[var(--text)]">{totalAds}</span>
            <span className="text-xs text-[var(--text-dim)]">total ads</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {data.map((d) => (
            <div key={d.channel} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm text-[var(--text-secondary)] truncate">
                  {d.channel}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-semibold text-[var(--text)]">
                  {d.percentage}%
                </div>
                <div className="text-xs text-[var(--text-dim)]">
                  {formatBudget(d.estimatedSpend)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked bar */}
      <div className="w-full h-2 rounded-full overflow-hidden flex">
        {data.map((d) => (
          <div
            key={d.channel}
            style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
          />
        ))}
      </div>

      <div className="text-xs text-[var(--text-dim)] text-right">
        Total estimated spend: <span className="text-[var(--text-secondary)] font-medium">{formatBudget(totalSpend)}/mo</span>
      </div>
    </div>
  );
}
