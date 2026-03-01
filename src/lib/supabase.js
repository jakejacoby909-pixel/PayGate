import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

let browserClient = null;
let adminClient = null;

export function getSupabaseBrowser() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your-supabase-url") {
    return null;
  }

  browserClient = createBrowserClient(url, key);
  return browserClient;
}

// Server-side client with anon key (for API routes with user context)
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your-supabase-url") {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Admin client with service role key (bypasses RLS — for webhooks)
export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && url !== "your-supabase-url");
}
