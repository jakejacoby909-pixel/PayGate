"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";

function AuthComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/login");
      return;
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      router.replace("/login");
      return;
    }

    // Exchange the OAuth code for a session — this stores it in localStorage
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error("Auth error:", error.message);
        router.replace("/login?error=auth");
      } else {
        router.replace("/dashboard");
      }
    });
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ width: 32, height: 32, margin: "0 auto 16px" }} />
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    }>
      <AuthComplete />
    </Suspense>
  );
}
