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
                  border: item.accent && !active ? "1px dashed rgba(22,163,74,0.25)" : "1px solid transparent",
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

function DashboardContent() {
  const toast = useToast();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const configured = isSupabaseConfigured();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
              Manage your checkout pages
            </p>
            </div>
          </div>
          <Link href="/builder" className="btn-primary ripple-btn" style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Page
          </Link>
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
                  <AnimatedCounter value={stat.displayValue} duration={1200} />
                </div>
              </div>
            ))}
          </div>

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
                border: "2px dashed var(--border)",
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
                      { title: "View", href: `/checkout/${page.id}`, icon: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3", isLink: true, external: true },
                      { title: "Share", icon: "M18 5a3 3 0 100-6 3 3 0 000 6z M6 12a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z M8.59 13.51l6.83 3.98 M15.41 6.51l-6.82 3.98", onClick: () => setShareUrl(getCheckoutUrl(page.id)) },
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
        </div>
      </div>

      {/* Share Modal */}
      {shareUrl && (
        <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />
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
