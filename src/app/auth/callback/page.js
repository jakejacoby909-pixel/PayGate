"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      router.replace("/login");
      return;
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      router.replace("/login");
      return;
    }

    // The Supabase client (detectSessionInUrl: true) automatically picks up
    // tokens from the URL hash fragment and stores them in localStorage.
    // We just listen for the auth state change and redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    // Check if session was already processed during client init
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    // Fallback timeout — if nothing happens after 5s, send to login
    const timeout = setTimeout(() => {
      router.replace("/login?error=auth");
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

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
