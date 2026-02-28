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
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    // Derive user from authenticated session instead of trusting request body
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Must be logged in to subscribe" },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || !["monthly", "annual"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'monthly' or 'annual'" },
        { status: 400 }
      );
    }

    // Look up existing Stripe customer by email, or create one
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
    }

    // Store stripe_customer_id in Supabase if available
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, stripe_customer_id: customer.id },
          { onConflict: "id" }
        );
      if (error) {
        console.error("Failed to store customer ID:", error);
      }
    }

    // Create Checkout Session in subscription mode
    const isAnnual = plan === "annual";
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `PayGate Pro (${isAnnual ? "Annual" : "Monthly"})`,
              description: isAnnual
                ? "Unlimited pages, 2% fees, all pro features — billed yearly"
                : "Unlimited pages, 2% fees, all pro features — billed monthly",
            },
            unit_amount: isAnnual ? 9900 : 1200,
            recurring: {
              interval: isAnnual ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { userId: user.id, plan: "pro" },
      },
      metadata: { userId: user.id, plan: "pro" },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/pricing`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}
