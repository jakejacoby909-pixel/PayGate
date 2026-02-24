import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      pageId,
      productName,
      price,
      currency,
      quantity,
      successUrl,
      cancelUrl,
      bumpName,
      bumpPrice,
      couponDiscount,
    } = body;

    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json({
        stubbed: true,
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local to enable real payments.",
        checkoutUrl: successUrl || "/success",
      });
    }

    // Build line items
    const lineItems = [
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
    ];

    // Add bump offer as second line item
    if (bumpName && bumpPrice && parseFloat(bumpPrice) > 0) {
      lineItems.push({
        price_data: {
          currency: (currency || "usd").toLowerCase(),
          product_data: {
            name: bumpName,
          },
          unit_amount: Math.round(parseFloat(bumpPrice) * 100),
        },
        quantity: 1,
      });
    }

    // Build discounts if coupon applied
    const discounts = [];
    if (couponDiscount && parseInt(couponDiscount) > 0) {
      const pctOff = Math.min(parseInt(couponDiscount), 100);
      const couponId = `paygate_${pctOff}pct_off`;
      let coupon;
      try {
        coupon = await stripe.coupons.retrieve(couponId);
      } catch {
        coupon = await stripe.coupons.create({
          id: couponId,
          percent_off: pctOff,
          duration: "once",
        });
      }
      discounts.push({ coupon: coupon.id });
    }

    const sessionParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${pageId}`,
      metadata: {
        pageId: pageId || "",
        productName: productName || "Product",
        platformFeePercent: "5",
        hasBump: bumpName ? "true" : "false",
      },
    };

    if (discounts.length > 0) {
      sessionParams.discounts = discounts;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
