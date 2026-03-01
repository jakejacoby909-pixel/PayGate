"use client";
import { useState, useEffect, useCallback } from "react";

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    bg: "#ffffff",
    card: "#ffffff",
    accent: "#16a34a",
    text: "#1a1a1a",
    muted: "#666",
    border: "#eee",
    badgeBg: "rgba(22,163,74,0.08)",
    badgeText: "#16a34a",
    isDark: false,
  },
  {
    id: "bold",
    name: "Bold",
    bg: "#052e16",
    card: "#14532d",
    accent: "#16a34a",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.6)",
    border: "rgba(255,255,255,0.1)",
    badgeBg: "rgba(22,163,74,0.2)",
    badgeText: "#4ade80",
    isDark: true,
  },
  {
    id: "neon",
    name: "Neon",
    bg: "#0a0a0a",
    card: "#141414",
    accent: "#00ff88",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    border: "rgba(0,255,136,0.15)",
    badgeBg: "rgba(0,255,136,0.1)",
    badgeText: "#00ff88",
    isDark: true,
  },
  {
    id: "sunset",
    name: "Sunset",
    bg: "#fff7ed",
    card: "#ffffff",
    accent: "#f97316",
    text: "#1a1a1a",
    muted: "#666",
    border: "rgba(249,115,22,0.15)",
    badgeBg: "rgba(249,115,22,0.08)",
    badgeText: "#f97316",
    isDark: false,
  },
  {
    id: "glass",
    name: "Glass",
    bg: "#0a2414",
    card: "rgba(255,255,255,0.06)",
    accent: "#22c55e",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    border: "rgba(255,255,255,0.08)",
    badgeBg: "rgba(34,197,94,0.15)",
    badgeText: "#22c55e",
    isDark: true,
  },
  {
    id: "brutalist",
    name: "Brutalist",
    bg: "#ffffff",
    card: "#ffffff",
    accent: "#000000",
    text: "#000000",
    muted: "#444",
    border: "#000",
    badgeBg: "#000",
    badgeText: "#fff",
    isDark: false,
  },
];

export default function TemplateSwitcher() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % TEMPLATES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const t = TEMPLATES[active];
  const isBrutalist = t.id === "brutalist";
  const borderRadius = isBrutalist ? 4 : 20;
  const btnRadius = isBrutalist ? 4 : 9999;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-float shimmer-sweep border-glow" style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "var(--shadow-xl), 0 0 80px rgba(22,163,74,0.08)",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        position: "relative",
      }}>
        {/* Browser chrome */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27ca40" }} />
          </div>
          <div style={{
            flex: 1,
            padding: "5px 14px",
            borderRadius: 6,
            background: "var(--background)",
            fontSize: "0.75rem",
            color: "var(--muted-light)",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            pay-gate.dev/checkout/your-product
          </div>
        </div>

        {/* Template preview area */}
        <div style={{
          padding: "48px 24px",
          background: t.bg,
          minHeight: 380,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "background 0.6s ease",
        }}>
          {/* Checkout card */}
          <div style={{
            background: t.card,
            borderRadius,
            padding: 32,
            boxShadow: t.isDark
              ? `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${t.accent}10`
              : "0 4px 24px rgba(0,0,0,0.06)",
            width: "100%",
            maxWidth: 360,
            border: isBrutalist ? `3px solid ${t.border}` : `1px solid ${t.border}`,
            position: "relative",
            transition: "all 0.6s ease",
            ...(t.id === "glass" ? { backdropFilter: "blur(20px)" } : {}),
          }}>
            <div style={{
              fontSize: "1.15rem",
              fontWeight: isBrutalist ? 900 : 700,
              color: t.text,
              marginBottom: 4,
              letterSpacing: isBrutalist ? "0.02em" : "-0.01em",
              textTransform: isBrutalist ? "uppercase" : "none",
              transition: "color 0.6s ease",
            }}>
              Premium Course
            </div>
            <div style={{
              fontSize: "0.82rem",
              color: t.muted,
              marginBottom: 16,
              transition: "color 0.6s ease",
            }}>
              Lifetime access to all modules
            </div>
            <div style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: t.accent,
              marginBottom: 20,
              letterSpacing: "-0.03em",
              transition: "color 0.6s ease",
            }}>
              $49.00
            </div>
            <div style={{
              padding: "14px 24px",
              background: isBrutalist ? t.accent : `linear-gradient(135deg, ${t.accent}, ${t.accent}dd)`,
              borderRadius: btnRadius,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: isBrutalist ? "#fff" : (t.isDark ? "#000" : "white"),
              fontWeight: 700,
              fontSize: "0.95rem",
              boxShadow: t.isDark ? `0 4px 16px ${t.accent}30` : `0 4px 16px ${t.accent}30`,
              cursor: "default",
              transition: "all 0.6s ease",
              textTransform: isBrutalist ? "uppercase" : "none",
              letterSpacing: isBrutalist ? "0.05em" : "0",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay $49.00
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 16,
              opacity: 0.4,
              fontSize: "0.68rem",
              color: t.text,
              transition: "color 0.6s ease",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                Secure
              </span>
              <span>Powered by Stripe</span>
            </div>
          </div>

          {/* Floating template label */}
          <div style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "5px 12px",
            borderRadius: 8,
            background: t.badgeBg,
            color: t.badgeText,
            fontSize: "0.72rem",
            fontWeight: 700,
            transition: "all 0.6s ease",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            {t.name} Template
          </div>
        </div>
      </div>

      {/* Template selector dots */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 20,
        flexWrap: "wrap",
      }}>
        {TEMPLATES.map((tmpl, i) => (
          <button
            key={tmpl.id}
            onClick={() => { setActive(i); setPaused(true); }}
            style={{
              padding: "6px 14px",
              borderRadius: 9999,
              border: i === active ? `1.5px solid ${tmpl.accent}` : "1.5px solid rgba(255,255,255,0.08)",
              background: i === active ? `${tmpl.accent}15` : "rgba(255,255,255,0.03)",
              color: i === active ? tmpl.accent : "rgba(255,255,255,0.4)",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
          >
            {tmpl.name}
          </button>
        ))}
      </div>
    </div>
  );
}
