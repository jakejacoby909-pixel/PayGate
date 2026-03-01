"use client";
import { useState } from "react";

export default function DemoVideo({ videoId }) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) return null;

  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "var(--shadow-xl), 0 0 80px rgba(22,163,74,0.06)",
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
        }}>
          Watch the demo
        </div>
      </div>

      {/* Video embed with click-to-load for performance */}
      {!loaded ? (
        <button
          onClick={() => setLoaded(true)}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            border: "none",
            cursor: "pointer",
            position: "relative",
            background: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg) center/cover no-repeat`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Dark overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            transition: "background 0.2s",
          }} />
          {/* Play button */}
          <div style={{
            position: "relative",
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(22,163,74,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(22,163,74,0.4)",
            transition: "transform 0.2s",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            border: "none",
            display: "block",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="PayGate Demo"
        />
      )}
    </div>
  );
}
