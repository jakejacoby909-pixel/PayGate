"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Confetti from "@/components/Confetti";
import MoneyRain from "@/components/MoneyRain";

function SuccessContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Thank you for your purchase! We'll send you a confirmation email shortly.";
  const amount = searchParams.get("amount");
  const product = searchParams.get("product");
  const [showConfetti, setShowConfetti] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 600),
      setTimeout(() => setStep(3), 1000),
      setTimeout(() => setStep(4), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(34,197,94,0.08), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Confetti + Money Rain */}
      {showConfetti && <Confetti duration={3500} />}
      {showConfetti && <MoneyRain duration={4000} />}

      <div style={{
        textAlign: "center",
        maxWidth: 480,
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Animated checkmark with circle draw */}
        <div
          style={{
            width: 88,
            height: 88,
            margin: "0 auto 28px",
            position: "relative",
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? "scale(1)" : "scale(0.5)",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Pulsing ring */}
          <div
            className="animate-success-pulse"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #10b981)",
            }}
          />
          {/* Main circle */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #10b981)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(34,197,94,0.3)",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline
                points="20 6 9 17 4 12"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: step >= 1 ? 0 : 30,
                  transition: "stroke-dashoffset 0.6s ease-out 0.3s",
                }}
              />
            </svg>
          </div>
          {/* Sparkle decorations */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ["#22c55e", "#f59e0b", "#3b82f6", "#ec4899"][i],
                top: ["0%", "20%", "80%", "60%"][i],
                left: ["-10%", "105%", "105%", "-10%"][i],
                opacity: step >= 2 ? 1 : 0,
                transform: step >= 2 ? "scale(1)" : "scale(0)",
                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${200 + i * 100}ms`,
              }}
            />
          ))}
        </div>

        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            margin: "0 0 12px",
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Payment Successful!
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            margin: "0 0 28px",
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          {message}
        </p>

        {/* Receipt-style summary card */}
        {(amount || product) && (
          <div
            className="animate-receipt-slide"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 28,
              textAlign: "left",
              boxShadow: "var(--shadow-md)",
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              paddingBottom: 12,
              borderBottom: "1px dashed var(--border)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Order Receipt
              </span>
            </div>
            {product && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Product</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{product}</span>
              </div>
            )}
            {amount && (
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Total Paid</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--success)" }}>{amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Link
            href="/"
            className="btn-primary ripple-btn"
            style={{
              padding: "12px 28px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/builder"
            className="btn-secondary"
            style={{
              padding: "12px 28px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Another Page
          </Link>
        </div>

        {/* Referral CTA */}
        <div
          style={{
            marginTop: 28,
            padding: "18px 22px",
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(34,197,94,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 2px" }}>Know other creators?</p>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
              Earn 10% commission on every sale they make through PayGate.
            </p>
          </div>
          <Link
            href="/dashboard?tab=referrals"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--primary)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Start Earning &rarr;
          </Link>
        </div>

        {/* Security note */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: step >= 4 ? 0.4 : 0,
            transition: "opacity 0.5s ease 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secured by Stripe
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            256-bit Encryption
          </div>
        </div>

        {/* PayGate branding */}
        <p
          style={{
            marginTop: 16,
            fontSize: "0.72rem",
            color: "var(--muted-light)",
            opacity: step >= 4 ? 0.5 : 0,
            transition: "opacity 0.5s ease 0.5s",
          }}
        >
          Powered by PayGate
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <div className="spinner" style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
