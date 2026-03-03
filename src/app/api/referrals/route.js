import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/referrals?userId=xxx — get referral stats for a user
export async function GET(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  // Get user's referral code
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .single();

  if (!profile?.referral_code) {
    return NextResponse.json({ error: "No referral code found" }, { status: 404 });
  }

  // Count referred users
  const { count: referredCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("referred_by", profile.referral_code);

  // Get commission totals
  const { data: commissions } = await supabase
    .from("referral_commissions")
    .select("commission, status")
    .eq("referrer_id", userId);

  const totalEarned = (commissions || [])
    .reduce((sum, c) => sum + (c.commission || 0), 0);

  const pendingEarned = (commissions || [])
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + (c.commission || 0), 0);

  return NextResponse.json({
    referralCode: profile.referral_code,
    referredUsers: referredCount || 0,
    totalEarned,
    pendingEarned,
    commissionCount: (commissions || []).length,
  });
}

// POST /api/referrals — save referral on signup
// Body: { userId, referralCode }
export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { userId, referralCode } = await request.json();

  if (!userId || !referralCode) {
    return NextResponse.json({ error: "userId and referralCode required" }, { status: 400 });
  }

  // Verify the referral code exists and belongs to a different user
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id, referral_code")
    .eq("referral_code", referralCode)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
  }

  if (referrer.id === userId) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  }

  // Check if user already has a referrer
  const { data: existing } = await supabase
    .from("profiles")
    .select("referred_by")
    .eq("id", userId)
    .single();

  if (existing?.referred_by) {
    return NextResponse.json({ ok: true, alreadyReferred: true });
  }

  // Save the referral
  const { error } = await supabase
    .from("profiles")
    .update({ referred_by: referralCode })
    .eq("id", userId);

  if (error) {
    console.error("Failed to save referral:", error);
    return NextResponse.json({ error: "Failed to save referral" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
