import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getUser(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

export async function GET(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ transactions: [], summary: getEmptySummary() });
  }

  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });

  // Get user's page IDs
  const { data: pages } = await supabase
    .from("pages")
    .select("id")
    .eq("user_id", user.id);

  const pageIds = pages?.map((p) => p.id) || [];

  if (pageIds.length === 0) {
    return NextResponse.json({ transactions: [], summary: getEmptySummary() });
  }

  // Get transactions for those pages
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .in("page_id", pageIds)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json({ transactions: [], summary: getEmptySummary() });
  }

  const txns = transactions || [];

  // Calculate summary
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalRevenue = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalFees = txns.reduce((sum, t) => sum + (t.platform_fee || 0), 0);
  const netRevenue = totalRevenue - totalFees;

  const thisMonthTxns = txns.filter((t) => new Date(t.created_at) >= thisMonthStart);
  const lastMonthTxns = txns.filter(
    (t) => new Date(t.created_at) >= lastMonthStart && new Date(t.created_at) < thisMonthStart
  );

  const thisMonthRevenue = thisMonthTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const lastMonthRevenue = lastMonthTxns.reduce((sum, t) => sum + (t.amount || 0), 0);

  const avgOrder = txns.length > 0 ? Math.round(totalRevenue / txns.length) : 0;

  // Per-page revenue breakdown
  const perPage = {};
  for (const t of txns) {
    if (!perPage[t.page_id]) {
      perPage[t.page_id] = { revenue: 0, sales: 0, productName: t.product_name };
    }
    perPage[t.page_id].revenue += t.amount || 0;
    perPage[t.page_id].sales += 1;
  }

  // Monthly revenue for chart (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const monthTxns = txns.filter(
      (t) => new Date(t.created_at) >= d && new Date(t.created_at) <= monthEnd
    );
    monthlyData.push({
      month: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      revenue: monthTxns.reduce((sum, t) => sum + (t.amount || 0), 0),
      sales: monthTxns.length,
    });
  }

  return NextResponse.json({
    transactions: txns.slice(0, 50), // Latest 50
    summary: {
      totalRevenue,
      netRevenue,
      totalFees,
      thisMonthRevenue,
      lastMonthRevenue,
      monthOverMonthChange:
        lastMonthRevenue > 0
          ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
          : thisMonthRevenue > 0
          ? 100
          : 0,
      totalSales: txns.length,
      avgOrder,
      perPage,
      monthlyData,
    },
  });
}

function getEmptySummary() {
  return {
    totalRevenue: 0,
    netRevenue: 0,
    totalFees: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    monthOverMonthChange: 0,
    totalSales: 0,
    avgOrder: 0,
    perPage: {},
    monthlyData: [],
  };
}
