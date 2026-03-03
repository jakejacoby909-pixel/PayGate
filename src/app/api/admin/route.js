import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "jakejacoby909@gmail.com";

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

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    // Fetch all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch all transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch all pages
    const { data: pages } = await supabase
      .from("pages")
      .select("id, user_id, config, created_at");

    const userList = (profiles || []).map((p) => ({
      id: p.id,
      email: p.email,
      createdAt: p.created_at,
      plan: p.plan || "free",
      pagesCreated: p.pages_created || 0,
      totalRevenue: p.total_revenue || 0,
      stripeConnectId: p.stripe_connect_id || null,
      // Admin (platform owner) is always connected — payments go to their Stripe directly
      connectComplete: p.email === ADMIN_EMAIL ? true : (p.connect_onboarding_complete || false),
      stripeCustomerId: p.stripe_customer_id || null,
    }));

    // Count pages per user
    const pageCountByUser = {};
    (pages || []).forEach((p) => {
      pageCountByUser[p.user_id] = (pageCountByUser[p.user_id] || 0) + 1;
    });

    const txnList = (transactions || []).map((t) => ({
      id: t.id,
      date: t.created_at,
      email: t.customer_email,
      product: t.product_name || "Unknown",
      amount: t.amount || 0,
      fee: t.platform_fee || 0,
      status: t.status || "completed",
      currency: t.currency || "usd",
      pageId: t.page_id,
      stripeSessionId: t.stripe_session_id,
    }));

    const totalRevenue = txnList.reduce((s, t) => s + t.amount, 0);
    const totalFees = txnList.reduce((s, t) => s + t.fee, 0);

    // Plan breakdown
    const planBreakdown = { free: 0, pro: 0 };
    userList.forEach((u) => {
      planBreakdown[u.plan] = (planBreakdown[u.plan] || 0) + 1;
    });

    // Connect status breakdown
    const connectBreakdown = { connected: 0, pending: 0, notConnected: 0 };
    userList.forEach((u) => {
      if (u.connectComplete) connectBreakdown.connected++;
      else if (u.stripeConnectId) connectBreakdown.pending++;
      else connectBreakdown.notConnected++;
    });

    // Monthly revenue (last 12 months)
    const now = new Date();
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthTxns = txnList.filter(
        (t) => new Date(t.date) >= d && new Date(t.date) <= monthEnd
      );
      monthlyData.push({
        month: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        revenue: monthTxns.reduce((sum, t) => sum + t.amount, 0),
        fees: monthTxns.reduce((sum, t) => sum + t.fee, 0),
        sales: monthTxns.length,
      });
    }

    // Monthly user signups
    const monthlySignups = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = userList.filter(
        (u) => new Date(u.createdAt) >= d && new Date(u.createdAt) <= monthEnd
      ).length;
      monthlySignups.push({
        month: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        count,
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers: userList.length,
        totalTransactions: txnList.length,
        totalRevenue,
        totalFees,
        totalPages: (pages || []).length,
        planBreakdown,
        connectBreakdown,
        monthlyData,
        monthlySignups,
      },
      users: userList.map((u) => ({
        ...u,
        actualPages: pageCountByUser[u.id] || 0,
      })),
      transactions: txnList,
    });
  } catch (err) {
    console.error("Admin API error:", err);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
