"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, isAdmin } from "@/components/AuthProvider";

function MiniAreaChart({ data, height = 100, color = "var(--primary)" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const h = height;
  const pad = { top: 8, bottom: 20, left: 0, right: 0 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: pad.top + chartH - (d.value / max) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L${points[points.length - 1].x},${pad.top + chartH} L${points[0].x},${pad.top + chartH} Z`;

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`areaGrad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#areaGrad-${color.replace(/[^a-z0-9]/gi, "")})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.2" fill={color} />
        ))}
      </svg>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} style={{ fontSize: "0.55rem", color: "var(--muted-light)", fontWeight: 500 }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const r = 42;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = circ * pct;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "all 0.6s ease" }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--foreground)">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fontWeight="500" fill="var(--muted)">
        total
      </text>
    </svg>
  );
}

function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [txnSearch, setTxnSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin(user)) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user, authLoading]);

  async function fetchData() {
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!data?.transactions?.length) return;
    const headers = ["Date", "Customer Email", "Product", "Amount", "Platform Fee", "Status"];
    const rows = data.transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.email,
      t.product,
      (t.amount / 100).toFixed(2),
      (t.fee / 100).toFixed(2),
      t.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paygate-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ maxWidth: 400, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "rgba(239,68,68,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Unauthorized</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 24 }}>
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <Link href="/" className="btn-primary" style={{ textDecoration: "none", padding: "10px 24px" }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const users = data?.users || [];
  const transactions = data?.transactions || [];

  const filteredUsers = users.filter((u) =>
    !userSearch.trim() || u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTxns = transactions.filter((t) =>
    !txnSearch.trim() ||
    t.email?.toLowerCase().includes(txnSearch.toLowerCase()) ||
    t.product?.toLowerCase().includes(txnSearch.toLowerCase())
  );

  const revenueChartData = (stats.monthlyData || []).map((d) => ({
    value: d.revenue / 100,
    label: d.month,
  }));

  const feeChartData = (stats.monthlyData || []).map((d) => ({
    value: d.fees / 100,
    label: d.month,
  }));

  const signupChartData = (stats.monthlySignups || []).map((d) => ({
    value: d.count,
    label: d.month,
  }));

  const planSegments = [
    { value: stats.planBreakdown?.free || 0, color: "var(--muted)", label: "Free" },
    { value: stats.planBreakdown?.pro || 0, color: "#8b5cf6", label: "Pro" },
  ];

  const connectSegments = [
    { value: stats.connectBreakdown?.connected || 0, color: "#22c55e", label: "Connected" },
    { value: stats.connectBreakdown?.pending || 0, color: "#f59e0b", label: "Pending" },
    { value: stats.connectBreakdown?.notConnected || 0, color: "var(--border)", label: "Not Connected" },
  ];

  const statCards = [
    { label: "Total Users", value: stats.totalUsers || 0, icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", format: (v) => String(v) },
    { label: "Total Pages", value: stats.totalPages || 0, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", format: (v) => String(v) },
    { label: "Total Revenue", value: stats.totalRevenue || 0, icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6", color: "#22c55e", bg: "rgba(34,197,94,0.08)", format: (v) => "$" + (v / 100).toFixed(2) },
    { label: "Platform Fees", value: stats.totalFees || 0, icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", format: (v) => "$" + (v / 100).toFixed(2) },
    { label: "Transactions", value: stats.totalTransactions || 0, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#06b6d4", bg: "rgba(6,182,212,0.08)", format: (v) => String(v) },
    { label: "Pro Subscribers", value: stats.planBreakdown?.pro || 0, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", color: "#ec4899", bg: "rgba(236,72,153,0.08)", format: (v) => String(v) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "14px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--foreground)" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
                  <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>PayGate</span>
            </Link>
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, color: "white",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Admin
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/dashboard" style={{ padding: "6px 14px", fontSize: "0.8rem", textDecoration: "none", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)", fontWeight: 600 }}>
              Dashboard
            </Link>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: "white" }}>
              {(user.email || "A")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}>
          {statCards.map((stat) => (
            <div key={stat.label} className="card-glow" style={{
              padding: 18,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {stat.label}
                </span>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: stat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon} />
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                {stat.format(stat.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
          {/* Revenue Chart */}
          <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              Revenue (12 months)
            </h3>
            {revenueChartData.length > 0 ? (
              <MiniAreaChart data={revenueChartData} height={120} color="#22c55e" />
            ) : (
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-light)", fontSize: "0.82rem" }}>No data yet</div>
            )}
          </div>

          {/* Plan Breakdown */}
          <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, margin: 0, alignSelf: "flex-start" }}>Plans</h3>
            <DonutChart segments={planSegments} size={100} />
            <div style={{ display: "flex", gap: 14 }}>
              {planSegments.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                  <span style={{ color: "var(--muted)", fontWeight: 500 }}>{s.label}: {s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connect Breakdown */}
          <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, margin: 0, alignSelf: "flex-start" }}>Stripe Connect</h3>
            <DonutChart segments={connectSegments} size={100} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {connectSegments.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.65rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                  <span style={{ color: "var(--muted)", fontWeight: 500 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fee Chart + Signups Chart */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
              Platform Fees Collected
            </h3>
            <MiniAreaChart data={feeChartData} height={100} color="#f59e0b" />
          </div>
          <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
              User Signups
            </h3>
            <MiniAreaChart data={signupChartData} height={100} color="#3b82f6" />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, background: "var(--surface)", borderRadius: 10, padding: 3, marginBottom: 20, border: "1px solid var(--border)", width: "fit-content" }}>
          {[
            { id: "overview", label: "Users", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" },
            { id: "transactions", label: "Transactions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: activeTab === tab.id ? "var(--background)" : "transparent",
                color: activeTab === tab.id ? "var(--foreground)" : "var(--muted)",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Search users by email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-base"
                style={{ maxWidth: 300, fontSize: "0.82rem" }}
              />
            </div>
            <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Email", "Joined", "Plan", "Pages", "Connect", "Revenue"].map((h) => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "36px 14px", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
                        No users found
                      </td>
                    </tr>
                  ) : filteredUsers.map((u, i) => (
                    <tr key={u.id || i} style={{ borderBottom: i < filteredUsers.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: u.plan === "pro" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                            {(u.email || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>{u.email || "—"}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "0.8rem", color: "var(--muted)" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          fontSize: "0.7rem", fontWeight: 600, padding: "3px 8px", borderRadius: 5,
                          background: u.plan === "pro" ? "rgba(139,92,246,0.1)" : "var(--background)",
                          color: u.plan === "pro" ? "#8b5cf6" : "var(--muted)",
                          textTransform: "uppercase",
                        }}>
                          {u.plan}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "0.85rem", fontWeight: 500 }}>{u.actualPages}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          fontSize: "0.68rem", fontWeight: 600, padding: "3px 8px", borderRadius: 5,
                          background: u.connectComplete ? "rgba(34,197,94,0.08)" : u.stripeConnectId ? "rgba(245,158,11,0.08)" : "var(--background)",
                          color: u.connectComplete ? "#22c55e" : u.stripeConnectId ? "#f59e0b" : "var(--muted-light)",
                        }}>
                          {u.connectComplete ? "Connected" : u.stripeConnectId ? "Pending" : "Not Connected"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "0.85rem", fontWeight: 600 }}>${((u.totalRevenue || 0) / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: "0.72rem", color: "var(--muted)" }}>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {activeTab === "transactions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search by email or product..."
                value={txnSearch}
                onChange={(e) => setTxnSearch(e.target.value)}
                className="input-base"
                style={{ maxWidth: 300, fontSize: "0.82rem" }}
              />
              <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", fontSize: "0.8rem", fontWeight: 600, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--foreground)", fontFamily: "inherit" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
            </div>
            <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Date", "Customer", "Product", "Amount", "Fee", "Status"].map((h) => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "36px 14px", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : filteredTxns.map((t, i) => (
                    <tr key={t.id || i} style={{ borderBottom: i < filteredTxns.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "11px 14px", fontSize: "0.8rem", color: "var(--muted)" }}>{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.82rem" }}>{t.email || "—"}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.82rem", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.product}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.85rem", fontWeight: 600 }}>${(t.amount / 100).toFixed(2)}</td>
                      <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "#f59e0b", fontWeight: 600 }}>${(t.fee / 100).toFixed(2)}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          fontSize: "0.68rem", fontWeight: 600, padding: "3px 8px", borderRadius: 5,
                          background: t.status === "completed" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                          color: t.status === "completed" ? "#22c55e" : "#f59e0b",
                        }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: "0.72rem", color: "var(--muted)" }}>
              {filteredTxns.length} transaction{filteredTxns.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}
