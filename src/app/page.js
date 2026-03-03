import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import LandingNav from "@/components/LandingNav";
import HeroEffects from "@/components/HeroEffects";
import InteractiveDemo from "@/components/InteractiveDemo";
import FAQ from "@/components/FAQ";
import ReferralCapture from "@/components/ReferralCapture";

const FEATURES = [
  {
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    title: "Product Showcase",
    description: "Upload product images, add descriptions, and display your product beautifully with multiple layout options.",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Countdown Timers",
    description: "Create urgency with live countdown timers. Set sale deadlines that drive customers to buy now.",
  },
  {
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    title: "Coupons & Discounts",
    description: "Create coupon codes your customers can apply at checkout. Set percentage discounts to boost conversions.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Social Proof",
    description: "Show how many people have purchased. Real-time purchase counters build trust and drive sales.",
  },
  {
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    title: "Order Bumps",
    description: "Add one-click upsells at checkout. Increase average order value with complementary products.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Trust & Guarantees",
    description: "Money-back guarantee badges, SSL security indicators, and Stripe-powered checkout builds buyer confidence.",
  },
];

const MORE_FEATURES = [
  { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", title: "Stripe Payments", desc: "Cards, Apple Pay, Google Pay — powered by Stripe" },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Analytics", desc: "Track views, conversions, and revenue per page" },
  { icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z", title: "Easy Sharing", desc: "Share via link, QR code, embed, or social media" },
  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "Testimonials", desc: "Display customer reviews with star ratings" },
  { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", title: "Stock Counters", desc: "Show limited availability to create urgency" },
  { icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", title: "Custom Branding", desc: "Your logo, colors, fonts — make it truly yours" },
  { icon: "M4 4v16" , title: "8 Templates", desc: "Minimal, Bold, Neon, Sunset, Glass, Brutalist + more" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Quantity Selector", desc: "Let customers buy multiple at checkout" },
];

const STEPS = [
  { number: "01", title: "Create", description: "Enter your product details, set your price, and upload images", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
  { number: "02", title: "Customize", description: "Pick a template, toggle conversion features, and make it yours", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { number: "03", title: "Share & Sell", description: "Get a unique link, QR code, or embed — start accepting payments instantly", icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" },
];

const TESTIMONIALS = [
  { name: "Course Creators", role: "Sell digital courses", text: "Set up a beautiful checkout page for your online course in seconds. Add countdown timers, testimonials, and social proof to boost conversions.", avatar: "CC" },
  { name: "SaaS Founders", role: "Launch products fast", text: "Skip building a checkout flow from scratch. Pick a template, enable order bumps and coupons, and start collecting payments via Stripe instantly.", avatar: "SF" },
  { name: "Digital Artists", role: "Sell your work", text: "Showcase your work with product images, custom branding, and guarantee badges. 8 templates that make your products look premium.", avatar: "DA" },
];

const TRUST_LOGOS = ["Stripe", "SSL", "256-bit Encryption"];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PayGate",
    url: "https://pay-gate.dev",
    description: "Create beautiful, hosted checkout pages powered by Stripe in seconds. No code required.",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PayGate",
    url: "https://pay-gate.dev",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free plan available — create checkout pages with no monthly fee",
    },
    description: "Checkout page builder powered by Stripe. 8 templates, built-in analytics, countdown timers, coupons, order bumps, and more.",
    featureList: "Checkout templates, Analytics, Countdown timers, Coupons, Order bumps, Social proof, Testimonials, QR codes, Custom branding, Stripe integration",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does PayGate cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PayGate is free to start. The free plan includes all features with a 5% transaction fee. The Pro plan is $12/month with a reduced 2% fee.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to know how to code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. PayGate is a no-code checkout page builder. You can create a professional checkout page in under 60 seconds using one of 8 templates.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods does PayGate support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PayGate is powered by Stripe, so it supports credit cards, debit cards, Apple Pay, Google Pay, and more depending on your region.",
        },
      },
    ],
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", position: "relative" }}>
      <ReferralCapture />
      {/* JSON-LD Structured Data */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <HeroEffects />
      <LandingNav />

      {/* Hero */}
      <section className="hero-gradient" style={{
        paddingTop: 160,
        paddingBottom: 100,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div
            className="animate-fade-in-down"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 9999,
              background: "var(--primary-light)",
              color: "var(--primary)",
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: 28,
              border: "1px solid rgba(22,163,74,0.15)",
            }}
          >
            <span className="pulse-dot" style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--primary)",
              display: "inline-block",
            }} />
            Now live
          </div>

          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              margin: "0 0 20px",
            }}
          >
            Checkout pages{" "}
            <br />
            that{" "}
            <span className="gradient-text-animated">convert</span>
          </h1>

          <p
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              color: "var(--muted)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto 36px",
            }}
          >
            Build complete checkout pages with product images, countdown timers, coupons,
            social proof, order bumps, and more — powered by Stripe. No code required.
          </p>

          <div
            className="animate-fade-in-up delay-200"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}
          >
            <Link
              href="/builder"
              className="btn-primary ripple-btn"
              style={{
                padding: "16px 36px",
                fontSize: "1.05rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Create Your First Page
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a
              href="#demo"
              className="btn-secondary"
              style={{ padding: "16px 36px", fontSize: "1.05rem", textDecoration: "none" }}
            >
              Try the Live Demo
            </a>
          </div>

          {/* Animated Stats */}
          <div
            className="animate-fade-in-up delay-400 hero-stats-row"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 48,
              marginTop: 64,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "8", label: "Checkout Templates" },
              { value: "11", label: "Conversion Tools" },
              { value: "<2s", label: "Load Time" },
              { value: "0%", label: "Monthly Fee" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--foreground)" }}>
                  <AnimatedCounter value={stat.value} duration={1800} />
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" style={{
        padding: "80px 24px 100px",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Live Demo
            </p>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
              See what your checkout page looks like
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 560, margin: "0 auto" }}>
              Toggle features on and off. Switch templates. This is exactly what your customers see.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <InteractiveDemo />
        </ScrollReveal>
      </section>

      {/* Trust bar */}
      <section style={{
        padding: "32px 0",
        borderBottom: "1px solid var(--border)",
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
            Trusted & Secure
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", padding: "0 24px", opacity: 0.35 }}>
          {TRUST_LOGOS.map((logo) => (
            <div key={logo} style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
              Three steps to get paid
            </h2>
          </div>
        </ScrollReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 32,
        }}>
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120} animation="fade-up">
              <div className="card-glow" style={{
                padding: 32,
                borderRadius: 20,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                height: "100%",
              }}>
                <div style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  fontSize: "6rem",
                  fontWeight: 900,
                  color: "var(--primary)",
                  opacity: 0.04,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}>
                  {step.number}
                </div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  transition: "transform 0.3s ease",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.icon} />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link
              href="/builder"
              className="btn-primary ripple-btn"
              style={{ padding: "14px 32px", fontSize: "0.95rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Start Building Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Features — Conversion tools deep-dive */}
      <section id="features" style={{
        padding: "100px 24px",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Conversion Tools
              </p>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
                Not just a checkout page — a sales machine
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>
                Every checkout page comes loaded with conversion features. Toggle them on or off to match your product.
              </p>
            </div>
          </ScrollReveal>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {FEATURES.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 80} animation="fade-up">
                <div className="card-glow" style={{
                  padding: 28,
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  height: "100%",
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    transition: "transform 0.3s ease, background 0.3s ease",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={feature.icon} />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* More features as compact list */}
          <ScrollReveal delay={500}>
            <div style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}>
              {MORE_FEATURES.map((f) => (
                <div key={f.title} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d={f.icon} />
                  </svg>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>{f.title}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Use Cases
              </p>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
                Built for every creator
              </h2>
            </div>
          </ScrollReveal>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100} animation="fade-up">
                <div className="card-glow" style={{
                  padding: 28,
                  borderRadius: 16,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, hsl(${i * 30 + 130}, 65%, 45%), hsl(${i * 30 + 145}, 70%, 35%))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "white",
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{t.role}</div>
                    </div>
                  </div>
                  <p style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.7,
                    color: "var(--muted)",
                    margin: 0,
                    flex: 1,
                  }}>
                    {t.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: "100px 24px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                FAQ
              </p>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
                Common questions
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <FAQ />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        zIndex: 1,
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(22,163,74,0.06), transparent 70%)",
          pointerEvents: "none",
        }} />
        <ScrollReveal>
          <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <h2 style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.2,
              marginBottom: 16,
            }}>
              Ready to start selling?
            </h2>
            <p style={{
              fontSize: "1.1rem",
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: 36,
            }}>
              Create your first checkout page in under a minute. Free to start, no credit card required.
            </p>
            <Link
              href="/builder"
              className="btn-primary ripple-btn"
              style={{
                padding: "16px 40px",
                fontSize: "1.1rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Build Your Checkout Page
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <p style={{ fontSize: "0.82rem", color: "var(--muted-light)", marginTop: 16 }}>
              No credit card required &middot; Free forever
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "48px 24px",
        position: "relative",
        zIndex: 1,
      }}>
        <div className="footer-inner" style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
                <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>PayGate</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: "0.82rem" }}>
            <Link href="/builder" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Builder</Link>
            <Link href="/dashboard" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Dashboard</Link>
            <Link href="/pricing" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Pricing</Link>
            <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Terms</Link>
            <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Privacy</Link>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
            &copy; {new Date().getFullYear()} Jacoby Digital LLC. Powered by Stripe.
          </p>
        </div>
      </footer>

      {/* Status indicator */}
      <div className="social-proof-fixed" style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 20,
        background: "rgba(17,25,22,0.85)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.06)",
        fontSize: "0.75rem",
        fontWeight: 500,
        color: "var(--muted)",
      }}>
        <span style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#22c55e",
          display: "inline-block",
          animation: "pulseDot 2s ease-out infinite",
        }} />
        Free plan available
      </div>
    </div>
  );
}
