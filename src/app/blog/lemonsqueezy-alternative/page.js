import Link from "next/link";

export const metadata = {
  title: "PayGate vs Lemon Squeezy: Which Is Better for Digital Creators?",
  description: "Lemon Squeezy was acquired by Stripe. Compare fees, features, and approaches — MoR vs direct Stripe payments. See which platform saves you more.",
  keywords: [
    "lemon squeezy alternative",
    "lemon squeezy alternative 2026",
    "lemon squeezy vs paygate",
    "lemon squeezy fees",
    "lemon squeezy stripe acquisition",
    "merchant of record alternative",
    "sell digital products lower fees",
    "stripe checkout page builder",
    "lemonsqueezy alternative",
    "best lemon squeezy alternative",
  ],
  openGraph: {
    title: "PayGate vs Lemon Squeezy: Which Is Better for Digital Creators?",
    description: "Compare fees, features, and the MoR vs direct Stripe approach. Find out which saves you more.",
    url: "https://pay-gate.dev/blog/lemonsqueezy-alternative",
  },
};

const FEE_EXAMPLES = [
  { revenue: "$1,000", ls: "$80", paygateFree: "$50", paygatePro: "$32", saved: "$48" },
  { revenue: "$5,000", ls: "$400", paygateFree: "$250", paygatePro: "$112", saved: "$288" },
  { revenue: "$10,000", ls: "$800", paygateFree: "$500", paygatePro: "$212", saved: "$588" },
  { revenue: "$50,000", ls: "$4,000", paygateFree: "$2,500", paygatePro: "$1,012", saved: "$2,988" },
];

const FEATURES = [
  { feature: "Monthly cost", ls: "Free", paygate: "Free / $12 Pro" },
  { feature: "Transaction fee", ls: "5% + $0.50", paygate: "5% free / 2% Pro", highlight: true },
  { feature: "Per-sale fee", ls: "$0.50", paygate: "$0", highlight: true },
  { feature: "Merchant of Record", ls: "Yes (LS handles tax)", paygate: "No (direct Stripe)" },
  { feature: "Checkout templates", ls: "1 (fixed)", paygate: "8+ customizable" },
  { feature: "Custom CSS", ls: "No", paygate: "Yes (Pro)" },
  { feature: "Exit intent popups", ls: "No", paygate: "Yes (Pro)" },
  { feature: "Order bumps / upsells", ls: "Basic", paygate: "Yes (Pro)" },
  { feature: "Countdown timers", ls: "No", paygate: "Yes" },
  { feature: "Embeddable buy button", ls: "Yes", paygate: "Yes (Pro)" },
  { feature: "QR code sharing", ls: "No", paygate: "Yes (Pro)" },
  { feature: "Revenue analytics", ls: "Yes", paygate: "Yes (Pro)" },
  { feature: "Payments to your Stripe", ls: "No (LS holds funds)", paygate: "Yes, direct", highlight: true },
  { feature: "Setup time", ls: "5-10 min", paygate: "Under 60 seconds" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "PayGate vs Lemon Squeezy: Which Is Better for Digital Creators?",
  description: "Lemon Squeezy was acquired by Stripe. Compare fees, features, and approaches — MoR vs direct Stripe payments.",
  datePublished: "2026-03-03",
  dateModified: "2026-03-03",
  author: { "@type": "Organization", name: "PayGate", url: "https://pay-gate.dev" },
  publisher: { "@type": "Organization", name: "Jacoby Digital LLC" },
  mainEntityOfPage: "https://pay-gate.dev/blog/lemonsqueezy-alternative",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What happened to Lemon Squeezy?", acceptedAnswer: { "@type": "Answer", text: "Lemon Squeezy was acquired by Stripe in 2024. It still operates, but many creators are exploring alternatives since the platform's future roadmap is uncertain under Stripe's ownership." }},
    { "@type": "Question", name: "What is a Merchant of Record?", acceptedAnswer: { "@type": "Answer", text: "A Merchant of Record (MoR) like Lemon Squeezy handles sales tax collection and remittance on your behalf. The tradeoff is higher fees and the platform holds your money before paying you out. PayGate uses direct Stripe payments instead — you get paid instantly." }},
    { "@type": "Question", name: "Is PayGate cheaper than Lemon Squeezy?", acceptedAnswer: { "@type": "Answer", text: "Yes. Lemon Squeezy charges 5% + $0.50 per sale. PayGate's free plan charges 5% with no per-sale fee, and Pro is $12/month with just 2%. On $10,000/month in sales, you'd save $588/month vs Lemon Squeezy." }},
    { "@type": "Question", name: "Do I need to handle sales tax without a Merchant of Record?", acceptedAnswer: { "@type": "Answer", text: "If you're selling digital products to US customers, there's generally no sales tax in most states. For international sales, Stripe Tax (available on your Stripe dashboard) can automate tax collection. Many small creators don't need a full MoR." }},
  ],
};

export default function LemonSqueezyAlternativePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
          <span style={{ color: "var(--foreground)" }}>PayGate vs Lemon Squeezy</span>
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
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>March 3, 2026</span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>5 min read</span>
        </div>

        <h1 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.15,
          margin: "0 0 20px",
        }}>
          PayGate vs Lemon Squeezy: Which Is Better for Digital Creators?
        </h1>

        <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 48px" }}>
          Lemon Squeezy became popular as a Merchant of Record for digital products. Then Stripe acquired it in 2024. With an uncertain roadmap and fees of 5% + $0.50 per sale, many creators are exploring alternatives. Here&apos;s how PayGate compares.
        </p>

        {/* The Stripe Acquisition */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          The Stripe acquisition: what it means for you
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          When Stripe acquired Lemon Squeezy, it raised questions about the platform&apos;s future. Stripe already has its own checkout and billing products. Will Lemon Squeezy remain a standalone product, get merged into Stripe, or slowly wind down?
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          Nobody knows for sure. But here&apos;s what we do know: <strong style={{ color: "var(--foreground)" }}>PayGate is built on top of Stripe</strong>, so you get direct access to Stripe&apos;s infrastructure without the middleman. Your payments go straight to your Stripe account. No waiting for payouts.
        </p>

        {/* MoR vs Direct */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Merchant of Record vs. direct Stripe payments
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          The biggest architectural difference is how payments work:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 8 }}>Lemon Squeezy (Merchant of Record)</div>
            <div style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>
              Lemon Squeezy acts as the legal seller. They collect payment, handle sales tax, then pay you out on a schedule. You don&apos;t control the money until they release it. Fees: <strong style={{ color: "#ef4444" }}>5% + $0.50 per sale</strong>.
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 14, background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.15)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 8, color: "var(--primary)" }}>PayGate (Direct Stripe)</div>
            <div style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>
              Payments go directly to your Stripe account. You&apos;re the seller. Stripe deposits to your bank on its standard schedule (usually 2 days). You have full control. Fees: <strong style={{ color: "var(--primary)" }}>5% free / 2% Pro</strong> — no per-sale fee.
            </div>
          </div>
        </div>

        {/* Fee Table */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Fee comparison: how much you keep
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
          Platform fees at different revenue levels (excluding Stripe&apos;s standard 2.9% + $0.30, which applies on all platforms):
        </p>

        <div style={{
          borderRadius: 16,
          border: "1px solid var(--border)",
          overflow: "hidden",
          background: "var(--surface)",
          marginBottom: 40,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            <span>Revenue</span>
            <span style={{ textAlign: "center" }}>Lemon Squeezy</span>
            <span style={{ textAlign: "center" }}>PayGate Free</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>PayGate Pro</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>You Save</span>
          </div>
          {FEE_EXAMPLES.map((row, i) => (
            <div
              key={row.revenue}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                padding: "14px 16px",
                borderBottom: i < FEE_EXAMPLES.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "0.88rem",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600 }}>{row.revenue}</span>
              <span style={{ textAlign: "center", color: "#ef4444" }}>{row.ls}</span>
              <span style={{ textAlign: "center", color: "var(--muted)" }}>{row.paygateFree}</span>
              <span style={{ textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{row.paygatePro}</span>
              <span style={{ textAlign: "center", fontWeight: 700, color: "var(--primary)" }}>{row.saved}/mo</span>
            </div>
          ))}
        </div>

        {/* Feature Table */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Feature-by-feature comparison
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
            gridTemplateColumns: "1fr 140px 140px",
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
            <span style={{ textAlign: "center" }}>Lemon Squeezy</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>PayGate</span>
          </div>
          {FEATURES.map((row, i) => (
            <div
              key={row.feature}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 140px",
                padding: "12px 16px",
                borderBottom: i < FEATURES.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "0.85rem",
                alignItems: "center",
                background: row.highlight ? "rgba(22,163,74,0.03)" : undefined,
              }}
            >
              <span>{row.feature}</span>
              <span style={{ textAlign: "center", color: "var(--muted)" }}>{row.ls}</span>
              <span style={{ textAlign: "center", fontWeight: row.highlight ? 700 : 500, color: row.highlight ? "var(--primary)" : "var(--foreground)" }}>{row.paygate}</span>
            </div>
          ))}
        </div>

        {/* When to use each */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          When to use each platform
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          <strong style={{ color: "var(--foreground)" }}>Choose Lemon Squeezy if:</strong> you sell internationally at high volume and absolutely need a Merchant of Record to handle VAT/GST collection and remittance in dozens of countries.
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          <strong style={{ color: "var(--foreground)" }}>Choose PayGate if:</strong> you want lower fees, instant access to your money, customizable checkout pages, and don&apos;t need a full MoR. Most US-based digital product sellers fall into this category.
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          For creators selling templates, ebooks, courses, and digital downloads — PayGate offers a simpler, cheaper path with more checkout customization options.
        </p>

        {/* FAQ */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
          Common questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {[
            { q: "What happened to Lemon Squeezy?", a: "Stripe acquired Lemon Squeezy in 2024. The platform still operates, but its long-term roadmap is uncertain. Many creators are proactively exploring alternatives." },
            { q: "What is a Merchant of Record?", a: "A Merchant of Record (MoR) like Lemon Squeezy handles sales tax collection and remittance on your behalf. The tradeoff is higher fees and delayed payouts. PayGate uses direct Stripe payments instead — you get paid faster." },
            { q: "Do I need to handle sales tax without a MoR?", a: "If you're selling digital products to US customers, there's generally no sales tax in most states. For international sales, Stripe Tax can automate tax collection right from your Stripe dashboard. Many small creators don't need a full MoR." },
            { q: "Can I migrate from Lemon Squeezy to PayGate?", a: "Yes. Create your PayGate account, build your checkout page (under 60 seconds), and swap your payment links. Your customers won't notice the difference — except maybe a better checkout experience." },
          ].map((item) => (
            <div key={item.q} style={{
              padding: 20,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 8 }}>{item.q}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          padding: 36,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(6,95,70,0.08))",
          border: "1px solid rgba(22,163,74,0.15)",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Ready to keep more of your revenue?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
            Start for free. No credit card required. Build your first checkout page in under 60 seconds.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
              Start for Free
            </Link>
            <Link href="/pricing" className="btn-secondary" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
              View Pricing
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
