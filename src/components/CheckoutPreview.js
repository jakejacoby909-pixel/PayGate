"use client";
import { useState, useEffect, useRef } from "react";
import { formatPrice, timeUntil } from "@/lib/utils";

function CountdownDisplay({ date }) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const update = () => setTime(timeUntil(date));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date]);

  if (!time) return <p style={{ fontSize: "0.8rem", color: "inherit", opacity: 0.7 }}>Offer expired</p>;

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {blocks.map((b) => (
        <div key={b.label} style={{
          textAlign: "center",
          padding: "8px 12px",
          background: "rgba(0,0,0,0.06)",
          borderRadius: 8,
          minWidth: 52,
          transition: "all 0.3s ease",
        }}>
          <div style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            {String(b.value).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "0.65rem", textTransform: "uppercase", opacity: 0.6, fontWeight: 600, letterSpacing: "0.05em" }}>
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" style={{ transition: "all 0.2s ease" }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

const RANDOM_NAMES = ["Alex M.", "Jordan S.", "Taylor R.", "Casey D.", "Riley T.", "Morgan P.", "Sam W.", "Quinn B.", "Drew K.", "Avery L."];

export default function CheckoutPreview({ config, isPreview = false, onPay }) {
  const [quantity, setQuantity] = useState(1);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const prevImageRef = useRef(0);

  // New feature state
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [bumpChecked, setBumpChecked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Engagement state (live pages only)
  const [viewerCount, setViewerCount] = useState(0);
  const [purchaseToast, setPurchaseToast] = useState(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    setImgLoaded(false);
    prevImageRef.current = imageIndex;
  }, [imageIndex]);

  // Exit intent listener
  useEffect(() => {
    if (!config?.enableExitIntent || isPreview) return;
    function handleMouseLeave(e) {
      if (e.clientY <= 0) setShowExitIntent(true);
    }
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [config?.enableExitIntent, isPreview]);

  // Live viewer count (only on live pages)
  useEffect(() => {
    if (isPreview) return;
    const base = Math.floor(Math.random() * 9) + 3;
    setViewerCount(base);
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, Math.min(15, prev + change));
      });
    }, (Math.random() * 5000) + 5000);
    return () => clearInterval(interval);
  }, [isPreview]);

  // Recent purchase toasts (only on live pages)
  useEffect(() => {
    if (isPreview) return;
    const initialDelay = (Math.random() * 7000) + 8000;
    let toastTimeout;
    let intervalId;

    function showToast() {
      const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const mins = Math.floor(Math.random() * 12) + 1;
      setPurchaseToast({ name, mins });
      toastTimeout = setTimeout(() => setPurchaseToast(null), 4000);
    }

    const startTimeout = setTimeout(() => {
      showToast();
      intervalId = setInterval(showToast, (Math.random() * 15000) + 20000);
    }, initialDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(toastTimeout);
      clearInterval(intervalId);
    };
  }, [isPreview]);

  const c = config || {};
  const price = parseFloat(c.price) || 0;
  const discount = couponApplied ? (c.couponDiscount || 0) : 0;
  const discountedPrice = price * (1 - discount / 100);
  const bumpPrice = parseFloat(c.bumpOfferPrice) || 0;
  const subtotal = discountedPrice * quantity;
  const total = subtotal + (bumpChecked ? bumpPrice : 0);
  const accent = c.accentColor || "#16a34a";
  const font = c.fontFamily || "Inter, system-ui, sans-serif";
  const btnRadius = c.buttonStyle === "pill" ? "9999px" : c.buttonStyle === "square" ? "4px" : "12px";

  function handleApplyCoupon() {
    if (c.enableCoupon && couponInput.trim().toUpperCase() === (c.couponCode || "").toUpperCase() && couponInput.trim()) {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 2000);
    }
  }

  function handlePay() {
    if (onPay) {
      setIsProcessing(true);
      onPay({ quantity, total, couponApplied });
      setTimeout(() => setIsProcessing(false), 2000);
    }
  }

  function handlePasswordSubmit() {
    if (passwordInput === (c.passwordProtectionCode || "")) {
      setPasswordUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  }

  // Template-based styles
  const templateStyles = {
    minimal: {
      wrapper: { background: c.backgroundColor || "#ffffff", color: "#1a1a1a" },
      card: { background: "white", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
    },
    bold: {
      wrapper: { background: "#0f172a", color: "#f8fafc" },
      card: { background: "#1e293b", border: "1px solid #334155", boxShadow: "0 4px 30px rgba(0,0,0,0.3)" },
    },
    gradient: {
      wrapper: { background: `linear-gradient(135deg, ${accent}15, ${accent}05, #ffffff)`, color: "#1a1a1a" },
      card: { background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" },
    },
    glass: {
      wrapper: { background: `linear-gradient(135deg, ${accent}22, #0a241433, ${accent}11)`, color: "#f8fafc" },
      card: { background: "rgba(255,255,255,0.08)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" },
    },
    neon: {
      wrapper: { background: "#0a0a0a", color: "#f0f0f0" },
      card: { background: "#141414", border: `1px solid ${accent}44`, boxShadow: `0 0 30px ${accent}15, 0 4px 20px rgba(0,0,0,0.4)` },
    },
    sunset: {
      wrapper: { background: `linear-gradient(180deg, ${accent}18, #fff7ed, #ffffff)`, color: "#1a1a1a" },
      card: { background: "white", border: "1px solid #fed7aa", boxShadow: "0 4px 24px rgba(249,115,22,0.08)" },
    },
    brutalist: {
      wrapper: { background: "#ffffff", color: "#000000" },
      card: { background: "#ffffff", border: "3px solid #000000", borderRadius: "4px !important", boxShadow: "4px 4px 0px #000000" },
    },
    custom: {
      wrapper: { background: c.customBgColor || "#ffffff", color: c.customTextColor || "#1a1a1a" },
      card: { background: c.customCardBg || "#ffffff", border: c.customBorderStyle || "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" },
    },
  };

  const template = c.template || "minimal";
  const ts = templateStyles[template] || templateStyles.minimal;
  const isDark = template === "bold" || template === "glass" || template === "neon";
  const cardRadius = template === "brutalist" ? 4 : 20;

  return (
    <div
      style={{
        ...ts.wrapper,
        fontFamily: font,
        minHeight: isPreview ? "100%" : "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isPreview ? 16 : 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      {c.backgroundPattern === "dots" && (
        <div
          className="checkout-dots"
          style={{ position: "absolute", inset: 0, color: isDark ? "#fff" : "#000", opacity: isDark ? 0.04 : 0.05 }}
        />
      )}
      {c.backgroundPattern === "grid" && (
        <div
          className="checkout-grid"
          style={{ position: "absolute", inset: 0, color: isDark ? "#fff" : "#000", opacity: isDark ? 0.03 : 0.04 }}
        />
      )}
      {c.backgroundPattern === "gradient" && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at top right, ${accent}20, transparent 60%), radial-gradient(ellipse at bottom left, ${accent}15, transparent 60%)`,
        }} />
      )}

      {/* Promo Banner */}
      {c.enablePromoBanner && c.promoBannerText && (
        <div style={{
          position: isPreview ? "relative" : "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: accent,
          color: "white",
          padding: "8px 0",
          overflow: "hidden",
          fontSize: "0.8rem",
          fontWeight: 600,
          marginBottom: isPreview ? 16 : 0,
          width: isPreview ? "calc(100% + 32px)" : undefined,
          marginLeft: isPreview ? -16 : undefined,
          marginTop: isPreview ? -16 : undefined,
        }}>
          <div className="marquee-track">
            {[0, 1].map((i) => (
              <span key={i} style={{ padding: "0 48px", whiteSpace: "nowrap" }}>
                {c.promoBannerText} &nbsp;&bull;&nbsp; {c.promoBannerText} &nbsp;&bull;&nbsp; {c.promoBannerText} &nbsp;&bull;&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Password Gate */}
      {c.enablePasswordProtection && c.passwordProtectionCode && !passwordUnlocked && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: isDark ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 40,
        }}>
          <div style={{ textAlign: "center", maxWidth: 320, padding: 24 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#888" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>Protected Content</h3>
            <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: 16 }}>Enter the access code to continue</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") handlePasswordSubmit(); }}
                className={passwordError ? "animate-shake" : ""}
                placeholder="Access code"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: `1.5px solid ${passwordError ? "#ef4444" : isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
                  borderRadius: 10,
                  background: isDark ? "rgba(255,255,255,0.05)" : "white",
                  color: "inherit",
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              />
              <button
                type="button"
                onClick={handlePasswordSubmit}
                style={{
                  padding: "10px 18px",
                  background: accent,
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Unlock
              </button>
            </div>
            {passwordError && (
              <p className="animate-fade-in" style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: 8, fontWeight: 500 }}>
                Incorrect access code
              </p>
            )}
          </div>
        </div>
      )}

      {/* Live viewer count */}
      {!isPreview && viewerCount > 0 && (
        <div style={{
          position: "fixed",
          top: c.enablePromoBanner ? 40 : 12,
          right: 12,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 20,
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
          backdropFilter: "blur(8px)",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
            animation: "pulseDot 2s ease-out infinite",
          }} />
          {viewerCount} people viewing this right now
        </div>
      )}

      <div style={{
        ...ts.card,
        borderRadius: cardRadius,
        width: "100%",
        maxWidth: 440,
        padding: isPreview ? 24 : 36,
        position: "relative",
        zIndex: 1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        marginTop: !isPreview && c.enablePromoBanner ? 40 : 0,
      }}>
        {/* Logo */}
        {c.logo && (
          <div style={{
            textAlign: "center",
            marginBottom: 20,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.5s ease 0.1s",
          }}>
            <img src={c.logo} alt="Logo" style={{ maxHeight: 48, maxWidth: 160, objectFit: "contain" }} />
          </div>
        )}

        {/* Product Images */}
        {c.productImages && c.productImages.length > 0 && (
          <div style={{
            marginBottom: 20,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.5s ease 0.15s",
          }}>
            <div style={{
              borderRadius: template === "brutalist" ? 2 : 12,
              overflow: "hidden",
              aspectRatio: "16/10",
              background: isDark ? "rgba(255,255,255,0.05)" : "#f8f8f8",
              position: "relative",
            }}>
              <img
                key={imageIndex}
                src={c.productImages[imageIndex]}
                alt="Product"
                onLoad={() => setImgLoaded(true)}
                className="animate-img-slide-in"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {c.productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setImageIndex((imageIndex - 1 + c.productImages.length) % c.productImages.length)}
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.7,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = "1"}
                    onMouseLeave={(e) => e.target.style.opacity = "0.7"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageIndex((imageIndex + 1) % c.productImages.length)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.7,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = "1"}
                    onMouseLeave={(e) => e.target.style.opacity = "0.7"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                  <div style={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 4,
                  }}>
                    {c.productImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        style={{
                          width: i === imageIndex ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          border: "none",
                          background: i === imageIndex ? "white" : "rgba(255,255,255,0.5)",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Urgency: Countdown */}
        {c.enableCountdown && c.countdownDate && (
          <div style={{
            marginBottom: 20,
            padding: 16,
            borderRadius: template === "brutalist" ? 2 : 12,
            background: isDark ? "rgba(239,68,68,0.1)" : "#fef2f2",
            border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "#fecaca"}`,
            textAlign: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.5s ease 0.2s",
          }}>
            <p style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: 8,
              color: isDark ? "#fca5a5" : "#dc2626",
              margin: "0 0 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Limited Time Offer
            </p>
            <CountdownDisplay date={c.countdownDate} />
          </div>
        )}

        {/* Product Info */}
        <h1 style={{
          fontSize: isPreview ? "1.3rem" : "1.6rem",
          fontWeight: template === "brutalist" ? 900 : 700,
          margin: "0 0 8px",
          letterSpacing: template === "brutalist" ? "-0.03em" : "-0.02em",
          lineHeight: 1.3,
          textTransform: template === "brutalist" ? "uppercase" : "none",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.5s ease 0.2s",
        }}>
          {c.productName || "Product Name"}
        </h1>

        {c.productDescription && (
          <p style={{
            fontSize: "0.9rem",
            opacity: mounted ? 0.7 : 0,
            margin: "0 0 20px",
            lineHeight: 1.6,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.5s ease 0.25s",
          }}>
            {c.productDescription}
          </p>
        )}

        {/* Price */}
        <div style={{
          marginBottom: 20,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.5s ease 0.3s",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: template === "brutalist" ? "inherit" : accent,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              {formatPrice(couponApplied ? discountedPrice : price, c.currency)}
            </span>
            {couponApplied && discount > 0 && (
              <span
                className="animate-fade-in"
                style={{
                  fontSize: "1.1rem",
                  textDecoration: "line-through",
                  opacity: 0.4,
                  fontWeight: 500,
                }}
              >
                {formatPrice(price, c.currency)}
              </span>
            )}
          </div>
          {couponApplied && discount > 0 && (
            <span
              className="animate-scale-in"
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#22c55e",
                background: "rgba(34,197,94,0.1)",
                padding: "3px 10px",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 6,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              {discount}% OFF applied
            </span>
          )}
        </div>

        {/* Stock Counter */}
        {c.enableStockCounter && c.stockCount > 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: c.stockCount <= 10 ? "#ef4444" : "#f59e0b",
            opacity: mounted ? 1 : 0,
            transition: "all 0.5s ease 0.35s",
          }}>
            <span className="pulse-dot" style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c.stockCount <= 10 ? "#ef4444" : "#f59e0b",
              display: "inline-block",
            }} />
            Only {c.stockCount} left in stock
          </div>
        )}

        {/* Guarantee Badge */}
        {c.enableGuaranteeBadge && c.guaranteeText && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: template === "brutalist" ? 2 : 10,
            background: isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.05)",
            border: `1px solid ${isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.12)"}`,
            marginBottom: 16,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: isDark ? "#86efac" : "#16a34a",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {c.guaranteeText}
          </div>
        )}

        {/* Quantity Selector */}
        {c.enableQuantity && (
          <div style={{
            marginBottom: 20,
            opacity: mounted ? 1 : 0,
            transition: "all 0.5s ease 0.35s",
          }}>
            <label style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: 6,
              opacity: 0.7,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Quantity
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`, borderRadius: template === "brutalist" ? 2 : 10, overflow: "hidden", width: "fit-content", transition: "border-color 0.2s" }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  background: "transparent",
                  color: "inherit",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                -
              </button>
              <span style={{
                width: 48,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
                borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
                padding: "8px 0",
                fontVariantNumeric: "tabular-nums",
                transition: "all 0.2s ease",
              }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(c.maxQuantity || 10, quantity + 1))}
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  background: "transparent",
                  color: "inherit",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Coupon Code */}
        {c.enableCoupon && !couponApplied && (
          <div style={{
            marginBottom: 20,
            opacity: mounted ? 1 : 0,
            transition: "all 0.5s ease 0.35s",
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Discount code"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                className={couponError ? "animate-shake" : ""}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: `1.5px solid ${couponError ? "#ef4444" : isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
                  borderRadius: template === "brutalist" ? 2 : 10,
                  background: isDark ? "rgba(255,255,255,0.05)" : "white",
                  color: "inherit",
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleApplyCoupon(); }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{
                  padding: "10px 18px",
                  border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
                  borderRadius: template === "brutalist" ? 2 : 10,
                  background: "transparent",
                  color: "inherit",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.target.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="animate-fade-in" style={{ fontSize: "0.75rem", color: "#ef4444", margin: "6px 0 0", fontWeight: 500 }}>
                Invalid coupon code
              </p>
            )}
          </div>
        )}

        {/* Bump Offer */}
        {c.enableBumpOffer && c.bumpOfferName && (
          <div style={{
            marginBottom: 20,
            padding: 14,
            borderRadius: template === "brutalist" ? 2 : 10,
            border: `2px dashed ${isDark ? "rgba(255,255,255,0.15)" : "#d1d5db"}`,
            background: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => setBumpChecked(!bumpChecked)}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: `2px solid ${bumpChecked ? accent : isDark ? "rgba(255,255,255,0.2)" : "#d1d5db"}`,
                background: bumpChecked ? accent : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 2,
                transition: "all 0.2s ease",
              }}>
                {bumpChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  Add {c.bumpOfferName} — {formatPrice(bumpPrice, c.currency)}
                </div>
                {c.bumpOfferDescription && (
                  <div style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: 2 }}>
                    {c.bumpOfferDescription}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        {(c.enableQuantity && quantity > 1) || bumpChecked ? (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
              marginBottom: 20,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ opacity: 0.7 }}>
              Total{c.enableQuantity && quantity > 1 ? ` (${quantity} items)` : ""}
              {bumpChecked ? " + bump" : ""}
            </span>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", fontVariantNumeric: "tabular-nums" }}>{formatPrice(total, c.currency)}</span>
          </div>
        ) : null}

        {/* Pay Button */}
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing || !c.productName}
          className="glow-btn"
          style={{
            width: "100%",
            padding: "14px 24px",
            background: isProcessing ? accent + "cc" : accent,
            color: template === "brutalist" ? "#fff" : "white",
            border: template === "brutalist" ? "3px solid #000" : "none",
            borderRadius: template === "brutalist" ? 2 : btnRadius,
            fontSize: "1rem",
            fontWeight: template === "brutalist" ? 900 : 700,
            textTransform: template === "brutalist" ? "uppercase" : "none",
            cursor: isProcessing ? "wait" : "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: template === "brutalist" ? "0.05em" : "-0.01em",
            "--shadow-glow-color": `${accent}55`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: mounted ? "0.4s" : "0s",
            boxShadow: template === "neon" ? `0 0 20px ${accent}44, 0 4px 12px rgba(0,0,0,0.3)` : undefined,
          }}
        >
          {isProcessing ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Processing...
            </span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay {formatPrice(bumpChecked ? total : (c.enableQuantity ? total : (couponApplied ? discountedPrice : price)), c.currency)}
            </>
          )}
        </button>

        {/* Social Proof */}
        {c.enableSocialProof && c.socialProofCount > 0 && (
          <div style={{
            textAlign: "center",
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: "0.8rem",
            opacity: 0.6,
          }}>
            <div style={{ display: "flex" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, hsl(${i * 90 + 200}, 70%, 60%), hsl(${i * 90 + 230}, 70%, 50%))`,
                  border: `2px solid ${isDark ? "#1e293b" : "white"}`,
                  marginLeft: i > 0 ? -6 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.5rem",
                  color: "white",
                  fontWeight: 700,
                }} />
              ))}
            </div>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {c.socialProofCount.toLocaleString()} people purchased this
            </span>
          </div>
        )}

        {/* Testimonials */}
        {c.enableTestimonials && c.testimonials && c.testimonials.length > 0 && (
          <div style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
          }}>
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, opacity: 0.5, marginBottom: 12, margin: "0 0 12px" }}>
              What customers say
            </p>
            {c.testimonials.map((t, i) => (
              <div key={i} style={{
                padding: 14,
                background: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                borderRadius: template === "brutalist" ? 2 : 10,
                marginBottom: i < c.testimonials.length - 1 ? 8 : 0,
                transition: "all 0.2s ease",
              }}>
                <StarRating rating={t.rating || 5} />
                <p style={{ fontSize: "0.85rem", margin: "6px 0", lineHeight: 1.5, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.6, margin: 0 }}>
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Security badges */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0"}`,
          opacity: 0.4,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Secure
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SSL Encrypted
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem" }}>
            Powered by Stripe
          </div>
        </div>

        {/* PayGate branding */}
        {c.enableBranding !== false && (
          <div style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: "0.7rem",
            opacity: 0.3,
          }}>
            Built with PayGate
          </div>
        )}

        {/* Custom CSS */}
        {c.customCSS && (
          <style dangerouslySetInnerHTML={{ __html: c.customCSS }} />
        )}
      </div>

      {/* Exit Intent Popup */}
      {showExitIntent && c.enableExitIntent && (
        <div
          className="animate-modal-backdrop"
          onClick={() => setShowExitIntent(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            className="animate-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 20,
              padding: 36,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>&#9888;&#65039;</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 8px", color: "#1a1a1a" }}>
              {c.exitIntentHeadline || "Wait! Don't miss out!"}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#666", margin: "0 0 20px", lineHeight: 1.6 }}>
              Get <strong style={{ color: accent }}>{c.exitIntentDiscount || 10}% off</strong> your order if you complete your purchase now!
            </p>
            <button
              type="button"
              onClick={() => setShowExitIntent(false)}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: accent,
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              Claim My {c.exitIntentDiscount || 10}% Discount
            </button>
            <button
              type="button"
              onClick={() => setShowExitIntent(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                fontSize: "0.82rem",
                fontFamily: "inherit",
              }}
            >
              No thanks, I&apos;ll pay full price
            </button>
          </div>
        </div>
      )}

      {/* Recent Purchase Toast */}
      {purchaseToast && !isPreview && (
        <div
          className="animate-toast-in"
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 12,
            background: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e5e7eb",
            maxWidth: 280,
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a1a" }}>
              {purchaseToast.name} just purchased
            </div>
            <div style={{ fontSize: "0.72rem", color: "#999" }}>
              {purchaseToast.mins} minute{purchaseToast.mins !== 1 ? "s" : ""} ago
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
