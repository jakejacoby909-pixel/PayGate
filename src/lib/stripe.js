import Stripe from "stripe";

let stripe = null;

export function getStripe() {
  if (stripe) return stripe;

  const key = process.env.STRIPE_SECRET_KEY;

  if (!key || key === "sk_test_your-stripe-secret-key") {
    return null;
  }

  stripe = new Stripe(key);
  return stripe;
}

export function getPublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null;
}
