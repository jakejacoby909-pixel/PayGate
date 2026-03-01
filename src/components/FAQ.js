"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Is PayGate really free to use?",
    a: "Yes. The free plan lets you create checkout pages with all features included — templates, analytics, countdown timers, and more. The only cost is a 5% platform fee on transactions. Upgrade to Pro ($12/mo) to reduce that to 2%.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not at all. PayGate is a no-code checkout page builder. Pick a template, enter your product details and price, customize colors and fonts, and you're live. The whole process takes under 60 seconds.",
  },
  {
    q: "What payment methods are supported?",
    a: "PayGate is powered by Stripe, so it supports credit cards, debit cards, Apple Pay, Google Pay, and 135+ currencies. Your customers get a secure, familiar checkout experience.",
  },
  {
    q: "Can I customize the look of my checkout page?",
    a: "Absolutely. Choose from 8 professionally designed templates, then customize colors, fonts, button styles, backgrounds, and upload your logo. You can also add product images, countdown timers, stock counters, and coupon codes.",
  },
  {
    q: "How do I get paid?",
    a: "Payments go directly to your Stripe account. Connect your Stripe account during setup and you'll receive payouts on Stripe's standard schedule — typically 2 business days.",
  },
  {
    q: "Can I share my checkout page?",
    a: "Yes — every page gets a unique URL you can share anywhere. You also get a QR code, embed code for your website, and direct social sharing buttons. Your page works on all devices.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              borderBottom: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "20px 0",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <span style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: isOpen ? "var(--foreground)" : "rgba(255,255,255,0.7)",
                transition: "color 0.2s",
                lineHeight: 1.4,
              }}>
                {faq.q}
              </span>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: isOpen ? "var(--primary-light)" : "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isOpen ? "var(--primary)" : "rgba(255,255,255,0.3)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: "transform 0.3s ease, stroke 0.3s ease",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </button>
            <div style={{
              overflow: "hidden",
              maxHeight: isOpen ? 200 : 0,
              opacity: isOpen ? 1 : 0,
              transition: "max-height 0.3s ease, opacity 0.25s ease",
            }}>
              <p style={{
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                margin: 0,
                paddingBottom: 20,
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
