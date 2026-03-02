import Link from "next/link";

export const metadata = {
  title: "PayGate vs Payhip: Which Is Better for Selling Digital Products?",
  description: "Compare PayGate and Payhip side-by-side. See fees, features, and which platform gives you more for less in 2026.",
  keywords: [
    "payhip alternative",
    "payhip alternative 2026",
    "payhip vs paygate",
    "payhip fees",
    "best platform to sell digital products",
    "cheaper than payhip",
    "sell digital products low fees",
  ],
  openGraph: {
    title: "PayGate vs Payhip: Which Platform Is Better in 2026?",
    description: "Compare fees, features, and templates. See which is right for you.",
    url: "https://pay-gate.dev/blog/payhip-alternative",
  },
};

const FEATURES = [
  { feature: "Free plan fee", payhip: "5% per sale", paygate: "5% per sale", tie: true },
  { feature: "Paid plan fee", payhip: "2% at $29/mo", paygate: "2% at $12/mo", highlight: true },
  { feature: "Per-sale flat fee", payhip: "$0", paygate: "$0", tie: true },
  { feature: "Checkout templates", payhip: "1 (basic)", paygate: "8+ customizable", highlight: true },
  { feature: "Custom CSS", payhip: "Limited", paygate: "Yes (Pro)" },
  { feature: "Exit intent popups", payhip: "No", paygate: "Yes (Pro)" },
  { feature: "Order bumps / upsells", payhip: "No", paygate: "Yes (Pro)" },
  { feature: "Countdown timers", payhip: "No", paygate: "Yes" },
  { feature: "QR code sharing", payhip: "No", paygate: "Yes (Pro)" },
  { feature: "Embeddable buy button", payhip: "Yes", paygate: "Yes (Pro)" },
  { feature: "Revenue analytics", payhip: "Basic", paygate: "Yes (Pro)" },
  { feature: "Branding removal", payhip: "Paid plan", paygate: "Pro" },
  { feature: "Payments", payhip: "Stripe + PayPal", paygate: "Direct Stripe" },
  { feature: "Built-in affiliate system", payhip: "Yes", paygate: "No" },
  { feature: "Digital file hosting", payhip: "Yes", paygate: "Yes" },
];

export default function PayhipAlternativePage() {
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

      {/* Breadcrumb */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--muted)" }}>
          <Link href="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground)" }}>PayGate vs Payhip</span>
        </div>
      </div>

      {/* Article */}
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--primary)",
            background: "rgba(22,163,74,0.08)",
            padding: "3px 10px",
            borderRadius: 6,
            border: "1px solid rgba(22,163,74,0.15)",
          }}>
            Comparison
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>March 1, 2026</span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>4 min read</span>
        </div>

        <h1 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.15,
          margin: "0 0 20px",
        }}>
          PayGate vs Payhip: Which Is Better for Selling Digital Products?
        </h1>

        <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 48px" }}>
          Payhip is a popular Gumroad alternative with a similar fee structure. But how does it stack up against PayGate? Here&apos;s an honest comparison.
        </p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          The pricing difference
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          Payhip and PayGate both offer a free plan with a 5% transaction fee. The difference shows up when you upgrade:
        </p>
        <ul style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 2, margin: "0 0 12px", paddingLeft: 20 }}>
          <li><strong style={{ color: "var(--foreground)" }}>Payhip Plus</strong>: $29/month for 2% fees</li>
          <li><strong style={{ color: "var(--foreground)" }}>PayGate Pro</strong>: $12/month for 2% fees</li>
        </ul>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          Same fee rate, but PayGate Pro costs <strong style={{ color: "var(--foreground)" }}>$17 less per month</strong> — that&apos;s $204/year in savings before you even count transaction fees. And PayGate Pro includes conversion tools that Payhip doesn&apos;t offer at any price.
        </p>

        {/* Feature Table */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Feature comparison
        </h2>
        <div style={{
          borderRadius: 16,
          border: "1px solid var(--border)",
          overflow: "hidden",
          background: "var(--surface)",
          marginBottom: 40,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 130px 130px",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            <span>Feature</span>
            <span style={{ textAlign: "center" }}>Payhip</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>PayGate</span>
          </div>
          {FEATURES.map((row, i) => (
            <div
              key={row.feature}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px 130px",
                padding: "12px 16px",
                borderBottom: i < FEATURES.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "0.85rem",
                alignItems: "center",
                background: row.highlight ? "rgba(22,163,74,0.03)" : undefined,
              }}
            >
              <span>{row.feature}</span>
              <span style={{ textAlign: "center", color: row.tie ? "var(--foreground)" : "var(--muted)" }}>{row.payhip}</span>
              <span style={{ textAlign: "center", fontWeight: row.highlight ? 700 : 500, color: row.highlight ? "var(--primary)" : "var(--foreground)" }}>{row.paygate}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Where Payhip wins
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          To be fair, Payhip has a few things PayGate doesn&apos;t:
        </p>
        <ul style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 2, margin: "0 0 12px", paddingLeft: 20 }}>
          <li><strong style={{ color: "var(--foreground)" }}>Built-in affiliate system</strong> — let others promote your products for a commission</li>
          <li><strong style={{ color: "var(--foreground)" }}>PayPal support</strong> — PayGate is Stripe-only</li>
          <li><strong style={{ color: "var(--foreground)" }}>Course hosting</strong> — Payhip can host full courses, not just checkout pages</li>
        </ul>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          If you need an affiliate system or PayPal, Payhip might be better for you. But if you want the best checkout experience at the lowest cost, PayGate is the winner.
        </p>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Where PayGate wins
        </h2>
        <ul style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 2, margin: "0 0 12px", paddingLeft: 20 }}>
          <li><strong style={{ color: "var(--foreground)" }}>$17/month cheaper</strong> for the same 2% fee tier</li>
          <li><strong style={{ color: "var(--foreground)" }}>8 checkout templates</strong> vs Payhip&apos;s single basic checkout</li>
          <li><strong style={{ color: "var(--foreground)" }}>Exit intent popups</strong> to recover abandoning visitors</li>
          <li><strong style={{ color: "var(--foreground)" }}>Order bumps</strong> to increase average order value</li>
          <li><strong style={{ color: "var(--foreground)" }}>Countdown timers</strong> to create urgency</li>
          <li><strong style={{ color: "var(--foreground)" }}>QR code sharing</strong> for in-person or print marketing</li>
          <li><strong style={{ color: "var(--foreground)" }}>Direct Stripe connection</strong> — payments go straight to your account</li>
        </ul>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          PayGate is purpose-built for high-converting checkout pages. If maximizing conversions and minimizing fees is your priority, PayGate is the clear choice.
        </p>

        {/* CTA */}
        <div style={{
          padding: 36,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(6,95,70,0.08))",
          border: "1px solid rgba(22,163,74,0.15)",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Try PayGate free
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
            Same 5% fee as Payhip&apos;s free plan, with more templates and better checkout tools. Upgrade to Pro for just $12/month.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
              Start for Free
            </Link>
            <Link href="/tools/fee-calculator" className="btn-secondary" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
              Compare Fees
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
          &copy; {new Date().getFullYear()} Jacoby Digital LLC. Powered by Stripe.
        </p>
      </footer>
    </div>
  );
}
