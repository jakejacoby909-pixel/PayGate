"use client";
import { createContext, useContext, useState, useEffect } from "react";
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

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const configured = isSupabaseConfigured();

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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Admin always gets pro
        if (session.user.email === ADMIN_EMAIL) {
          setPlan("pro");
        } else {
          fetchPlan(session.user.id);
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        if (session.user.email === ADMIN_EMAIL) {
          setPlan("pro");
        } else {
          fetchPlan(session.user.id);
        }
      } else {
        setPlan("free");
      }
    });

    return () => subscription.unsubscribe();
  }, [configured]);

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
      // Profile may not have plan column yet — default to free
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
