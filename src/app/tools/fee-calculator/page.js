"use client";
import { useState } from "react";
import Link from "next/link";

const PLATFORMS = [
  { name: "Gumroad", rate: 0.10, flat: 0.50, monthly: 0, color: "#f472b6" },
  { name: "Payhip", rate: 0.05, flat: 0, monthly: 0, color: "#818cf8" },
  { name: "Payhip Plus", rate: 0.02, flat: 0, monthly: 29, color: "#6366f1" },
  { name: "PayGate Free", rate: 0.05, flat: 0, monthly: 0, color: "#22c55e" },
  { name: "PayGate Pro", rate: 0.02, flat: 0, monthly: 12, color: "#16a34a" },
];

export default function FeeCalculatorPage() {
  const [revenue, setRevenue] = useState(2000);
  const [avgPrice, setAvgPrice] = useState(20);

  const sales = Math.round(revenue / avgPrice) || 0;

  const results = PLATFORMS.map((p) => {
    const fees = revenue * p.rate + sales * p.flat + p.monthly;
    const kept = revenue - fees;
    return { ...p, fees, kept };
  });

  const gumroadFees = results[0].fees;
  const paygatePro = results[4];
  const saved = gumroadFees - paygatePro.fees;

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Nav */}
      <nav style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--foreground)" }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
              <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>PayGate</span>
        </Link>
        <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          Get Started Free
        </Link>
      </nav>

      {/* Header */}
      <section style={{ textAlign: "center", padding: "60px 24px 40px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 14px",
          borderRadius: 9999,
          background: "rgba(22,163,74,0.08)",
          color: "var(--primary)",
          fontSize: "0.78rem",
          fontWeight: 600,
          marginBottom: 20,
          border: "1px solid rgba(22,163,74,0.15)",
        }}>
          Free Tool
        </div>
        <h1 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.15,
          margin: "0 0 16px",
        }}>
          Platform Fee Calculator
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
          See exactly how much you&apos;re paying in fees on Gumroad, Payhip, and PayGate. Enter your numbers below.
        </p>
      </section>

      {/* Calculator */}
      <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{
          padding: 28,
          borderRadius: 16,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          marginBottom: 32,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Monthly Revenue ($)
              </label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Average Product Price ($)
              </label>
              <input
                type="number"
                value={avgPrice}
                onChange={(e) => setAvgPrice(Number(e.target.value) || 1)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--muted)", textAlign: "center" }}>
            ~{sales} sales/month at ${avgPrice} each
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r) => {
            const pct = revenue > 0 ? (r.fees / revenue * 100).toFixed(1) : 0;
            const barWidth = revenue > 0 ? Math.min((r.fees / gumroadFees) * 100, 100) : 0;
            const isPaygatePro = r.name === "PayGate Pro";
            return (
              <div
                key={r.name}
                style={{
                  padding: "16px 20px",
                  borderRadius: 14,
                  background: "var(--surface)",
                  border: isPaygatePro ? "2px solid var(--primary)" : "1px solid var(--border)",
                  position: "relative",
                }}
              >
                {isPaygatePro && (
                  <div style={{
                    position: "absolute",
                    top: -10,
                    right: 16,
                    padding: "2px 10px",
                    borderRadius: 9999,
                    background: "var(--primary)",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                  }}>
                    BEST VALUE
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{r.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: r.name.includes("PayGate") ? "var(--primary)" : "#ef4444" }}>
                      ${r.fees.toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginLeft: 6 }}>
                      ({pct}%)
                    </span>
                  </div>
                </div>
                <div style={{
                  height: 6,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${barWidth}%`,
                    borderRadius: 3,
                    background: r.color,
                    transition: "width 0.3s ease",
                  }} />
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                  You keep: <strong style={{ color: "var(--foreground)" }}>${r.kept.toFixed(2)}</strong>
                  {r.monthly > 0 && <span> (includes ${r.monthly}/mo subscription)</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings callout */}
        {saved > 0 && (
          <div style={{
            marginTop: 28,
            padding: 24,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(6,95,70,0.08))",
            border: "1px solid rgba(22,163,74,0.15)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Switch to PayGate Pro and save
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.03em" }}>
              ${saved.toFixed(2)}/month
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: 20 }}>
              That&apos;s <strong style={{ color: "var(--foreground)" }}>${(saved * 12).toFixed(2)}/year</strong> back in your pocket
            </div>
            <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
              Start for Free
            </Link>
          </div>
        )}

        <p style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          All platforms also charge Stripe&apos;s standard processing fee (2.9% + $0.30 per transaction). This calculator compares platform fees only.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
          &copy; {new Date().getFullYear()} Jacoby Digital LLC. Powered by Stripe.
        </p>
      </footer>
    </div>
  );
}
