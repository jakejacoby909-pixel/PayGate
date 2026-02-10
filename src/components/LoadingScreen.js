"use client";
import { useState, useEffect } from "react";

export default function LoadingScreen({ message = "Loading..." }) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15 + 5, 95));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => d.length >= 3 ? "" : d + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background)",
      zIndex: 10000,
    }}
    className="animate-fade-in"
    >
      {/* Background ambient glow */}
      <div style={{
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(22,163,74,0.08), transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Animated logo */}
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
        {/* Spinning outer ring */}
        <div style={{
          position: "absolute",
          inset: -4,
          borderRadius: 20,
          border: "2px solid transparent",
          borderTopColor: "var(--primary)",
          borderRightColor: "var(--secondary)",
          animation: "spin-slow 1.5s linear infinite",
          opacity: 0.4,
        }} />
        {/* Pulsing background */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          animation: "pulse-ring 2s ease-out infinite",
          opacity: 0.15,
        }} />
        {/* Main icon */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(22,163,74,0.25)",
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
            <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 200,
        height: 3,
        background: "var(--border)",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 16,
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          borderRadius: 2,
          width: `${progress}%`,
          transition: "width 0.3s ease-out",
        }} />
      </div>

      <p style={{
        fontSize: "0.88rem",
        color: "var(--muted)",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        minWidth: 100,
        textAlign: "center",
      }}>
        {message}{dots}
      </p>
    </div>
  );
}
