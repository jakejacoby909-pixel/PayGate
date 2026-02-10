"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CheckoutPreview from "@/components/CheckoutPreview";
import LoadingScreen from "@/components/LoadingScreen";
import { getPage, incrementViews } from "@/lib/storage";
import Link from "next/link";

export default function CheckoutPage() {
  const { id } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const page = getPage(id);
    if (page) {
      setConfig(page);
      incrementViews(id);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Loading checkout..." />;
  }

  if (notFound) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        padding: 32,
        textAlign: "center",
        background: "var(--background)",
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "var(--primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Page Not Found</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: 400, margin: 0 }}>
          This checkout page doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="btn-primary"
          style={{ marginTop: 8, padding: "12px 28px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go Home
        </Link>
      </div>
    );
  }

  function handlePay({ quantity, total, couponApplied }) {
    // Stripe integration stub
    alert(`Payment of ${total.toFixed(2)} ${config.currency} would be processed via Stripe.\n\nQuantity: ${quantity}\nCoupon: ${couponApplied ? "Applied" : "None"}\n\nConnect your Stripe keys to enable real payments.`);
  }

  return (
    <>
      {config.metaTitle && (
        <title>{config.metaTitle}</title>
      )}
      <CheckoutPreview config={config} isPreview={false} onPay={handlePay} />
    </>
  );
}
