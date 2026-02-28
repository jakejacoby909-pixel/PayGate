import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase admin client not configured — missing SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Handle Pro subscription checkout
      if (session.mode === "subscription") {
        const userId = session.metadata?.userId;
        if (userId) {
          const { error } = await supabase
            .from("profiles")
            .upsert(
              {
                id: userId,
                plan: "pro",
                stripe_customer_id: session.customer,
              },
              { onConflict: "id" }
            );
          if (error) {
            console.error("Failed to upgrade user to pro:", error);
            return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
          }
        }
        return NextResponse.json({ received: true });
      }

      // Handle product payment checkout
      const amount = session.amount_total || 0;
      const pageId = session.metadata?.pageId || "";
      const productName = session.metadata?.productName || "";
      const customerEmail = session.customer_details?.email || session.customer_email || "";
      const currency = session.currency || "usd";

      // Idempotency: check if transaction already recorded
      const { data: existing } = await supabase
        .from("transactions")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Look up page owner's plan for correct fee rate
      let feePercent = 0.05; // default 5% for free plan
      let pageOwnerId = null;
      if (pageId) {
        const { data: pageData, error: pageError } = await supabase
          .from("pages")
          .select("user_id")
          .eq("id", pageId)
          .single();

        if (pageError) {
          console.error("Failed to look up page:", pageError);
        }

        if (pageData?.user_id) {
          pageOwnerId = pageData.user_id;
          const { data: profile } = await supabase
            .from("profiles")
            .select("plan")
            .eq("id", pageData.user_id)
            .single();

          if (profile?.plan === "pro") {
            feePercent = 0.02; // 2% for pro
          }
        }
      }

      const platformFee = Math.round(amount * feePercent);

      const { error: insertError } = await supabase.from("transactions").insert({
        stripe_session_id: session.id,
        customer_email: customerEmail,
        product_name: productName,
        page_id: pageId,
        amount: amount,
        platform_fee: platformFee,
        currency: currency,
        status: "completed",
      });

      if (insertError) {
        console.error("Failed to insert transaction:", insertError);
        return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
      }
    }

    // Handle subscription cancellation — downgrade to free
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const { error } = await supabase
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", userId);

        if (error) {
          console.error("Failed to downgrade user:", error);
          return NextResponse.json({ error: "Failed to downgrade user" }, { status: 500 });
        }
      }
    }

    // Handle Stripe Connect account updates
    if (event.type === "account.updated") {
      const account = event.data.object;
      if (account.charges_enabled && account.details_submitted) {
        const { error } = await supabase
          .from("profiles")
          .update({ connect_onboarding_complete: true })
          .eq("stripe_connect_id", account.id);

        if (error) {
          console.error("Failed to update connect status:", error);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
