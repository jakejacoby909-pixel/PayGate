"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, isAdmin } from "@/components/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase";

function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ users: 0, transactions: 0, revenue: 0, fees: 0 });
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (authLoading) return;
    if (!configured) {
      setLoading(false);
      return;
    }
    if (!user || !isAdmin(user)) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user, authLoading, configured]);

  async function fetchData() {
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase");
      const supabase = getSupabaseBrowser();

      // Fetch users
      const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      const customerList = (users || []).map((u) => ({
        email: u.email,
        signUpDate: u.created_at,
        pagesCreated: u.pages_created || 0,
        revenue: u.total_revenue || 0,
      }));

      const txnList = (txns || []).map((t) => ({
        id: t.id,
        date: t.created_at,
        email: t.customer_email,
        product: t.product_name || "Unknown",
        amount: t.amount || 0,
        fee: t.platform_fee || 0,
        status: t.status || "completed",
        currency: t.currency || "usd",
      }));

      const totalRevenue = txnList.reduce((s, t) => s + t.amount, 0);
      const totalFees = txnList.reduce((s, t) => s + t.fee, 0);

      setStats({
        users: customerList.length,
        transactions: txnList.length,
        revenue: totalRevenue,
        fees: totalFees,
      });
      setCustomers(customerList);
      setTransactions(txnList);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const headers = ["Date", "Customer Email", "Product", "Amount", "Fee (3%)", "Status"];
    const rows = transactions.map((t) => [
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

  if (!configured) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ maxWidth: 500, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "linear-gradient(135deg, var(--primary-light), rgba(22,163,74,0.08))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 24 }}>
            Supabase is not configured. To use the admin dashboard, add your Supabase URL and anon key to <code style={{ background: "var(--surface-hover)", padding: "2px 6px", borderRadius: 4, fontSize: "0.82rem" }}>.env.local</code> and create the required tables.
          </p>
          <Link href="/" className="btn-primary" style={{ textDecoration: "none", padding: "10px 24px" }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ maxWidth: 400, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "#fef2f2",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
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

  const statCards = [
    { label: "Total Users", value: stats.users, icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", format: (v) => v },
    { label: "Total Transactions", value: stats.transactions, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", format: (v) => v },
    { label: "Total Revenue", value: stats.revenue, icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6", color: "#22c55e", bg: "rgba(34,197,94,0.08)", format: (v) => "$" + (v / 100).toFixed(2) },
    { label: "Platform Fees (3%)", value: stats.fees, icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", format: (v) => "$" + (v / 100).toFixed(2) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: 1200,
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
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "white",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              padding: "3px 10px",
              borderRadius: 6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Admin
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/dashboard" className="btn-secondary" style={{ padding: "7px 16px", fontSize: "0.82rem", textDecoration: "none" }}>
              Dashboard
            </Link>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{user.email}</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}>
          {statCards.map((stat) => (
            <div key={stat.label} className="card-glow" style={{
              padding: 20,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {stat.label}
                </span>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: stat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon} />
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                {stat.format(stat.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, background: "var(--surface)", borderRadius: 10, padding: 3, marginBottom: 24, border: "1px solid var(--border)", width: "fit-content" }}>
          {[
            { id: "overview", label: "Customers" },
            { id: "transactions", label: "Transactions" },
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
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Customers Table */}
        {activeTab === "overview" && (
          <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Email", "Sign Up Date", "Pages Created", "Revenue"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>
                      No customers yet
                    </td>
                  </tr>
                ) : customers.map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < customers.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 500 }}>{c.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--muted)" }}>{new Date(c.signUpDate).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: "0.88rem" }}>{c.pagesCreated}</td>
                    <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600 }}>${(c.revenue / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Table */}
        {activeTab === "transactions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button onClick={exportCSV} className="btn-secondary" style={{ padding: "7px 16px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
            </div>
            <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Date", "Customer", "Product", "Amount", "Fee (3%)", "Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>
                        No transactions yet
                      </td>
                    </tr>
                  ) : transactions.map((t, i) => (
                    <tr key={t.id || i} style={{ borderBottom: i < transactions.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--muted)" }}>{new Date(t.date).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.85rem" }}>{t.email}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.85rem" }}>{t.product}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600 }}>${(t.amount / 100).toFixed(2)}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#f59e0b", fontWeight: 600 }}>${(t.fee / 100).toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 6,
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
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}
