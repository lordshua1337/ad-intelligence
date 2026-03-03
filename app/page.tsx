import Link from "next/link";
import { Eye, Search, Brain, ArrowRight, Shield } from "lucide-react";

export default function Home() {
  const stats = [
    { value: "12", label: "Competitors Tracked" },
    { value: "85+", label: "Ads Analyzed" },
    { value: "30", label: "Keywords Monitored" },
  ];

  const features = [
    {
      icon: Eye,
      title: "Competitor Spy",
      description:
        "Track every ad your competitors run across Google, Meta, and native networks. See their budgets, creatives, and targeting strategy in one place.",
      color: "var(--accent)",
      bg: "var(--accent-soft)",
      border: "rgba(59, 130, 246, 0.2)",
    },
    {
      icon: Search,
      title: "Keyword Intelligence",
      description:
        "Discover which keywords your competitors are bidding on, what they're paying per click, and where the white space opportunities are for your campaigns.",
      color: "var(--accent-violet)",
      bg: "var(--accent-violet-soft)",
      border: "rgba(139, 92, 246, 0.2)",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description:
        "AI-powered pattern detection reveals headline formulas, emotional triggers, and messaging strategies that are working best across your competitive landscape.",
      color: "var(--success)",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.2)",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Nav placeholder */}
      <header
        className="glass sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-soft)", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              <Shield className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
              Ad Intelligence
            </span>
          </div>
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            Open Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6">
          {/* Background gradient blobs */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #3B82F6, transparent 70%)" }}
          />
          <div
            className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #8B5CF6, transparent 70%)" }}
          />

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Pick and Shovel Suite — Product 2
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "var(--text)" }}
            >
              See What Your Competitors
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Are Spending Money On
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              AI-powered ad intelligence that reveals competitor strategies, spending
              patterns, and keyword opportunities across Google and Meta.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                }}
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--surface-hover)]"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                View Demo Data
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 pt-8"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="px-4 sm:px-6 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg, border }) => (
              <div
                key={title}
                className="card p-6 flex flex-col gap-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
