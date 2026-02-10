import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const body = await request.json();
    const { pageId, productName, price, currency, quantity, successUrl, cancelUrl } = body;

    const stripe = getStripe();

    if (!stripe) {
      // Stub response when Stripe is not configured
      return NextResponse.json({
        stubbed: true,
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local to enable real payments.",
        checkoutUrl: successUrl || "/success",
      });
    }

    // Create real Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: (currency || "usd").toLowerCase(),
            product_data: {
              name: productName || "Product",
            },
            unit_amount: Math.round((parseFloat(price) || 0) * 100),
          },
          quantity: quantity || 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${pageId}`,
      metadata: {
        pageId: pageId || "",
        productName: productName || "Product",
        platformFeePercent: "3",
      },
    });

    return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
