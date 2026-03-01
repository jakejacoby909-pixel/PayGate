"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { nanoid } from "nanoid";
import { ToastProvider, useToast } from "@/components/Toast";
import ShareModal from "@/components/ShareModal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getAllPages, deletePage, duplicatePage, exportPages, importPages, fetchPagesFromSupabase } from "@/lib/storage";
import { formatPrice, getCheckoutUrl } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { isAdmin } from "@/components/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase";
import { canCreatePage } from "@/lib/plans";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { id: "create", label: "Create Page", href: "/builder", icon: "M12 5v14M5 12h14", accent: true },
];

function Sidebar({ user, onSignOut, sidebarOpen, setSidebarOpen, isMobile }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 199,
            animation: "fadeIn 0.2s ease-out",
          }}
        />
      )}

      <aside style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 260,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
        transform: isMobile
          ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)")
          : (mounted ? "translateX(0)" : "translateX(-100%)"
        ),
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--foreground)" }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
                <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>PayGate</div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted)", fontWeight: 500 }}>Checkout Builder</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontWeight: active ? 600 : 500,
                  color: item.accent && !active ? "var(--primary)" : active ? "var(--foreground)" : "var(--muted)",
                  background: active ? "var(--primary-light)" : item.accent ? "rgba(22,163,74,0.04)" : "transparent",
                  border: item.accent && !active ? "1px solid rgba(22,163,74,0.2)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-12px)",
                  transitionDelay: `${i * 60 + 150}ms`,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: active ? "var(--primary)" : item.accent ? "rgba(22,163,74,0.08)" : "var(--background)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : item.accent ? "var(--primary)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                {item.label}
              </Link>
            );
          })}

          {user && isAdmin(user) && (
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: pathname === "/admin" ? 600 : 500,
                color: pathname === "/admin" ? "var(--foreground)" : "var(--muted)",
                background: pathname === "/admin" ? "rgba(139,92,246,0.08)" : "transparent",
                border: "1px solid transparent",
                transition: "all 0.2s ease",
                marginTop: 4,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(-12px)",
                transitionDelay: "330ms",
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: pathname === "/admin" ? "#8b5cf6" : "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={pathname === "/admin" ? "white" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              Admin
            </Link>
          )}
        </nav>

        {/* User section */}
        <div style={{
          padding: "16px 14px",
          borderTop: "1px solid var(--border)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.4s ease 0.4s",
        }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}>
                {(user.email || "U")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </div>
                <button
                  onClick={onSignOut}
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    transition: "color 0.15s",
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 10,
                background: "var(--background)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--foreground)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

function MiniBarChart({ data, height = 120 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "0 4px" }}>
      {data.map((d, i) => {
        const barH = Math.max((d.revenue / max) * (height - 28), 4);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              title={`$${(d.revenue / 100).toFixed(2)} — ${d.sales} sale${d.sales !== 1 ? "s" : ""}`}
              style={{
                width: "100%",
                height: barH,
                borderRadius: 6,
                background: d.revenue > 0
                  ? "linear-gradient(180deg, var(--primary), var(--secondary))"
                  : "var(--border)",
                transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
                minHeight: 4,
              }}
            />
            <span style={{ fontSize: "0.62rem", color: "var(--muted-light)", fontWeight: 500 }}>
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AreaChart({ data, height = 160 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const w = 100;
  const h = height;
  const pad = { top: 10, bottom: 28, left: 0, right: 0 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: pad.top + chartH - (d.revenue / max) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L${points[points.length - 1].x},${pad.top + chartH} L${points[0].x},${pad.top + chartH} Z`;

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line key={pct} x1={pad.left} y1={pad.top + chartH * (1 - pct)} x2={pad.left + chartW} y2={pad.top + chartH * (1 - pct)} stroke="var(--border)" strokeWidth="0.3" />
        ))}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="var(--primary)" stroke="var(--surface)" strokeWidth="0.8" />
        ))}
      </svg>
      {/* X labels */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: "0.62rem", color: "var(--muted-light)", fontWeight: 500 }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

function RevenuePanel({ revenueData, isMobile, pages }) {
  const s = revenueData?.summary || {};
  const txns = revenueData?.transactions || [];
  const totalRev = (s.totalRevenue || 0) / 100;
  const netRev = (s.netRevenue || 0) / 100;
  const thisMonth = (s.thisMonthRevenue || 0) / 100;
  const lastMonth = (s.lastMonthRevenue || 0) / 100;
  const avgOrder = (s.avgOrder || 0) / 100;
  const totalSales = s.totalSales || 0;
  const feesSaved = totalRev * 0.03; // 5% free vs 2% pro = 3% saved

  // Insights
  const bestPage = s.perPage && s.perPage.length > 0
    ? s.perPage.reduce((a, b) => (a.revenue > b.revenue ? a : b))
    : null;
  const recentTxns = txns.slice(0, 5);

  // Per-page breakdown
  const perPage = s.perPage || [];

  function exportCSV() {
    if (txns.length === 0) return;
    const rows = [["Date", "Product", "Customer", "Amount", "Status"]];
    txns.forEach((t) => {
      rows.push([
        new Date(t.created_at).toLocaleDateString(),
        t.product_name || "",
        t.customer_email || "",
        `$${((t.amount || 0) / 100).toFixed(2)}`,
        t.status || "",
      ]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paygate-revenue.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: 12,
      }}>
        {[
          { label: "Total Revenue", value: `$${totalRev.toFixed(2)}`, color: "#16a34a", bg: "rgba(22,163,74,0.08)", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Your Earnings", value: `$${netRev.toFixed(2)}`, sub: "After 2% Pro fee", color: "#22c55e", bg: "rgba(34,197,94,0.08)", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
          { label: "This Month", value: `$${thisMonth.toFixed(2)}`, change: s.monthOverMonthChange, color: "#3b82f6", bg: "rgba(59,130,246,0.08)", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
          { label: "Total Sales", value: String(totalSales), sub: avgOrder > 0 ? `Avg $${avgOrder.toFixed(2)}` : null, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
        ].map((stat) => (
          <div key={stat.label} className="card-glow" style={{ padding: 18, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon} /></svg>
              </div>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{stat.value}</div>
            {stat.change !== undefined && stat.change !== 0 && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 5, fontSize: "0.7rem", fontWeight: 600, color: stat.change > 0 ? "#22c55e" : "#ef4444", background: stat.change > 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", padding: "2px 7px", borderRadius: 5 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={stat.change > 0 ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} /></svg>
                {Math.abs(stat.change)}%
              </div>
            )}
            {stat.sub && <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>{stat.sub}</div>}
          </div>
        ))}
      </div>

      {/* Chart + Insights Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>
        {/* Area Chart */}
        <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              Revenue Trend
            </h3>
            <button onClick={exportCSV} style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Export CSV
            </button>
          </div>
          {s.monthlyData && s.monthlyData.length > 0 ? (
            <AreaChart data={s.monthlyData} height={180} />
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-light)", fontSize: "0.85rem" }}>
              Chart will appear after first sale
            </div>
          )}
        </div>

        {/* Insights */}
        <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            Insights
          </h3>
          {[
            { label: "Best Seller", value: bestPage ? (bestPage.productName || bestPage.pageId) : "—", sub: bestPage ? `$${(bestPage.revenue / 100).toFixed(2)} revenue` : "No sales yet" },
            { label: "Avg Order Value", value: avgOrder > 0 ? `$${avgOrder.toFixed(2)}` : "—", sub: totalSales > 0 ? `Across ${totalSales} orders` : "No orders" },
            { label: "Pro Fee Savings", value: `$${feesSaved.toFixed(2)}`, sub: "Saved vs 5% free tier" },
            { label: "Conversion Rate", value: pages.length > 0 && totalSales > 0 ? `${((totalSales / Math.max(pages.reduce((a, p) => a + (p.views || 0), 0), 1)) * 100).toFixed(1)}%` : "—", sub: "Sales / page views" },
          ].map((ins) => (
            <div key={ins.label} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--background)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{ins.label}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{ins.value}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted-light)", marginTop: 1 }}>{ins.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Page Breakdown */}
      {perPage.length > 0 && (
        <div style={{ borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Revenue by Page
            </h3>
          </div>
          {perPage.map((pp, i) => {
            const rev = (pp.revenue || 0) / 100;
            const pct = totalRev > 0 ? ((rev / totalRev) * 100) : 0;
            return (
              <div key={pp.pageId || i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: i < perPage.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {pp.productName || pp.pageId}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 2 }}>
                    {pp.sales || 0} sale{(pp.sales || 0) !== 1 ? "s" : ""}
                  </div>
                </div>
                {/* Mini bar */}
                <div style={{ width: 80, height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ width: `${Math.max(pct, 2)}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg, var(--primary), var(--secondary))", transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, fontVariantNumeric: "tabular-nums", textAlign: "right", minWidth: 70 }}>
                  ${rev.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
            Recent Transactions
          </h3>
          <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>{txns.length} total</span>
        </div>
        {txns.length === 0 ? (
          <div style={{ padding: "36px 20px", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, margin: "0 0 3px" }}>No transactions yet</p>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: 0 }}>Revenue appears here when customers complete checkout</p>
          </div>
        ) : (
          <div>
            {txns.map((txn, i) => (
              <div key={txn.id || i} style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 5 : 14, padding: "12px 20px", borderBottom: i < txns.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: txn.status === "completed" ? "#22c55e" : "#f59e0b", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.83rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.product_name || "Unknown"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{txn.customer_email || "No email"}</div>
                  </div>
                </div>
                <div style={{ textAlign: isMobile ? "left" : "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>${((txn.amount || 0) / 100).toFixed(2)}</div>
                  <div style={{ fontSize: "0.66rem", color: "var(--muted)" }}>{new Date(txn.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardContent() {
  const toast = useToast();
  const router = useRouter();
  const { user, loading: authLoading, signOut, plan } = useAuth();
  const isPro = plan === "pro";
  const configured = isSupabaseConfigured();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState(null);
  const [connectStatus, setConnectStatus] = useState("loading"); // loading | not_connected | pending | connected
  const [connectLoading, setConnectLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("pages");
  const [revenueData, setRevenueData] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    check();
    if (window.innerWidth <= 768) setSidebarOpen(false);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (configured && !user) {
      router.push("/login");
      return;
    }
    loadPages();
    loadConnectStatus();
  }, [user, authLoading, configured]);

  async function loadPages() {
    if (configured && user) {
      const supaPages = await fetchPagesFromSupabase(user.id);
      if (supaPages && supaPages.length > 0) {
        setPages(supaPages);
      } else {
        setPages(getAllPages());
      }
    } else {
      setPages(getAllPages());
    }
    setLoading(false);
    setTimeout(() => setMounted(true), 100);
  }

  async function loadConnectStatus() {
    if (!configured || !user) {
      setConnectStatus("not_connected");
      return;
    }
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase");
      const supabase = getSupabaseBrowser();
      if (!supabase) { setConnectStatus("not_connected"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("stripe_connect_id, connect_onboarding_complete")
        .eq("id", user.id)
        .single();
      if (!data?.stripe_connect_id) {
        setConnectStatus("not_connected");
      } else if (data.connect_onboarding_complete) {
        setConnectStatus("connected");
      } else {
        setConnectStatus("pending");
      }
    } catch {
      setConnectStatus("not_connected");
    }
  }

  async function handleConnectStripe() {
    setConnectLoading(true);
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.connectNotEnabled) {
        toast.error("Stripe Connect needs to be enabled. Check your Stripe dashboard settings.");
      } else {
        toast.error(data.error || "Failed to start Stripe Connect onboarding");
      }
    } catch {
      toast.error("Failed to connect Stripe account");
    } finally {
      setConnectLoading(false);
    }
  }

  async function loadRevenue() {
    if (!configured || !user) return;
    setRevenueLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data);
      }
    } catch (err) {
      console.error("Failed to load revenue:", err);
    } finally {
      setRevenueLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "revenue" && !revenueData && configured && user) {
      loadRevenue();
    }
  }, [activeTab, configured, user]);

  const filteredPages = useMemo(() => {
    let result = pages;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.productName || "").toLowerCase().includes(q) ||
          (p.productDescription || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortBy === "views") {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "conversions") {
      result = [...result].sort((a, b) => (b.conversions || 0) - (a.conversions || 0));
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
    }
    return result;
  }, [pages, searchQuery, sortBy]);

  function handleDuplicate(id) {
    if (!canCreatePage(plan, pages.length)) {
      toast.error("Page limit reached. Upgrade to Pro for unlimited pages.");
      return;
    }
    const newPage = duplicatePage(id, nanoid(10));
    if (newPage) {
      setPages(getAllPages());
      toast.success("Page duplicated!");
    }
  }

  function handleDelete(id) {
    deletePage(id);
    setPages(getAllPages());
    setDeleteConfirm(null);
    toast.success("Page deleted");
  }

  function handleExport() {
    const blob = new Blob([exportPages()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paygate-pages-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("All pages exported!");
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (importPages(ev.target.result)) {
        setPages(getAllPages());
        toast.success("Pages imported!");
      } else {
        toast.error("Invalid import file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const totalViews = pages.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalConversions = pages.reduce((sum, p) => sum + (p.conversions || 0), 0);
  const convRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : "0";

  const stats = [
    { label: "Total Pages", value: pages.length, displayValue: String(pages.length), icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "var(--primary)", bg: "var(--primary-light)" },
    { label: "Total Views", value: totalViews, displayValue: String(totalViews), icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    { label: "Conversions", value: totalConversions, displayValue: String(totalConversions), icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
    { label: "Conv. Rate", value: convRate, displayValue: convRate + "%", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex" }} className="page-transition">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onSignOut={signOut}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: isMobile ? 0 : 260, minHeight: "100vh", transition: "margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {/* Top bar */}
        <header style={{
          padding: isMobile ? "12px 16px" : "16px 32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button
                className="dash-hamburger"
                onClick={() => setSidebarOpen(true)}
                style={{ display: "flex" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <div>
            <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Dashboard</h1>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: 0, marginTop: 2 }}>
              {activeTab === "revenue" ? "Track your earnings" : "Manage your checkout pages"}
            </p>
            </div>
          </div>
          {canCreatePage(plan, pages.length) ? (
            <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Page
            </Link>
          ) : (
            <Link href="/pricing" className="btn-primary ripple-btn" style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, background: "#8b5cf6" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Upgrade for More
            </Link>
          )}
        </header>

        <div style={{ padding: isMobile ? "16px" : "28px 32px", maxWidth: 1000 }}>
          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 14,
            marginBottom: 32,
          }}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="card-glow"
                style={{
                  padding: 20,
                  borderRadius: 14,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(16px)",
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {stat.label}
                  </span>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {loading ? (
                    <span style={{ display: "inline-block", width: 40, height: 24, borderRadius: 6, background: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
                  ) : (
                    <AnimatedCounter value={stat.displayValue} duration={1200} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stripe Connect Banner */}
          {connectStatus !== "loading" && connectStatus !== "connected" && (
            <div style={{
              padding: "16px 20px",
              borderRadius: 14,
              background: connectStatus === "pending"
                ? "rgba(245,158,11,0.06)"
                : "rgba(59,130,246,0.06)",
              border: `1px solid ${connectStatus === "pending" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)"}`,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: connectStatus === "pending" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={connectStatus === "pending" ? "#f59e0b" : "#3b82f6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 2 }}>
                  {connectStatus === "pending" ? "Stripe Connect Pending" : "Connect Your Stripe Account"}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                  {connectStatus === "pending"
                    ? "Your Stripe account setup is incomplete. Please finish onboarding to receive payments."
                    : "Connect your Stripe account to receive payments from your checkout pages."}
                </div>
              </div>
              <button
                onClick={handleConnectStripe}
                disabled={connectLoading}
                className="btn-primary"
                style={{
                  padding: "8px 20px",
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  background: connectStatus === "pending" ? "#f59e0b" : undefined,
                }}
              >
                {connectLoading ? (
                  <><span className="spinner" style={{ width: 14, height: 14 }} /> Connecting...</>
                ) : (
                  <>{connectStatus === "pending" ? "Complete Setup" : "Connect Stripe"}</>
                )}
              </button>
            </div>
          )}
          {connectStatus === "connected" && (
            <div style={{
              padding: "12px 20px",
              borderRadius: 14,
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.15)",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#22c55e" }}>Stripe Connected</span>
              <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>— Payments will be deposited to your Stripe account</span>
            </div>
          )}

          {/* Tab Switcher */}
          <div style={{
            display: "flex",
            gap: 4,
            padding: 3,
            background: "var(--background)",
            borderRadius: 12,
            marginBottom: 24,
            width: "fit-content",
            border: "1px solid var(--border)",
          }}>
            <button
              onClick={() => setActiveTab("pages")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                borderRadius: 9,
                border: "none",
                background: activeTab === "pages" ? "var(--surface)" : "transparent",
                color: activeTab === "pages" ? "var(--foreground)" : "var(--muted)",
                fontWeight: 600,
                fontSize: "0.84rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: activeTab === "pages" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Pages
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                borderRadius: 9,
                border: activeTab === "revenue" ? "none" : "none",
                background: activeTab === "revenue"
                  ? (isPro ? "var(--surface)" : "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.06))")
                  : "transparent",
                color: activeTab === "revenue"
                  ? (isPro ? "var(--foreground)" : "#a78bfa")
                  : "var(--muted)",
                fontWeight: 600,
                fontSize: "0.84rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: activeTab === "revenue" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Revenue
              {!isPro && (
                <span style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color: "#a78bfa",
                  background: "rgba(139,92,246,0.15)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  letterSpacing: "0.03em",
                }}>PRO</span>
              )}
            </button>
          </div>

          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <div>
              {!isPro ? (
                <div
                  onClick={() => router.push("/pricing")}
                  style={{ position: "relative", cursor: "pointer", borderRadius: 16, overflow: "hidden" }}
                >
                  {/* Fake dashboard content */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, pointerEvents: "none" }}>
                    {/* Fake stat cards */}
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
                      {[
                        { label: "Total Revenue", value: "$4,238.50", change: "+24%", color: "#16a34a", bg: "rgba(22,163,74,0.08)", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                        { label: "Your Earnings", value: "$4,153.73", sub: "After 2% fee", color: "#22c55e", bg: "rgba(34,197,94,0.08)", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
                        { label: "This Month", value: "$892.00", change: "+18%", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                        { label: "Total Sales", value: "127", sub: "Avg $33.37", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
                      ].map((stat) => (
                        <div key={stat.label} style={{ padding: 16, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</span>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon} /></svg>
                            </div>
                          </div>
                          <div style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{stat.value}</div>
                          {stat.change && <div style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 4, fontSize: "0.68rem", fontWeight: 600, color: "#22c55e", background: "rgba(34,197,94,0.08)", padding: "2px 7px", borderRadius: 5 }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
                            {stat.change}
                          </div>}
                          {stat.sub && <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 3 }}>{stat.sub}</div>}
                        </div>
                      ))}
                    </div>

                    {/* Fake chart + insights */}
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 14 }}>
                      <div style={{ padding: 20, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            Revenue Trend
                          </span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px" }}>Export CSV</span>
                        </div>
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: 160 }}>
                          <defs>
                            <linearGradient id="fakeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                            <line key={p} x1="0" y1={5 + 40 * (1-p)} x2="100" y2={5 + 40 * (1-p)} stroke="var(--border)" strokeWidth="0.3" />
                          ))}
                          <path d="M0,38 L17,30 L33,35 L50,22 L67,15 L83,18 L100,8 L100,45 L0,45 Z" fill="url(#fakeGrad)" />
                          <path d="M0,38 L17,30 L33,35 L50,22 L67,15 L83,18 L100,8" fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          {[[0,38],[17,30],[33,35],[50,22],[67,15],[83,18],[100,8]].map(([x,y],i) => (
                            <circle key={i} cx={x} cy={y} r="1.5" fill="var(--primary)" stroke="var(--surface)" strokeWidth="0.8" />
                          ))}
                        </svg>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                          {["Sep","Oct","Nov","Dec","Jan","Feb"].map((m) => (
                            <span key={m} style={{ fontSize: "0.6rem", color: "var(--muted-light)", fontWeight: 500 }}>{m}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: 18, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          Insights
                        </span>
                        {[
                          { label: "Best Seller", value: "Premium Course", sub: "$1,470.00 revenue" },
                          { label: "Avg Order", value: "$33.37", sub: "Across 127 orders" },
                          { label: "Pro Savings", value: "$127.16", sub: "Saved vs 5% free" },
                          { label: "Conv. Rate", value: "4.8%", sub: "Sales / page views" },
                        ].map((ins) => (
                          <div key={ins.label} style={{ padding: "8px 10px", borderRadius: 8, background: "var(--background)", border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{ins.label}</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, marginTop: 1 }}>{ins.value}</div>
                            <div style={{ fontSize: "0.62rem", color: "var(--muted-light)" }}>{ins.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fake per-page breakdown */}
                    <div style={{ borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
                      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                          Revenue by Page
                        </span>
                      </div>
                      {[
                        { name: "Premium Course", sales: 52, rev: "$1,470.00", pct: 55 },
                        { name: "Design Templates", sales: 41, rev: "$819.50", pct: 33 },
                        { name: "Coaching Session", sales: 34, rev: "$1,949.00", pct: 12 },
                      ].map((pp, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "0.83rem", fontWeight: 600 }}>{pp.name}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{pp.sales} sales</div>
                          </div>
                          <div style={{ width: 70, height: 5, borderRadius: 3, background: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ width: `${pp.pct}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg, var(--primary), var(--secondary))" }} />
                          </div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 65, textAlign: "right" }}>{pp.rev}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overlay with Pro button */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10, 15, 12, 0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    zIndex: 2,
                  }}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}>
                      <div style={{
                        padding: "14px 32px",
                        background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                        color: "white",
                        borderRadius: 14,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 8px 32px rgba(139,92,246,0.4)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(139,92,246,0.5)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,92,246,0.4)"; }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Upgrade to Pro
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                        Click anywhere to view plans
                      </span>
                    </div>
                  </div>
                </div>
              ) : revenueLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
                  ))}
                </div>
              ) : !configured ? (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "rgba(59,130,246,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>Connect Supabase to track revenue</h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: 360, margin: "0 auto" }}>
                    Revenue tracking requires Supabase and Stripe to be configured. Transactions are recorded automatically when customers complete checkout.
                  </p>
                </div>
              ) : (
                <RevenuePanel revenueData={revenueData} isMobile={isMobile} pages={pages} />
              )}
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === "pages" && <>
          {/* Search and Actions */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            gap: 12,
            flexWrap: "wrap",
          }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Your Pages</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <svg
                  width="14" height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted-light)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "7px 12px 7px 32px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: "0.82rem",
                    outline: "none",
                    fontFamily: "inherit",
                    width: 180,
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "7px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  fontSize: "0.82rem",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="views">Most Views</option>
                <option value="conversions">Most Sales</option>
              </select>
              <button onClick={handleExport} className="btn-secondary" style={{ padding: "7px 14px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <label className="btn-secondary" style={{ padding: "7px 14px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import
                <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          {/* Pages List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
              ))}
            </div>
          ) : filteredPages.length === 0 && searchQuery ? (
            <div style={{
              textAlign: "center",
              padding: "48px 20px",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", display: "block" }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>No results found</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                No pages match &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          ) : pages.length === 0 ? (
            <div
              className="animate-fade-in-up"
              style={{
                textAlign: "center",
                padding: "60px 20px",
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, var(--primary-light), rgba(22,163,74,0.08))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>No pages yet</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
                Create your first checkout page and start accepting payments in minutes.
              </p>
              <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "12px 28px", fontSize: "0.9rem", textDecoration: "none" }}>
                Create Your First Page
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredPages.map((page, i) => (
                <div
                  key={page.id}
                  className="card-glow"
                  style={{
                    padding: isMobile ? "14px" : "16px 20px",
                    borderRadius: 14,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: isMobile ? "flex-start" : "center",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 12 : 16,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms`,
                  }}
                >
                  {/* Color indicator */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${page.accentColor || "var(--primary)"}, ${page.accentColor || "var(--primary)"}dd)`,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${page.accentColor || "var(--primary)"}22`,
                  }}>
                    {page.logo ? (
                      <img src={page.logo} alt="" style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {page.productName || "Untitled"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", gap: 12, marginTop: 3, alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{formatPrice(page.price, page.currency)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        {page.views || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        {page.conversions || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
                    {[
                      { title: "Edit", href: `/builder?id=${page.id}`, icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z", isLink: true },
                      { title: "View", href: connectStatus === "connected" ? `/checkout/${page.id}` : null, icon: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3", isLink: connectStatus === "connected", external: true, onClick: connectStatus !== "connected" ? () => toast.error("Connect your Stripe account first to view your checkout page.") : undefined },
                      { title: "Share", icon: "M18 5a3 3 0 100-6 3 3 0 000 6z M6 12a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z M8.59 13.51l6.83 3.98 M15.41 6.51l-6.82 3.98", onClick: () => {
                        if (connectStatus !== "connected") {
                          toast.error("Connect your Stripe account before sharing. Click 'Connect Stripe' or 'Complete Setup' above.");
                          return;
                        }
                        setShareUrl(getCheckoutUrl(page.id));
                      } },
                      { title: "Duplicate", icon: "M9 9h13v13H9z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1", onClick: () => handleDuplicate(page.id) },
                      { title: "Delete", icon: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", onClick: () => setDeleteConfirm(page.id), danger: true },
                    ].map((action) => {
                      const style = {
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: action.danger ? "var(--danger)" : "var(--muted)",
                        transition: "all 0.2s ease",
                        textDecoration: "none",
                      };
                      const svg = (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={action.icon} />
                        </svg>
                      );
                      if (action.isLink) {
                        return (
                          <Link key={action.title} href={action.href} target={action.external ? "_blank" : undefined} title={action.title} className="action-btn" style={style}>
                            {svg}
                          </Link>
                        );
                      }
                      return (
                        <button key={action.title} onClick={action.onClick} title={action.title} className="action-btn" style={style}>
                          {svg}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Page count footer */}
          {pages.length > 0 && (
            <div style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: "0.78rem",
              color: "var(--muted-light)",
            }}>
              {filteredPages.length} of {pages.length} page{pages.length !== 1 ? "s" : ""}
            </div>
          )}
          </>}
        </div>
      </div>

      {/* Share Modal */}
      {shareUrl && (
        <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} plan={plan} />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="animate-modal-backdrop"
          onClick={() => setDeleteConfirm(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
            padding: 20,
          }}
        >
          <div
            className="animate-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              padding: 28,
              maxWidth: 380,
              width: "100%",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>Delete this page?</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: 20 }}>
              This action cannot be undone. The checkout link will stop working.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
                style={{ flex: 1, padding: "10px 20px", fontSize: "0.88rem" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  background: "var(--danger)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.target.style.background = "#dc2626"; }}
                onMouseLeave={(e) => { e.target.style.background = "var(--danger)"; }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
