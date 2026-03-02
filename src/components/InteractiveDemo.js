"use client";
import { useState, useEffect, useCallback } from "react";

const DEMO_TEMPLATES = [
  { id: "minimal", name: "Minimal", bg: "#ffffff", card: "#ffffff", accent: "#16a34a", text: "#1a1a1a", muted: "#666", border: "#e5e7eb", isDark: false },
  { id: "bold", name: "Bold", bg: "#052e16", card: "#14532d", accent: "#16a34a", text: "#f0fdf4", muted: "rgba(255,255,255,0.6)", border: "#166534", isDark: true },
  { id: "neon", name: "Neon", bg: "#0a0a0a", card: "#141414", accent: "#00ff88", text: "#ffffff", muted: "rgba(255,255,255,0.5)", border: "rgba(0,255,136,0.15)", isDark: true },
  { id: "sunset", name: "Sunset", bg: "#fff7ed", card: "#ffffff", accent: "#f97316", text: "#1a1a1a", muted: "#666", border: "#fed7aa", isDark: false },
  { id: "glass", name: "Glass", bg: "#0a2414", card: "rgba(255,255,255,0.06)", accent: "#22c55e", text: "#ffffff", muted: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.08)", isDark: true },
  { id: "brutalist", name: "Brutalist", bg: "#ffffff", card: "#ffffff", accent: "#000000", text: "#000000", muted: "#444", border: "#000", isDark: false },
];

const FEATURES = [
  { id: "countdown", label: "Countdown Timer", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "stock", label: "Stock Counter", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "coupon", label: "Coupon Code", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  { id: "social", label: "Social Proof", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "guarantee", label: "Guarantee Badge", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "testimonials", label: "Testimonials", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { id: "bump", label: "Order Bump", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
  { id: "quantity", label: "Quantity Picker", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
];

function CountdownTimer({ accent, isDark }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const target = Date.now() + 86400000 + 7200000 + 1140000;
    const update = () => setSecs(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {[
        { v: d, l: "Days" },
        { v: h, l: "Hrs" },
        { v: m, l: "Min" },
        { v: s, l: "Sec" },
      ].map((b) => (
        <div key={b.l} style={{
          textAlign: "center",
          padding: "6px 10px",
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          borderRadius: 6,
          minWidth: 44,
        }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {String(b.v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "0.55rem", textTransform: "uppercase", opacity: 0.5, fontWeight: 600, letterSpacing: "0.05em" }}>
            {b.l}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InteractiveDemo() {
  const [templateIdx, setTemplateIdx] = useState(2);
  const [enabled, setEnabled] = useState(new Set(["countdown", "social", "guarantee"]));
  const [paused, setPaused] = useState(false);

  const cycleTemplate = useCallback(() => {
    setTemplateIdx((i) => (i + 1) % DEMO_TEMPLATES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(cycleTemplate, 4000);
    return () => clearInterval(timer);
  }, [paused, cycleTemplate]);

  const t = DEMO_TEMPLATES[templateIdx];
  const isBrutalist = t.id === "brutalist";
  const cardRadius = isBrutalist ? 4 : 16;
  const btnRadius = isBrutalist ? 4 : 9999;

  function toggle(id) {
    setPaused(true);
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const has = (id) => enabled.has(id);

  return (
    <div>
      <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}
        className="demo-layout"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Checkout Preview */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div className="border-glow" style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "var(--shadow-xl), 0 0 80px rgba(22,163,74,0.08)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
          }}>
            {/* Browser chrome */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
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
                fontSize: "0.72rem",
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

            {/* Checkout page */}
            <div style={{
              padding: "32px 20px",
              background: t.bg,
              minHeight: 520,
              transition: "background 0.5s ease",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Promo banner */}
              {has("countdown") && (
                <div style={{
                  textAlign: "center",
                  marginBottom: 16,
                  padding: "8px 12px",
                  borderRadius: isBrutalist ? 0 : 8,
                  background: isDark(t) ? `${t.accent}18` : `${t.accent}10`,
                  border: `1px solid ${t.accent}30`,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: t.accent,
                  animation: "fadeSlideIn 0.3s ease",
                  maxWidth: 400,
                  margin: "0 auto 16px",
                }}>
                  Limited time offer — Sale ends soon!
                </div>
              )}

              <div style={{
                maxWidth: 400,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
                {/* Main card */}
                <div style={{
                  background: t.card,
                  borderRadius: cardRadius,
                  border: isBrutalist ? `3px solid ${t.border}` : `1px solid ${t.border}`,
                  boxShadow: isBrutalist
                    ? `4px 4px 0 ${t.border}`
                    : isDark(t) ? `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${t.accent}10` : "0 4px 24px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  transition: "all 0.5s ease",
                  ...(t.id === "glass" ? { backdropFilter: "blur(20px)" } : {}),
                }}>
                    <div style={{ padding: "20px 20px 24px" }}>
                    {/* Social proof */}
                    {has("social") && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 12,
                        animation: "fadeSlideIn 0.3s ease",
                      }}>
                        <div style={{ display: "flex", marginRight: -2 }}>
                          {[0, 1, 2].map((i) => (
                            <div key={i} style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: `hsl(${140 + i * 30}, 50%, ${isDark(t) ? 45 : 55}%)`,
                              border: `2px solid ${t.card === "rgba(255,255,255,0.06)" ? "rgba(10,36,20,0.8)" : t.card}`,
                              marginLeft: i > 0 ? -6 : 0,
                              fontSize: "0.5rem",
                              fontWeight: 700,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              {["S", "M", "J"][i]}
                            </div>
                          ))}
                        </div>
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: t.accent,
                        }}>
                          1,247 purchased
                        </span>
                      </div>
                    )}

                    <div style={{
                      fontSize: isBrutalist ? "1.1rem" : "1.15rem",
                      fontWeight: isBrutalist ? 900 : 700,
                      color: t.text,
                      marginBottom: 4,
                      textTransform: isBrutalist ? "uppercase" : "none",
                      letterSpacing: isBrutalist ? "0.02em" : "-0.01em",
                      transition: "color 0.5s ease",
                    }}>
                      Premium Design Course
                    </div>
                    <div style={{
                      fontSize: "0.78rem",
                      color: t.muted,
                      marginBottom: 16,
                      lineHeight: 1.5,
                      transition: "color 0.5s ease",
                    }}>
                      Complete UI/UX masterclass with 40+ lessons, project files, and lifetime updates
                    </div>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                      <span style={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        color: t.accent,
                        letterSpacing: "-0.03em",
                        transition: "color 0.5s ease",
                      }}>
                        $49.00
                      </span>
                      <span style={{
                        fontSize: "0.85rem",
                        color: t.muted,
                        textDecoration: "line-through",
                        transition: "color 0.5s ease",
                      }}>
                        $79.00
                      </span>
                    </div>

                    {/* Countdown */}
                    {has("countdown") && (
                      <div style={{
                        marginBottom: 16,
                        animation: "fadeSlideIn 0.3s ease",
                      }}>
                        <div style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: t.accent,
                          marginBottom: 8,
                          textAlign: "center",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}>
                          Sale ends in
                        </div>
                        <CountdownTimer accent={t.accent} isDark={isDark(t)} />
                      </div>
                    )}

                    {/* Stock */}
                    {has("stock") && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 16,
                        padding: "8px 12px",
                        borderRadius: isBrutalist ? 2 : 8,
                        background: isDark(t) ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        animation: "fadeSlideIn 0.3s ease",
                      }}>
                        <div style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#f59e0b",
                          animation: "pulseDot 2s ease-out infinite",
                        }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: t.text, transition: "color 0.5s ease" }}>
                          Only 12 left at this price
                        </span>
                      </div>
                    )}

                    {/* Quantity */}
                    {has("quantity") && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                        padding: "8px 12px",
                        borderRadius: isBrutalist ? 2 : 8,
                        background: isDark(t) ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        animation: "fadeSlideIn 0.3s ease",
                      }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: t.text }}>Quantity</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: isBrutalist ? 2 : 6,
                            border: `1px solid ${isDark(t) ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: t.muted,
                            cursor: "default",
                          }}>-</div>
                          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: t.text, fontVariantNumeric: "tabular-nums" }}>1</span>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: isBrutalist ? 2 : 6,
                            border: `1px solid ${isDark(t) ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: t.muted,
                            cursor: "default",
                          }}>+</div>
                        </div>
                      </div>
                    )}

                    {/* Coupon */}
                    {has("coupon") && (
                      <div style={{
                        display: "flex",
                        gap: 6,
                        marginBottom: 16,
                        animation: "fadeSlideIn 0.3s ease",
                      }}>
                        <div style={{
                          flex: 1,
                          padding: "10px 12px",
                          borderRadius: isBrutalist ? 2 : 8,
                          border: `1px solid ${isDark(t) ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          background: isDark(t) ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                          fontSize: "0.78rem",
                          color: t.muted,
                        }}>
                          Enter coupon code
                        </div>
                        <div style={{
                          padding: "10px 16px",
                          borderRadius: isBrutalist ? 2 : 8,
                          background: isDark(t) ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: t.text,
                          cursor: "default",
                          transition: "color 0.5s ease",
                        }}>
                          Apply
                        </div>
                      </div>
                    )}

                    {/* Guarantee */}
                    {has("guarantee") && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                        padding: "10px 12px",
                        borderRadius: isBrutalist ? 2 : 8,
                        background: isDark(t) ? `${t.accent}10` : `${t.accent}08`,
                        border: `1px solid ${t.accent}20`,
                        animation: "fadeSlideIn 0.3s ease",
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: t.accent }}>
                          30-Day Money Back Guarantee
                        </span>
                      </div>
                    )}

                    {/* Pay button */}
                    <div style={{
                      padding: "14px 24px",
                      background: isBrutalist ? t.accent : `linear-gradient(135deg, ${t.accent}, ${t.accent}dd)`,
                      borderRadius: btnRadius,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      color: isBrutalist ? "#fff" : (isDark(t) ? "#000" : "white"),
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      boxShadow: `0 4px 16px ${t.accent}30`,
                      cursor: "default",
                      transition: "all 0.5s ease",
                      textTransform: isBrutalist ? "uppercase" : "none",
                      letterSpacing: isBrutalist ? "0.05em" : "0",
                      border: isBrutalist ? `3px solid ${t.border}` : "none",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      Pay $49.00
                    </div>

                    {/* Security footer */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      marginTop: 14,
                      opacity: 0.35,
                      fontSize: "0.65rem",
                      color: t.text,
                      transition: "color 0.5s ease",
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        Secure
                      </span>
                      <span>Powered by Stripe</span>
                    </div>
                  </div>
                </div>

                {/* Bump offer */}
                {has("bump") && (
                  <div style={{
                    borderRadius: cardRadius,
                    border: isBrutalist ? `3px solid ${t.border}` : `1px dashed ${t.accent}50`,
                    background: isDark(t) ? `${t.accent}08` : `${t.accent}06`,
                    padding: 16,
                    animation: "fadeSlideIn 0.3s ease",
                    boxShadow: isBrutalist ? `4px 4px 0 ${t.border}` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: isBrutalist ? 0 : 4,
                        border: `2px solid ${t.accent}`,
                        flexShrink: 0,
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: t.text, marginBottom: 2, transition: "color 0.5s ease" }}>
                          Add: Project Files Bundle — $19
                        </div>
                        <div style={{ fontSize: "0.68rem", color: t.muted, lineHeight: 1.4, transition: "color 0.5s ease" }}>
                          Get all 40+ project source files, templates, and bonus resources
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Testimonials */}
                {has("testimonials") && (
                  <div style={{
                    background: t.card,
                    borderRadius: cardRadius,
                    border: isBrutalist ? `3px solid ${t.border}` : `1px solid ${t.border}`,
                    padding: 16,
                    animation: "fadeSlideIn 0.3s ease",
                    boxShadow: isBrutalist ? `4px 4px 0 ${t.border}` : isDark(t) ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)",
                    ...(t.id === "glass" ? { backdropFilter: "blur(20px)" } : {}),
                  }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: t.text, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em", transition: "color 0.5s ease" }}>
                      What customers say
                    </div>
                    {[
                      { name: "Sarah K.", text: "This course completely changed how I approach design. Worth every penny!", rating: 5 },
                      { name: "Mike R.", text: "The project files alone are worth the price. Incredible quality.", rating: 5 },
                    ].map((review) => (
                      <div key={review.name} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= review.rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: t.muted, lineHeight: 1.5, marginBottom: 2, transition: "color 0.5s ease" }}>
                          &ldquo;{review.text}&rdquo;
                        </div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 600, color: t.text, opacity: 0.7, transition: "color 0.5s ease" }}>
                          — {review.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="demo-controls" style={{
          width: 280,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {/* Template picker */}
          <div>
            <div style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}>
              Template
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {DEMO_TEMPLATES.map((tmpl, i) => (
                <button
                  key={tmpl.id}
                  onClick={() => { setTemplateIdx(i); setPaused(true); }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: i === templateIdx
                      ? `2px solid ${tmpl.accent}`
                      : "2px solid rgba(255,255,255,0.06)",
                    background: i === templateIdx
                      ? `${tmpl.accent}12`
                      : "rgba(255,255,255,0.02)",
                    color: i === templateIdx ? "var(--foreground)" : "var(--muted)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: tmpl.bg,
                    border: `1.5px solid ${tmpl.accent}`,
                    flexShrink: 0,
                  }} />
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Feature toggles */}
          <div>
            <div style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}>
              Conversion Features
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {FEATURES.map((f) => {
                const isOn = has(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggle(f.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid transparent",
                      background: isOn ? "rgba(22,163,74,0.08)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {/* Toggle */}
                    <div style={{
                      width: 32,
                      height: 18,
                      borderRadius: 9,
                      background: isOn ? "var(--primary)" : "rgba(255,255,255,0.1)",
                      position: "relative",
                      transition: "background 0.2s ease",
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: 2,
                        left: isOn ? 16 : 2,
                        transition: "left 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOn ? "var(--primary)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.2s ease" }}>
                      <path d={f.icon} />
                    </svg>
                    <span style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      color: isOn ? "var(--foreground)" : "var(--muted)",
                      transition: "color 0.2s ease",
                    }}>
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            padding: "16px",
            borderRadius: 12,
            background: "var(--primary-light)",
            border: "1px solid rgba(22,163,74,0.15)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
              Build yours in 60 seconds
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 12 }}>
              All features shown above + more
            </div>
            <a
              href="/builder"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                borderRadius: 9999,
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "opacity 0.2s ease",
              }}
            >
              Start Building
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Template selector pills (mobile-friendly alternative) */}
      <div className="demo-template-pills" style={{
        display: "none",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 6,
        marginTop: 16,
      }}>
        {DEMO_TEMPLATES.map((tmpl, i) => (
          <button
            key={tmpl.id}
            onClick={() => { setTemplateIdx(i); setPaused(true); }}
            style={{
              padding: "6px 14px",
              borderRadius: 9999,
              border: i === templateIdx ? `1.5px solid ${tmpl.accent}` : "1.5px solid rgba(255,255,255,0.08)",
              background: i === templateIdx ? `${tmpl.accent}15` : "rgba(255,255,255,0.03)",
              color: i === templateIdx ? tmpl.accent : "rgba(255,255,255,0.4)",
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

function isDark(t) {
  return t.isDark;
}
