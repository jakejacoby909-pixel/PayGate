"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { isAdmin } from "@/components/AuthProvider";

export default function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, configured, signOut, loading, plan } = useAuth();
  const isPro = plan === "pro";

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [profileMenuOpen]);

  return (
    <>
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
                <Link
                  href="/pricing"
                  style={{
                    fontSize: "0.8rem",
                    color: "#a78bfa",
                    textDecoration: "none",
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Pro
                </Link>
                <div ref={profileRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: profileMenuOpen ? "1.5px solid rgba(22,163,74,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
                      background: profileMenuOpen ? "rgba(22,163,74,0.1)" : "linear-gradient(135deg, rgba(22,163,74,0.15), rgba(6,95,70,0.15))",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                      padding: 0,
                    }}
                  >
                    {(user.email || "U")[0].toUpperCase()}
                  </button>
                  {profileMenuOpen && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: 220,
                      background: "#1c1c1c",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: 6,
                      zIndex: 200,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                      animation: "fadeIn 0.15s ease-out",
                    }}>
                      <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>
                          {user.email?.split("@")[0] || "User"}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
                          {user.email}
                        </div>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 6,
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: isPro ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.05)",
                          color: isPro ? "#a78bfa" : "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}>
                          {isPro ? "Pro Plan" : "Free Plan"}
                        </div>
                      </div>
                      {[
                        { label: "Dashboard", href: "/dashboard", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
                        { label: "Create Page", href: "/builder", icon: "M12 5v14M5 12h14" },
                        { label: "Pricing", href: "/pricing", icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setProfileMenuOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "9px 12px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontSize: "0.82rem",
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.6)",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                            <path d={item.icon} />
                          </svg>
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                      <button
                        onClick={() => { setProfileMenuOpen(false); signOut(); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: 8,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: "#ef4444",
                          fontFamily: "inherit",
                          textAlign: "left",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
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
                  href="/pricing"
                  style={{ fontSize: "0.9rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500, padding: "8px 16px", borderRadius: 8, transition: "color 0.15s" }}
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  style={{ fontSize: "0.9rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500, padding: "8px 16px", borderRadius: 8, transition: "color 0.15s" }}
                >
                  Blog
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
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
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
    </>
  );
}
