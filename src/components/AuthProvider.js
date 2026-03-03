"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "jakejacoby909@gmail.com";

const AuthContext = createContext({
  user: null,
  loading: true,
  configured: false,
  plan: "free",
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
  isAdmin: () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function isAdmin(user) {
  return user?.email === ADMIN_EMAIL;
}

// Protected routes that require login
const PROTECTED_ROUTES = ["/dashboard", "/builder", "/admin"];

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const configured = isSupabaseConfigured();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session from localStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        if (u.email === ADMIN_EMAIL) {
          setPlan("pro");
        } else {
          fetchPlan(u.id);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((eventType, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        if (u.email === ADMIN_EMAIL) {
          setPlan("pro");
        } else {
          fetchPlan(u.id);
        }
        // On new signup, save referral if one was captured
        if (eventType === "SIGNED_IN") {
          saveReferral(u.id);
        }
      } else {
        setPlan("free");
      }
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  // Client-side route protection
  useEffect(() => {
    if (loading) return;
    if (!user && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [user, loading, pathname, router]);

  async function saveReferral(userId) {
    try {
      const ref = localStorage.getItem("paygate_ref");
      if (!ref) return;
      await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, referralCode: ref }),
      });
      localStorage.removeItem("paygate_ref");
    } catch {
      // Referral save is best-effort
    }
  }

  async function fetchPlan(userId) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", userId)
        .single();
      if (data?.plan) {
        setPlan(data.plan);
      }
    } catch {
      // Profile may not have plan column yet
    }
  }

  async function signInWithGoogle() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function signInWithEmail(email, password) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signUpWithEmail(email, password) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return supabase.auth.signUp({ email, password });
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setPlan("free");
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      configured,
      plan,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut: handleSignOut,
      isAdmin: () => isAdmin(user),
    }}>
      {children}
    </AuthContext.Provider>
  );
}
