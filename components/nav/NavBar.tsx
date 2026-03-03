"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BarChart2, Search, Bell, FileText, Menu, X } from "lucide-react";
import { getAlertCount } from "@/lib/mock-data/index";

const navLinks = [
  { href: "/ad-intelligence/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/ad-intelligence/keywords", label: "Keywords", icon: Search },
  { href: "/ad-intelligence/alerts", label: "Alerts", icon: Bell },
  { href: "/ad-intelligence/briefs", label: "Briefs", icon: FileText },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { unread } = getAlertCount();

  function isActive(href: string): boolean {
    if (href === "/ad-intelligence/dashboard") {
      return pathname.startsWith("/ad-intelligence/dashboard");
    }
    return pathname === href;
  }

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/ad-intelligence"
            className="flex items-center gap-2 text-[var(--text)] hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] border border-blue-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Ad Intelligence
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-[var(--accent)] bg-[var(--accent-soft)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {label === "Alerts" && unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? "text-[var(--accent)] bg-[var(--accent-soft)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {label === "Alerts" && unread > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
