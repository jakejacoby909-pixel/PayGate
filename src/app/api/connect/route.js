import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";

async function getAuthUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request) {
  const { success } = rateLimit(request, { limit: 5, windowMs: 60 * 1000 });
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email;
    const supabase = getSupabaseAdmin();

    // Check if user already has a connect account
    let connectAccountId = null;
    if (supabase) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_connect_id")
        .eq("id", userId)
        .single();

      connectAccountId = profile?.stripe_connect_id;
    }

    // Create a new Stripe Connect account if needed
    if (!connectAccountId) {
      const account = await stripe.accounts.create({
        type: "standard",
        email: userEmail,
        metadata: { userId },
      });
      connectAccountId = account.id;

      // Save connect ID to profile
      if (supabase) {
        await supabase
          .from("profiles")
          .update({ stripe_connect_id: connectAccountId })
          .eq("id", userId);
      }
    }

    // Create an account link for onboarding
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: connectAccountId,
      refresh_url: `${baseUrl}/dashboard?connect=refresh`,
      return_url: `${baseUrl}/api/connect/callback?account_id=${connectAccountId}&user_id=${userId}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Connect onboarding error:", error);

    // Specific error when Stripe Connect isn't enabled on the platform account
    if (error.message?.includes("signed up for Connect")) {
      return NextResponse.json(
        {
          error: "Stripe Connect is not enabled on this platform. The site owner needs to enable Connect at https://dashboard.stripe.com/settings/connect",
          connectNotEnabled: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create connect account" },
      { status: 500 }
    );
  }
}
