"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useAuth } from "@/components/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, configured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!configured) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        padding: 24,
      }}>
        <div style={{
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
              <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>PayGate</h1>
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.15)",
            marginBottom: 24,
            fontSize: "0.85rem",
            color: "var(--foreground)",
            lineHeight: 1.6,
          }}>
            Supabase is not configured. Add <code style={{ fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_URL</code> and <code style={{ fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code style={{ fontFamily: "var(--font-mono)", background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: 4 }}>.env.local</code> to enable authentication.
          </div>
          <Link
            href="/builder"
            className="btn-primary ripple-btn"
            style={{ padding: "12px 28px", fontSize: "0.95rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Continue to Builder
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error.message);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background)",
      padding: 24,
    }}>
      <div className="animate-fade-in-up" style={{
        maxWidth: 420,
        width: "100%",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
              <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 4px" }}>
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
            {isSignUp ? "Start building checkout pages" : "Sign in to your PayGate account"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          padding: 28,
          borderRadius: 16,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}>
          {/* Toggle */}
          <div style={{
            display: "flex",
            background: "var(--background)",
            borderRadius: 10,
            padding: 3,
            marginBottom: 24,
          }}>
            {["Sign In", "Sign Up"].map((label) => {
              const active = label === "Sign In" ? !isSignUp : isSignUp;
              return (
                <button
                  key={label}
                  onClick={() => { setIsSignUp(label === "Sign Up"); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: active ? "var(--surface)" : "transparent",
                    color: active ? "var(--foreground)" : "var(--muted)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    boxShadow: active ? "var(--shadow-sm)" : "none",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              padding: "12px 20px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.78rem", color: "var(--muted-light)", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 4, color: "var(--foreground)" }}>
                Email
              </label>
              <input
                type="email"
                required
                className="input-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 4, color: "var(--foreground)" }}>
                Password
              </label>
              <input
                type="password"
                required
                className="input-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            {error && (
              <div className="animate-fade-in" style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                fontSize: "0.82rem",
                color: "#ef4444",
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16 }} /> {isSignUp ? "Creating account..." : "Signing in..."}</>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link
            href="/"
            style={{
              fontSize: "0.85rem",
              color: "var(--muted)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.15s",
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
