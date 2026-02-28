import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("account_id");
  const userId = searchParams.get("user_id");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!accountId || !userId) {
    return NextResponse.redirect(`${baseUrl}/dashboard?connect=error`);
  }

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.redirect(`${baseUrl}/dashboard?connect=error`);
    }

    // Check account status with Stripe
    const account = await stripe.accounts.retrieve(accountId);
    const isComplete = account.charges_enabled && account.details_submitted;

    // Update profile in Supabase
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase
        .from("profiles")
        .update({
          stripe_connect_id: accountId,
          connect_onboarding_complete: isComplete,
        })
        .eq("id", userId);
    }

    const status = isComplete ? "success" : "pending";
    return NextResponse.redirect(`${baseUrl}/dashboard?connect=${status}`);
  } catch (error) {
    console.error("Connect callback error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard?connect=error`);
  }
}
