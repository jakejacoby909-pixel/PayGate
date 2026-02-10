"use client";
import { useState } from "react";
import { generateQRDataUrl } from "@/lib/utils";

const TABS = [
  { id: "link", label: "Link" },
  { id: "qr", label: "QR" },
  { id: "social", label: "Social" },
  { id: "embed", label: "Embed" },
];

export default function ShareModal({ url, onClose }) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("link");

  function copyUrl() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const embedCode = `<iframe src="${url}" width="100%" height="700" frameborder="0" style="border:none;border-radius:12px;max-width:500px;" allow="payment"></iframe>`;

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode).then(() => {
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    });
  }

  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent("Check this out!");

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
          maxWidth: 480,
          width: "100%",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border)",
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
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: activeTab === tab.id ? "var(--surface)" : "transparent",
                color: activeTab === tab.id ? "var(--foreground)" : "var(--muted)",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
              }}
            >
              {tab.label}
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
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                background: "#1da1f2",
                color: "white",
                borderRadius: 10,
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Post
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                background: "#1877f2",
                color: "white",
                borderRadius: 10,
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                background: "#0a66c2",
                color: "white",
                borderRadius: 10,
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Post
            </a>
          </div>
        )}

        {/* Embed Tab */}
        {activeTab === "embed" && (
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Embed Code
            </label>
            <textarea
              readOnly
              value={embedCode}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                resize: "none",
                outline: "none",
                lineHeight: 1.5,
              }}
              rows={4}
            />
            <button
              onClick={copyEmbed}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "10px 20px",
                fontSize: "0.85rem",
                marginTop: 10,
                background: embedCopied ? "var(--success)" : undefined,
              }}
            >
              {embedCopied ? "Copied!" : "Copy Embed Code"}
            </button>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5, marginBottom: 0 }}>
              Paste this code into your website&apos;s HTML to embed the checkout page. Works with any website builder that supports custom HTML.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
