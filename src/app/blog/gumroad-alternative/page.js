import Link from "next/link";

export const metadata = {
  title: "PayGate vs Gumroad: Why Creators Are Switching in 2026",
  description: "Compare PayGate and Gumroad side-by-side. See the fee breakdown, feature comparison, and find out how much you could save by switching from Gumroad.",
  keywords: [
    "gumroad alternative",
    "gumroad alternative 2026",
    "cheaper than gumroad",
    "gumroad fees",
    "gumroad 10 percent fee",
    "sell digital products lower fees",
    "paygate vs gumroad",
    "best gumroad alternative",
    "stripe checkout page builder",
    "sell digital products online",
  ],
  openGraph: {
    title: "PayGate vs Gumroad: Why Creators Are Switching in 2026",
    description: "Compare fees, features, and flexibility. See how much you could save.",
    url: "https://pay-gate.dev/blog/gumroad-alternative",
  },
};

const FEE_EXAMPLES = [
  { revenue: "$1,000", gumroad: "$100 + fees", paygateFree: "$50", paygatePro: "$32", saved: "$68" },
  { revenue: "$5,000", gumroad: "$500 + fees", paygateFree: "$250", paygatePro: "$112", saved: "$388" },
  { revenue: "$10,000", gumroad: "$1,000 + fees", paygateFree: "$500", paygatePro: "$212", saved: "$788" },
  { revenue: "$50,000", gumroad: "$5,000 + fees", paygateFree: "$2,500", paygatePro: "$1,012", saved: "$3,988" },
];

const FEATURES = [
  { feature: "Monthly cost", gumroad: "Free", paygate: "Free / $12 Pro" },
  { feature: "Transaction fee", gumroad: "10%", paygate: "5% free / 2% Pro", highlight: true },
  { feature: "Per-sale fee", gumroad: "$0.50", paygate: "$0", highlight: true },
  { feature: "Checkout templates", gumroad: "1 (fixed)", paygate: "8+ customizable" },
  { feature: "Custom CSS", gumroad: "No", paygate: "Yes (Pro)" },
  { feature: "Exit intent popups", gumroad: "No", paygate: "Yes (Pro)" },
  { feature: "Order bumps / upsells", gumroad: "No", paygate: "Yes (Pro)" },
  { feature: "Countdown timers", gumroad: "No", paygate: "Yes" },
  { feature: "Embeddable buy button", gumroad: "Limited", paygate: "Yes (Pro)" },
  { feature: "QR code sharing", gumroad: "No", paygate: "Yes (Pro)" },
  { feature: "Custom SEO meta tags", gumroad: "Limited", paygate: "Yes (Pro)" },
  { feature: "Revenue analytics", gumroad: "Basic", paygate: "Yes (Pro)" },
  { feature: "Payments via Stripe", gumroad: "Indirect (Gumroad processes)", paygate: "Direct to your Stripe" },
  { feature: "Branding removal", gumroad: "No", paygate: "Yes (Pro)" },
];

export default function GumroadAlternativePage() {
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
          <span style={{ color: "var(--foreground)" }}>PayGate vs Gumroad</span>
        </div>
      </div>

      {/* Article Header */}
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
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>5 min read</span>
        </div>

        <h1 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.15,
          margin: "0 0 20px",
        }}>
          PayGate vs Gumroad: Why Creators Are Switching in 2026
        </h1>

        <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 48px" }}>
          Gumroad pioneered selling digital products online. But with a 10% transaction fee plus $0.50 per sale, many creators are looking for alternatives that let them keep more of what they earn. Here&apos;s how PayGate compares.
        </p>

        {/* Section: The Fee Problem */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          The fee problem
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          Gumroad charges a flat <strong style={{ color: "var(--foreground)" }}>10% fee on every sale plus $0.50 per transaction</strong>. When you&apos;re just starting out, that might feel invisible. But as your revenue grows, the math gets painful:
        </p>
        <ul style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px", paddingLeft: 20 }}>
          <li>Sell $1,000/month? Gumroad takes <strong style={{ color: "var(--foreground)" }}>$100+</strong></li>
          <li>Sell $5,000/month? Gumroad takes <strong style={{ color: "var(--foreground)" }}>$500+</strong></li>
          <li>Sell $10,000/month? Gumroad takes <strong style={{ color: "var(--foreground)" }}>$1,000+</strong></li>
        </ul>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          That&apos;s money that could go toward marketing, new products, or your own pocket. And here&apos;s the thing: Gumroad uses Stripe under the hood anyway. PayGate connects directly to <em>your</em> Stripe account, cutting out the middleman.
        </p>

        {/* Fee Comparison Table */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Fee comparison: how much you keep
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
          Here&apos;s what you&apos;d pay in platform fees at different revenue levels (excluding Stripe&apos;s standard 2.9% + $0.30 processing fee, which applies on all platforms):
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
            <span>Monthly Revenue</span>
            <span style={{ textAlign: "center" }}>Gumroad (10%)</span>
            <span style={{ textAlign: "center" }}>PayGate Free (5%)</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>PayGate Pro (2%)</span>
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
              <span style={{ textAlign: "center", color: "#ef4444" }}>{row.gumroad}</span>
              <span style={{ textAlign: "center", color: "var(--muted)" }}>{row.paygateFree}</span>
              <span style={{ textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{row.paygatePro}</span>
              <span style={{ textAlign: "center", fontWeight: 700, color: "var(--primary)" }}>{row.saved}/mo</span>
            </div>
          ))}
        </div>

        {/* Section: Feature Comparison */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Feature-by-feature comparison
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>
          Lower fees are great, but PayGate also gives you tools Gumroad doesn&apos;t offer:
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
            gridTemplateColumns: "1fr 120px 140px",
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
            <span style={{ textAlign: "center" }}>Gumroad</span>
            <span style={{ textAlign: "center", color: "var(--primary)" }}>PayGate</span>
          </div>
          {FEATURES.map((row, i) => (
            <div
              key={row.feature}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 140px",
                padding: "12px 16px",
                borderBottom: i < FEATURES.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "0.85rem",
                alignItems: "center",
                background: row.highlight ? "rgba(22,163,74,0.03)" : undefined,
              }}
            >
              <span>{row.feature}</span>
              <span style={{ textAlign: "center", color: "var(--muted)" }}>{row.gumroad}</span>
              <span style={{ textAlign: "center", fontWeight: row.highlight ? 700 : 500, color: row.highlight ? "var(--primary)" : "var(--foreground)" }}>{row.paygate}</span>
            </div>
          ))}
        </div>

        {/* Section: Who Should Switch */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Who should switch?
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          PayGate is built for creators who want more control and lower costs:
        </p>
        <ul style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 2.2, margin: "0 0 12px", paddingLeft: 20 }}>
          <li><strong style={{ color: "var(--foreground)" }}>Notion template sellers</strong> tired of Gumroad&apos;s 10% cut</li>
          <li><strong style={{ color: "var(--foreground)" }}>Course creators</strong> who want exit intent popups and order bumps to boost revenue</li>
          <li><strong style={{ color: "var(--foreground)" }}>Ebook authors</strong> who want customizable checkout pages, not a generic Gumroad page</li>
          <li><strong style={{ color: "var(--foreground)" }}>Freelancers and coaches</strong> who need simple payment links with professional branding</li>
          <li><strong style={{ color: "var(--foreground)" }}>Anyone selling $500+/month</strong> where the fee savings quickly add up</li>
        </ul>
        <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, margin: "0 0 40px" }}>
          If you&apos;re just starting out and selling a few dollars a month, Gumroad works fine. But the moment your revenue starts growing, every percentage point matters.
        </p>

        {/* Section: How to Switch */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          How to switch in 3 minutes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {[
            { step: "1", title: "Create your free PayGate account", desc: "Sign up at pay-gate.dev and connect your Stripe account. Takes 60 seconds." },
            { step: "2", title: "Build your checkout page", desc: "Pick from 8+ templates, add your product details, pricing, and images. Customize colors, add countdown timers, discount codes, and more." },
            { step: "3", title: "Share your new link", desc: "Replace your Gumroad links with your new PayGate checkout URL. Share via link, QR code, embeddable button, or email." },
          ].map((item) => (
            <div key={item.step} style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: 20,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(22,163,74,0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.95rem",
                flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section: FAQ */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
          Common questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {[
            { q: "Do I need a Stripe account?", a: "Yes. PayGate connects directly to your Stripe account so you receive payments instantly. If you don't have one, Stripe setup takes about 5 minutes." },
            { q: "Can I use PayGate for physical products?", a: "PayGate is optimized for digital products, services, and subscriptions. If you're selling physical goods that need shipping, Gumroad or Shopify may be a better fit." },
            { q: "What about Gumroad's audience/discover feature?", a: "Gumroad Discover sends some organic traffic, but most successful sellers drive their own traffic via Medium, social media, or SEO anyway. PayGate gives you better checkout tools to convert that traffic at a lower cost." },
            { q: "Is there a free plan?", a: "Yes. PayGate's free plan gives you 3 checkout pages, 5 templates, and charges a 5% platform fee (half of Gumroad). Upgrade to Pro ($12/month) for unlimited pages, all templates, and just 2% fees." },
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
