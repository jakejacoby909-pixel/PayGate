import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const amount = session.amount_total || 0;
    const platformFee = Math.round(amount * 0.05);
    const customerEmail = session.customer_details?.email || session.customer_email || "";
    const pageId = session.metadata?.pageId || "";
    const productName = session.metadata?.productName || "";
    const currency = session.currency || "usd";

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from("transactions").insert({
          stripe_session_id: session.id,
          customer_email: customerEmail,
          product_name: productName,
          page_id: pageId,
          amount: amount,
          platform_fee: platformFee,
          currency: currency,
          status: "completed",
        });
      } catch (err) {
        console.error("Failed to insert transaction:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
