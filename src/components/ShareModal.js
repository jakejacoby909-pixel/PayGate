"use client";
import { useState } from "react";
import { generateQRDataUrl } from "@/lib/utils";

const TABS = [
  { id: "link", label: "Link", pro: false },
  { id: "qr", label: "QR", pro: true },
  { id: "social", label: "Social", pro: true },
  { id: "embed", label: "Embed", pro: true },
  { id: "buybutton", label: "Buy Button", pro: true },
  { id: "email", label: "Email", pro: true },
];

export default function ShareModal({ url, onClose, plan = "free" }) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [btnCopied, setBtnCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const isPro = plan === "pro";

  function copyUrl() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const embedCode = `<iframe src="${url}" width="100%" height="700" style="border:none;border-radius:12px;max-width:500px;" allow="payment"></iframe>`;

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode).then(() => {
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    });
  }

  const buyButtonCode = `<!-- PayGate Buy Button -->
<a href="${url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:#16a34a;color:white;font-family:system-ui,sans-serif;font-size:16px;font-weight:600;border-radius:9999px;text-decoration:none;box-shadow:0 2px 8px rgba(22,163,74,0.3);transition:transform 0.15s,box-shadow 0.15s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 16px rgba(22,163,74,0.4)'" onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(22,163,74,0.3)'">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
  Buy Now
</a>`;

  function copyBuyButton() {
    navigator.clipboard.writeText(buyButtonCode).then(() => {
      setBtnCopied(true);
      setTimeout(() => setBtnCopied(false), 2000);
    });
  }

  const emailHtml = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto;max-width:480px;width:100%;">
  <tr>
    <td style="padding:32px 24px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;font-family:system-ui,-apple-system,sans-serif;">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your product is ready</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">Click below to complete your purchase securely via Stripe.</p>
      <a href="${url}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 32px;background:#16a34a;color:#ffffff;font-size:16px;font-weight:600;border-radius:9999px;text-decoration:none;">Complete Purchase &rarr;</a>
      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">Secure checkout powered by Stripe</p>
    </td>
  </tr>
</table>`;

  function copyEmail() {
    navigator.clipboard.writeText(emailHtml).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }

  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent("Check this out!");

  function ProGate({ feature }) {
    return (
      <div style={{
        textAlign: "center",
        padding: "32px 20px",
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(139,92,246,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, margin: "0 0 4px" }}>{feature}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0 0 16px" }}>
          Upgrade to Pro to unlock this sharing method
        </p>
        <a
          href="/pricing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 20px",
            borderRadius: 9999,
            background: "#8b5cf6",
            color: "white",
            fontSize: "0.82rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
        >
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return (
    <div
      className="animate-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
        padding: 20,
      }}
    >
      <div
        className="animate-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: 20,
          padding: 32,
          maxWidth: 520,
          width: "100%",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Share Your Page</h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "var(--surface-hover)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted)",
              transition: "all 0.15s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 2,
          background: "var(--background)",
          borderRadius: 10,
          padding: 3,
          marginBottom: 24,
          flexWrap: "wrap",
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: activeTab === tab.id ? "var(--surface)" : "transparent",
                color: activeTab === tab.id ? "var(--foreground)" : "var(--muted)",
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                minWidth: 0,
              }}
            >
              {tab.label}
              {tab.pro && !isPro && (
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#8b5cf6", background: "rgba(139,92,246,0.1)", padding: "1px 4px", borderRadius: 3 }}>PRO</span>
              )}
            </button>
          ))}
        </div>

        {/* Link Tab */}
        {activeTab === "link" && (
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Checkout URL
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                readOnly
                value={url}
                className="input-base"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
              />
              <button
                onClick={copyUrl}
                className="btn-primary"
                style={{
                  padding: "10px 20px",
                  whiteSpace: "nowrap",
                  fontSize: "0.85rem",
                  background: copied ? "var(--success)" : undefined,
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* QR Tab */}
        {activeTab === "qr" && (
          isPro ? (
            <div style={{ textAlign: "center", padding: 20, background: "white", borderRadius: 12, border: "1px solid var(--border)" }}>
              <img
                src={generateQRDataUrl(url)}
                alt="QR Code"
                style={{ width: 160, height: 160, imageRendering: "pixelated" }}
              />
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 8, marginBottom: 0 }}>
                Scan to open checkout page
              </p>
            </div>
          ) : <ProGate feature="QR Code Sharing" />
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          isPro ? (
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", background: "#1da1f2", color: "white", borderRadius: 10, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Post
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", background: "#1877f2", color: "white", borderRadius: 10, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                Share
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", background: "#0a66c2", color: "white", borderRadius: 10, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Post
              </a>
            </div>
          ) : <ProGate feature="Social Media Sharing" />
        )}

        {/* Embed Tab */}
        {activeTab === "embed" && (
          isPro ? (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Embed Code
              </label>
              <textarea readOnly value={embedCode} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-mono)", fontSize: "0.78rem", resize: "none", outline: "none", lineHeight: 1.5 }} rows={4} />
              <button onClick={copyEmbed} className="btn-primary" style={{ width: "100%", padding: "10px 20px", fontSize: "0.85rem", marginTop: 10, background: embedCopied ? "var(--success)" : undefined }}>
                {embedCopied ? "Copied!" : "Copy Embed Code"}
              </button>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5, marginBottom: 0 }}>
                Paste this code into your website&apos;s HTML to embed the checkout page.
              </p>
            </div>
          ) : <ProGate feature="Website Embedding" />
        )}

        {/* Buy Button Tab */}
        {activeTab === "buybutton" && (
          isPro ? (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Buy Button HTML
              </label>
              <div style={{ padding: 16, background: "var(--background)", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 12, textAlign: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#16a34a", color: "white", fontWeight: 600, borderRadius: 9999, fontSize: "0.9rem", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
                  Buy Now
                </span>
                <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 8, marginBottom: 0 }}>Preview of your buy button</p>
              </div>
              <textarea readOnly value={buyButtonCode} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", resize: "none", outline: "none", lineHeight: 1.5 }} rows={5} />
              <button onClick={copyBuyButton} className="btn-primary" style={{ width: "100%", padding: "10px 20px", fontSize: "0.85rem", marginTop: 10, background: btnCopied ? "var(--success)" : undefined }}>
                {btnCopied ? "Copied!" : "Copy Buy Button"}
              </button>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5, marginBottom: 0 }}>
                Paste this HTML anywhere on your website to add a buy button that links to your checkout page.
              </p>
            </div>
          ) : <ProGate feature="Embeddable Buy Button" />
        )}

        {/* Email Tab */}
        {activeTab === "email" && (
          isPro ? (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Payment Link
              </label>
              <div style={{ padding: 16, background: "#ffffff", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 12 }}>
                <div style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px", background: "#ffffff", borderRadius: 12, border: "1px solid #e5e7eb", fontFamily: "system-ui, sans-serif" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>Your product is ready</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.5 }}>Click below to complete your purchase securely via Stripe.</p>
                  <span style={{ display: "inline-block", padding: "10px 24px", background: "#16a34a", color: "#ffffff", fontSize: "0.85rem", fontWeight: 600, borderRadius: 9999 }}>Complete Purchase &rarr;</span>
                  <p style={{ margin: "16px 0 0", fontSize: "0.7rem", color: "#9ca3af" }}>Secure checkout powered by Stripe</p>
                </div>
              </div>
              <textarea readOnly value={emailHtml} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", resize: "none", outline: "none", lineHeight: 1.4 }} rows={6} />
              <button onClick={copyEmail} className="btn-primary" style={{ width: "100%", padding: "10px 20px", fontSize: "0.85rem", marginTop: 10, background: emailCopied ? "var(--success)" : undefined }}>
                {emailCopied ? "Copied!" : "Copy Email HTML"}
              </button>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5, marginBottom: 0 }}>
                Paste this HTML into your email marketing tool (Mailchimp, ConvertKit, etc.) to create a branded payment link in your emails.
              </p>
            </div>
          ) : <ProGate feature="Email Payment Links" />
        )}
      </div>
    </div>
  );
}
