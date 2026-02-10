"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import MoneyRain from "@/components/MoneyRain";
import { useAuth } from "@/components/AuthProvider";
import { isAdmin } from "@/components/AuthProvider";

const FEATURES = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Launch in Seconds",
    description: "Go from idea to live checkout page in under 60 seconds. No code, no complexity.",
  },
  {
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    title: "Fully Customizable",
    description: "8 stunning templates, custom colors, fonts, logos, and backgrounds. Make it truly yours.",
  },
  {
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    title: "Stripe Powered",
    description: "Enterprise-grade payment processing. Accept cards, Apple Pay, Google Pay, and more.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Built-in Analytics",
    description: "Track views, conversions, and revenue. Know exactly how your pages perform.",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Urgency Tools",
    description: "Countdown timers, stock counters, and social proof to boost your conversion rate.",
  },
  {
    icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
    title: "Easy Sharing",
    description: "Share via link, QR code, embed, or social media. Reach customers everywhere.",
  },
];

const STEPS = [
  { number: "01", title: "Create", description: "Enter your product details, set your price, and upload images", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
  { number: "02", title: "Customize", description: "Pick a template, choose colors, fonts, and enable conversion features", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { number: "03", title: "Share", description: "Get a unique link, QR code, or embed — and start accepting payments instantly", icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Course Creator", text: "PayGate replaced my entire checkout flow. Went from 2% to 6.5% conversion overnight. The templates are gorgeous.", avatar: "SC" },
  { name: "James Parker", role: "SaaS Founder", text: "I set up a checkout page for my new product in literally 45 seconds. The countdown timer alone paid for itself.", avatar: "JP" },
  { name: "Emma Rodriguez", role: "Digital Artist", text: "Finally a checkout builder that doesn't look generic. My customers actually compliment my payment page.", avatar: "ER" },
];

const TRUST_LOGOS = ["Stripe", "SSL", "PCI DSS", "GDPR", "SOC 2", "256-bit"];

export default function LandingPage() {
  const [showMoneyRain, setShowMoneyRain] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, configured, signOut, loading } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowMoneyRain(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", position: "relative" }}>
      {showMoneyRain && <MoneyRain duration={4000} />}

      {/* Animated Orbs Background */}
      <div className="animated-bg-orbs">
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(22,163,74,0.35)", top: "-10%", left: "-5%", "--orb-duration": "28s", "--orb-delay": "0s" }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(34,197,94,0.25)", top: "20%", right: "-8%", "--orb-duration": "32s", "--orb-delay": "3s" }} />
        <div className="orb" style={{ width: 350, height: 350, background: "rgba(22,163,74,0.20)", bottom: "10%", left: "15%", "--orb-duration": "25s", "--orb-delay": "5s" }} />
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(74,222,128,0.25)", top: "50%", left: "50%", "--orb-duration": "35s", "--orb-delay": "2s" }} />
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(22,163,74,0.15)", bottom: "-15%", right: "10%", "--orb-duration": "22s", "--orb-delay": "7s" }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 24px",
      }}>
        <div className="glass" style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 24px",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>PayGate</span>
          </div>
          {/* Hamburger - mobile only */}
          <button className="nav-hamburger" onClick={() => setMobileMenuOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!loading && user && isAdmin(user) && (
              <Link
                href="/admin"
                style={{ fontSize: "0.9rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500, padding: "8px 16px", borderRadius: 8, transition: "color 0.15s" }}
              >
                Admin
              </Link>
            )}
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard"
                  style={{ fontSize: "0.9rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500, padding: "8px 16px", borderRadius: 8, transition: "color 0.15s" }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                    padding: "8px 16px",
                    fontFamily: "inherit",
                  }}
                >
                  Sign Out
                </button>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "white",
                }}>
                  {(user.email || "U")[0].toUpperCase()}
                </div>
              </>
            ) : !loading && (
              <>
                <Link
                  href="/login"
                  style={{ fontSize: "0.9rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500, padding: "8px 16px", borderRadius: 8 }}
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  style={{ fontSize: "0.9rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500, padding: "8px 16px", borderRadius: 8, transition: "color 0.15s" }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/builder"
                  className="btn-primary ripple-btn"
                  style={{ padding: "8px 20px", fontSize: "0.88rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {!loading && user && isAdmin(user) && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          )}
          {!loading && user ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button className="mobile-nav-link" onClick={() => { signOut(); setMobileMenuOpen(false); }}>Sign Out</button>
            </>
          ) : !loading && (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            </>
          )}
          <Link
            href="/builder"
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: "var(--primary)", borderRadius: 9999, marginTop: 12 }}
          >
            Get Started
          </Link>
        </div>
      )}

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
            Now in public beta
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
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            Create beautiful, hosted payment pages powered by Stripe in seconds.
            No code required. Start selling in under a minute.
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
              href="#how-it-works"
              className="btn-secondary"
              style={{ padding: "16px 36px", fontSize: "1.05rem", textDecoration: "none" }}
            >
              See How It Works
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
              { value: "200+", label: "Pages Created" },
              { value: "99.9%", label: "Uptime" },
              { value: "<2s", label: "Load Time" },
              { value: "12+", label: "Countries" },
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

        {/* Realistic Hero Mockup */}
        <div
          className="animate-fade-in-up delay-500"
          style={{ maxWidth: 1000, margin: "80px auto 0", padding: "0 24px", position: "relative" }}
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
                paygate.app/checkout/your-product
              </div>
            </div>
            {/* Realistic checkout mockup */}
            <div className="hero-mockup-area" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              background: "linear-gradient(135deg, #f0fdf4, #fefce8, #f7fdf9)",
              minHeight: 380,
              position: "relative",
            }}>
              <div className="animate-float" style={{
                background: "white",
                borderRadius: 20,
                padding: 32,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                width: "100%",
                maxWidth: 360,
                border: "1px solid #eee",
                position: "relative",
              }}>
                {/* Product name */}
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 4, letterSpacing: "-0.01em" }}>
                  Premium Course
                </div>
                <div style={{ fontSize: "0.82rem", color: "#888", marginBottom: 16 }}>
                  Lifetime access to all modules
                </div>
                {/* Price */}
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a", marginBottom: 20, letterSpacing: "-0.03em" }}>
                  $49.00
                </div>
                {/* Pay button */}
                <div style={{
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #16a34a, #065f46)",
                  borderRadius: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                  cursor: "default",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Pay $49.00
                </div>
                {/* Security badges */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16, opacity: 0.35, fontSize: "0.68rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    Secure
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    SSL
                  </span>
                  <span>Powered by Stripe</span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="animate-float-delayed hero-floating-badge" style={{
                position: "absolute",
                top: 40,
                right: 60,
                padding: "8px 14px",
                borderRadius: 10,
                background: "white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                border: "1px solid #eee",
                fontSize: "0.78rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <span style={{ color: "#16a34a" }}>147 sold</span>
              </div>
              <div className="animate-float hero-floating-badge" style={{
                position: "absolute",
                bottom: 60,
                left: 40,
                padding: "8px 14px",
                borderRadius: 10,
                background: "white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                border: "1px solid #eee",
                fontSize: "0.78rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span style={{ marginLeft: 2, color: "#666" }}>4.9</span>
              </div>
              <div className="animate-float-delayed hero-floating-badge" style={{
                position: "absolute",
                bottom: 40,
                right: 80,
                padding: "6px 12px",
                borderRadius: 8,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                SSL Secure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{
        padding: "32px 0",
        borderBottom: "1px solid var(--border)",
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

      {/* Features */}
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
                Features
              </p>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
                Everything you need to sell online
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 560, margin: "0 auto" }}>
                PayGate comes packed with features to create beautiful checkout experiences and maximize conversions.
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
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Testimonials
              </p>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
                Loved by creators worldwide
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
                  <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "var(--foreground)",
                    margin: "0 0 20px",
                    flex: 1,
                  }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
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
                      <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
            <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Terms</Link>
            <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.15s" }}>Privacy</Link>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>
            &copy; {new Date().getFullYear()} PayGate. Powered by Stripe.
          </p>
        </div>
      </footer>

      {/* Social Proof Indicator */}
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
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.04)",
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
        14 pages created today
      </div>
    </div>
  );
}
