"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { PLANS, PRO_FEATURES } from "@/lib/plans";

const CHECK_ICON = "M20 6L9 17l-5-5";
const X_ICON = "M18 6L6 18M6 6l12 12";

const COMPARISON = [
  { label: "Active Pages", free: "3 pages", pro: "Unlimited" },
  { label: "Checkout Templates", free: "5 templates", pro: "All 8+ templates" },
  { label: "Platform Fee", free: "5% per sale", pro: "2% per sale", highlight: true },
  { label: "Quantity Selector", free: true, pro: true },
  { label: "Discount Codes", free: true, pro: true },
  { label: "Countdown Timer", free: true, pro: true },
  { label: "Stock Counter", free: true, pro: true },
  { label: "Guarantee Badge", free: true, pro: true },
  { label: "Exit Intent Popup", free: false, pro: true, hot: true },
  { label: "Order Bumps / Upsells", free: false, pro: true, hot: true },
  { label: "Social Proof Counter", free: false, pro: true },
  { label: "Customer Testimonials", free: false, pro: true },
  { label: "Promo Banner", free: false, pro: true },
  { label: "Password Protection", free: false, pro: true },
  { label: "Remove PayGate Branding", free: false, pro: true },
  { label: "Revenue Analytics", free: false, pro: true },
  { label: "QR Code Sharing", free: false, pro: true },
  { label: "Embed on Websites", free: false, pro: true },
  { label: "Social Media Sharing", free: false, pro: true },
  { label: "Embeddable Buy Button", free: false, pro: true },
  { label: "Email Payment Links", free: false, pro: true },
  { label: "Custom CSS", free: false, pro: true },
  { label: "SEO Meta Tags", free: false, pro: true },
  { label: "Success Page Redirect", free: false, pro: true },
  { label: "Customer Email Export", free: false, pro: true },
];

const FAQ = [
  {
    q: "What happens when I hit 3 pages on the free plan?",
    a: "You can keep your existing pages, but you'll need to upgrade to Pro to create new ones. No pages are deleted.",
  },
  {
    q: "How does the platform fee work?",
    a: "PayGate takes a small percentage of each successful transaction. On the Starter plan it's 5%, on Pro it's only 2%. This is separate from Stripe's standard processing fees.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime and keep Pro features until the end of your billing period. Your pages continue to work on the Starter plan.",
  },
  {
    q: "Do I need a Stripe account?",
    a: "Yes. PayGate uses Stripe to process payments. You'll connect your own Stripe account to receive payments directly.",
  },
  {
    q: "What's the Exit Intent Popup?",
    a: "When a visitor moves their cursor to leave your page, a popup appears offering a discount. This technique is proven to recover 10-30% of abandoning visitors.",
  },
  {
    q: "What's an Order Bump?",
    a: "An optional add-on product shown at checkout (like 'Add priority support for $5'). Studies show order bumps increase average revenue by 15-30%.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const { plan, user } = useAuth();

  const proPrice = annual ? PLANS.pro.priceYearly : PLANS.pro.price;
  const proLabel = annual ? "/year" : "/month";
  const savings = annual ? Math.round((1 - PLANS.pro.priceYearly / (PLANS.pro.price * 12)) * 100) : 0;

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
        <Link href={user ? "/dashboard" : "/login"} className="btn-secondary" style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none" }}>
          {user ? "Dashboard" : "Sign In"}
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
          Simple, transparent pricing
        </div>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          margin: "0 0 16px",
        }}>
          Start free, upgrade{" "}
          <span className="gradient-text-animated">when you grow</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
          Every feature you need to sell online. Only pay for Pro when your business is ready.
        </p>
      </section>

      {/* ROI Calculator — moved to top */}
      <section style={{
        padding: "0 24px 48px",
        maxWidth: 660,
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
            Pro pays for itself
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
            The 3% fee reduction alone saves you money. Plus exit intent popups and order bumps can boost revenue 15-30%.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { revenue: "$500/mo", feeSaved: "$15", label: "Casual seller" },
            { revenue: "$2,000/mo", feeSaved: "$60", label: "Growing business" },
            { revenue: "$10,000/mo", feeSaved: "$300", label: "Power seller" },
          ].map((ex) => (
            <div key={ex.label} style={{
              padding: 18,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                {ex.label}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 4 }}>
                {ex.revenue} in sales
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                Save {ex.feeSaved}/mo
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 3 }}>
                from fee reduction alone
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Billing toggle */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "0 24px 32px",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: 4,
          background: "var(--surface)",
          borderRadius: 12,
          border: "1px solid var(--border)",
        }}>
          <button
            onClick={() => setAnnual(false)}
            style={{
              padding: "8px 20px",
              borderRadius: 9,
              border: "none",
              background: !annual ? "var(--background)" : "transparent",
              color: !annual ? "var(--foreground)" : "var(--muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: !annual ? "var(--shadow-sm)" : "none",
              transition: "all 0.2s",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              padding: "8px 20px",
              borderRadius: 9,
              border: "none",
              background: annual ? "var(--background)" : "transparent",
              color: annual ? "var(--foreground)" : "var(--muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: annual ? "var(--shadow-sm)" : "none",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Annual
            {savings > 0 && (
              <span style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#22c55e",
                background: "rgba(34,197,94,0.1)",
                padding: "2px 8px",
                borderRadius: 6,
              }}>
                Save {savings}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 20,
        maxWidth: 760,
        margin: "0 auto",
        padding: "0 24px 60px",
      }}>
        {/* Free Card */}
        <div style={{
          padding: 32,
          borderRadius: 20,
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Starter
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>$0</span>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>/forever</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "0 0 24px", lineHeight: 1.5 }}>
            Perfect for getting started. Create up to 3 checkout pages.
          </p>
          <Link
            href={plan === "free" && user ? "/dashboard" : "/builder"}
            className="btn-secondary"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px 24px",
              fontSize: "0.9rem",
              textDecoration: "none",
              marginBottom: 24,
            }}
          >
            {plan === "free" && user ? "Current Plan" : "Get Started Free"}
          </Link>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "3 checkout pages",
              "5 templates",
              "5% platform fee",
              "Countdown timer",
              "Discount codes",
              "Stock counter",
              "Link sharing",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={CHECK_ICON} />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Pro Card */}
        <div style={{
          padding: 32,
          borderRadius: 20,
          background: "var(--surface)",
          border: "2px solid var(--primary)",
          position: "relative",
          boxShadow: "0 0 40px rgba(22,163,74,0.08)",
        }}>
          {/* Popular badge */}
          <div style={{
            position: "absolute",
            top: -12,
            right: 20,
            padding: "4px 14px",
            borderRadius: 9999,
            background: "var(--primary)",
            color: "white",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}>
            Most Popular
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Pro
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
              ${proPrice}
            </span>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{proLabel}</span>
          </div>
          {annual && (
            <p style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, margin: "0 0 4px" }}>
              That&apos;s just ${(PLANS.pro.priceYearly / 12).toFixed(2)}/month
            </p>
          )}
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "0 0 24px", lineHeight: 1.5 }}>
            Everything you need to maximize sales. Pays for itself fast.
          </p>
          <Link
            href={plan === "pro" ? "/dashboard" : "/login"}
            className="btn-primary ripple-btn"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px 24px",
              fontSize: "0.9rem",
              textDecoration: "none",
              marginBottom: 24,
            }}
          >
            {plan === "pro" ? "Current Plan" : "Upgrade to Pro"}
          </Link>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: "Unlimited pages", bold: true },
              { text: "All 8+ templates" },
              { text: "2% platform fee (save 3%)", bold: true },
              { text: "Exit Intent Popup", tag: "+10-30% conversions" },
              { text: "Order Bumps / Upsells", tag: "+15-30% revenue" },
              { text: "Social proof & testimonials" },
              { text: "Remove PayGate branding" },
              { text: "Revenue analytics dashboard" },
              { text: "QR, embed, social sharing" },
              { text: "Embeddable buy button" },
              { text: "Email payment links" },
              { text: "Custom CSS & SEO meta" },
              { text: "Customer email export" },
            ].map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: f.bold ? 600 : 400 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={CHECK_ICON} />
                </svg>
                {f.text}
                {f.tag && (
                  <span style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.1)",
                    padding: "1px 7px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}>
                    {f.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={{ padding: "60px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", margin: "0 0 32px" }}>
          Full feature comparison
        </h2>
        <div style={{
          borderRadius: 16,
          border: "1px solid var(--border)",
          overflow: "hidden",
          background: "var(--surface)",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 100px 100px",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            <span>Feature</span>
            <span style={{ textAlign: "center" }}>Starter</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>Pro</span>
          </div>
          {/* Rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 100px",
                padding: "12px 20px",
                borderBottom: i < COMPARISON.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "0.85rem",
                alignItems: "center",
                background: row.highlight ? "rgba(22,163,74,0.03)" : undefined,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {row.label}
                {row.hot && (
                  <span style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.1)",
                    padding: "1px 6px",
                    borderRadius: 4,
                  }}>
                    HOT
                  </span>
                )}
              </span>
              <span style={{ textAlign: "center" }}>
                {typeof row.free === "boolean" ? (
                  row.free ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline" }}>
                      <path d={CHECK_ICON} />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline" }}>
                      <path d={X_ICON} />
                    </svg>
                  )
                ) : (
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{row.free}</span>
                )}
              </span>
              <span style={{ textAlign: "center" }}>
                {typeof row.pro === "boolean" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline" }}>
                    <path d={CHECK_ICON} />
                  </svg>
                ) : (
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--primary)" }}>{row.pro}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: "60px 24px",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", margin: "0 0 32px" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ.map((item, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "none",
                    background: "transparent",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  {item.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: "0 18px 14px",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          Ready to sell more?
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", margin: "0 0 24px" }}>
          Start free. Upgrade when your business grows.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
            Start for Free
          </Link>
          <Link href="/login" className="btn-secondary" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
            Upgrade to Pro
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
          &copy; {new Date().getFullYear()} PayGate. Powered by Stripe.
        </p>
      </footer>
    </div>
  );
}
