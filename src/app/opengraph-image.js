import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PayGate — Create Checkout Pages in Seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a0f0a, #0d1117, #0a0f0a)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient circles */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.25), transparent 70%)",
            top: -200,
            right: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)",
            bottom: -100,
            left: -50,
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #16a34a, #065f46)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "white",
              fontWeight: 800,
            }}
          >
            $
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            PayGate
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Create beautiful checkout pages
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          powered by Stripe in seconds
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["8 Templates", "Analytics", "No Code", "Free to Start"].map(
            (text) => (
              <div
                key={text}
                style={{
                  padding: "10px 24px",
                  borderRadius: 9999,
                  background: "rgba(22,163,74,0.15)",
                  border: "1px solid rgba(22,163,74,0.3)",
                  color: "#4ade80",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {text}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 20,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
          }}
        >
          pay-gate.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
