"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CheckoutPreview from "@/components/CheckoutPreview";
import LoadingScreen from "@/components/LoadingScreen";
import { getPage, incrementViews, incrementConversions } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CheckoutPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  // Handle successful payment return
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setPaymentSuccess(true);
      incrementConversions(id);
    }
  }, [searchParams, id]);

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

  // Payment success screen
  if (paymentSuccess && config) {
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
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(34,197,94,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Payment Successful!</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: 400, margin: 0 }}>
          {config.customThankYou || "Thank you for your purchase! You will receive a confirmation email shortly."}
        </p>
        {config.successRedirectUrl && (
          <a
            href={config.successRedirectUrl}
            className="btn-primary"
            style={{ marginTop: 8, padding: "12px 28px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        )}
      </div>
    );
  }

  async function handlePay({ quantity, unitPrice, couponDiscount, exitDiscount, bumpChecked, bumpName, bumpPrice }) {
    try {
      const baseUrl = window.location.origin;
      const totalDiscount = Math.min((couponDiscount || 0) + (exitDiscount || 0), 100);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: id,
          productName: config.productName,
          price: parseFloat(config.price) || 0,
          currency: config.currency,
          quantity,
          successUrl: `${baseUrl}/checkout/${id}?success=true`,
          cancelUrl: `${baseUrl}/checkout/${id}`,
          bumpName: bumpChecked ? bumpName : undefined,
          bumpPrice: bumpChecked ? bumpPrice : undefined,
          couponDiscount: totalDiscount > 0 ? totalDiscount : undefined,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Payment error: " + data.error);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      alert("Failed to start checkout. Please try again.");
    }
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
