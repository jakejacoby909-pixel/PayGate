"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import ColorPicker from "./ColorPicker";
import LogoUpload from "./LogoUpload";
import CheckoutPreview from "./CheckoutPreview";
import ShareModal from "./ShareModal";
import { useToast } from "./Toast";
import {
  getDefaultPageConfig,
  CURRENCIES,
  FONTS,
  TEMPLATES,
  BUTTON_STYLES,
  BACKGROUND_PATTERNS,
  getCheckoutUrl,
} from "@/lib/utils";
import { savePage, syncPageToSupabase, getAllPages } from "@/lib/storage";
import { useAuth } from "@/components/AuthProvider";
import { hasFeature, hasTemplate, canCreatePage, PREMIUM_TEMPLATES } from "@/lib/plans";

const AUTO_SAVE_DELAY = 3000;

const TABS = [
  { id: "product", label: "Product", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "design", label: "Design", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: "features", label: "Features", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "advanced", label: "Advanced", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Builder({ existingConfig }) {
  const router = useRouter();
  const toast = useToast();
  const { user, plan, signOut } = useAuth();
  const isPro = plan === "pro";
  const [config, setConfig] = useState(() => existingConfig || getDefaultPageConfig());
  const [activeTab, setActiveTab] = useState("product");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [showShareModal, setShowShareModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSaved, setAutoSaved] = useState(false);
  const [prevTab, setPrevTab] = useState("product");
  const [hasChanges, setHasChanges] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState("form");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const imageInputRef = useRef(null);
  const autoSaveTimer = useRef(null);
  const profileMenuRef = useRef(null);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showProfileMenu]);

  // Undo/redo
  const updateConfig = useCallback((updates) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      setHistory((h) => {
        const newHistory = h.slice(0, historyIndex + 1);
        newHistory.push(prev);
        return newHistory.slice(-30);
      });
      setHistoryIndex((i) => i + 1);
      setHasChanges(true);
      return next;
    });
  }, [historyIndex]);

  function undo() {
    if (historyIndex >= 0 && history[historyIndex]) {
      setConfig(history[historyIndex]);
      setHistoryIndex((i) => i - 1);
    }
  }

  // Keyboard shortcuts
  const handleSaveRef = useRef(handleSave);
  const undoRef = useRef(undo);
  handleSaveRef.current = handleSave;
  undoRef.current = undo;

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undoRef.current();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveRef.current();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-save to localStorage draft
  useEffect(() => {
    if (!hasChanges) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem("paygate-draft", JSON.stringify(config));
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      } catch {}
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(autoSaveTimer.current);
  }, [config, hasChanges]);

  // Load draft on mount
  useEffect(() => {
    if (existingConfig) return;
    try {
      const draft = localStorage.getItem("paygate-draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.productName || parsed.price) {
          setConfig((prev) => ({ ...prev, ...parsed, id: "" }));
        }
      }
    } catch {}
  }, [existingConfig]);

  async function checkConnectStatus() {
    if (!user?.id) return false;
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase");
      const supabase = getSupabaseBrowser();
      if (!supabase) return false;
      const { data } = await supabase
        .from("profiles")
        .select("stripe_connect_id, connect_onboarding_complete")
        .eq("id", user.id)
        .single();
      return data?.connect_onboarding_complete === true;
    } catch {
      return false;
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
        toast.error(data.error || "Failed to start Stripe Connect");
      }
    } catch {
      toast.error("Failed to connect Stripe account");
    } finally {
      setConnectLoading(false);
    }
  }

  async function handleSave() {
    if (!config.productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!config.price || parseFloat(config.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    // Block new page creation if at plan limit
    if (!config.id && !canCreatePage(plan, getAllPages().length)) {
      toast.error("Page limit reached. Upgrade to Pro for unlimited pages.");
      return;
    }

    // Check Stripe Connect status before publishing
    const isConnected = await checkConnectStatus();
    if (!isConnected) {
      setShowConnectModal(true);
      return;
    }

    setSaving(true);
    const id = config.id || nanoid(10);
    const pageConfig = { ...config, id };
    savePage(pageConfig);

    if (user?.id) {
      syncPageToSupabase(pageConfig, user.id).catch(() => {});
    }

    toast.success(config.id ? "Page updated!" : "Page created successfully!");
    setSaving(false);
    setConfig(pageConfig);
    setHasChanges(false);
    try { localStorage.removeItem("paygate-draft"); } catch {}
    setShowShareModal(true);
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateConfig({ productImages: [...(config.productImages || []), ev.target.result] });
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    const updated = [...config.productImages];
    updated.splice(index, 1);
    updateConfig({ productImages: updated });
  }

  function addTestimonial() {
    updateConfig({
      testimonials: [...(config.testimonials || []), { name: "", text: "", rating: 5 }],
    });
  }

  function updateTestimonial(index, field, value) {
    const updated = [...config.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    updateConfig({ testimonials: updated });
  }

  function removeTestimonial(index) {
    const updated = [...config.testimonials];
    updated.splice(index, 1);
    updateConfig({ testimonials: updated });
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paygate-${config.productName || "page"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Config exported!");
  }

  function importConfig(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        setConfig({ ...getDefaultPageConfig(), ...imported, id: "" });
        toast.success("Config imported!");
      } catch {
        toast.error("Invalid config file");
      }
    };
    reader.readAsText(file);
  }

  function handleProFeatureClick(featureName) {
    setUpgradeFeature(featureName);
    setShowUpgradeModal(true);
  }

  const previewWidths = {
    desktop: "100%",
    tablet: 768,
    mobile: 375,
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <div className="builder-layout" style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0f0f0f" }}>
      {/* Mobile Toggle */}
      {isMobile && (
        <div className="builder-mobile-toggle" style={{ display: "flex" }}>
          <button
            className={mobileView === "form" ? "active" : ""}
            onClick={() => setMobileView("form")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            className={mobileView === "preview" ? "active" : ""}
            onClick={() => setMobileView("preview")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview
          </button>
        </div>
      )}

      {/* Left Panel — Form */}
      <div
        className={`builder-form-panel${isMobile && mobileView !== "form" ? " mobile-hidden" : ""}`}
        style={{
          width: isMobile ? "100%" : 440,
          minWidth: isMobile ? "unset" : 440,
          borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          background: "#141414",
          overflow: isMobile ? "auto" : "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#141414",
        }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px 4px 4px",
              borderRadius: 10,
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg, #16a34a, #065f46)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v16" /><path d="M20 4v16" /><path d="M12 10v8" />
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>
              {existingConfig ? "Edit Page" : "New Page"}
            </span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Save status */}
            {autoSaved && (
              <span
                className="animate-save-flash"
                style={{
                  fontSize: "0.68rem",
                  color: "rgba(34,197,94,0.7)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Draft saved
              </span>
            )}

            {/* Publish */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "7px 18px",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "white",
                border: "none",
                borderRadius: 9,
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 2px 12px rgba(22,163,74,0.3)",
              }}
            >
              {saving ? (
                <><span className="spinner" style={{ width: 13, height: 13 }} /> Saving...</>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Publish
                </>
              )}
            </button>

            {/* Profile Avatar */}
            <div ref={profileMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: showProfileMenu ? "1.5px solid rgba(22,163,74,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
                  background: showProfileMenu ? "rgba(22,163,74,0.1)" : "linear-gradient(135deg, rgba(22,163,74,0.15), rgba(6,95,70,0.15))",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                {userInitial}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="animate-fade-in" style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 220,
                  background: "#1c1c1c",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: 6,
                  zIndex: 100,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                }}>
                  {/* User info */}
                  <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>
                      {user?.email?.split("@")[0] || "Guest"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
                      {user?.email || "Not signed in"}
                    </div>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 6,
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 5,
                      background: isPro ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.05)",
                      color: isPro ? "#a78bfa" : "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {isPro ? "Pro Plan" : "Free Plan"}
                    </div>
                  </div>

                  {/* Menu items */}
                  <ProfileMenuItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>}
                    label="Dashboard"
                    onClick={() => { setShowProfileMenu(false); router.push("/dashboard"); }}
                  />
                  {!isPro && (
                    <ProfileMenuItem
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                      label="Upgrade to Pro"
                      accent
                      onClick={() => { setShowProfileMenu(false); router.push("/pricing"); }}
                    />
                  )}

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

                  <ProfileMenuItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}
                    label="Sign Out"
                    danger
                    onClick={() => { setShowProfileMenu(false); signOut(); router.push("/"); }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 8px",
          gap: 0,
          background: "#141414",
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setPrevTab(activeTab); setActiveTab(tab.id); }}
                style={{
                  padding: "11px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#16a34a" : "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  position: "relative",
                  borderBottom: isActive ? "2px solid #16a34a" : "2px solid transparent",
                  marginBottom: -1,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 18px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}>
          {/* Product Tab */}
          {activeTab === "product" && (
            <div key="product" className="builder-tab-content" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <FormField label="Product Name">
                <input
                  className="builder-input"
                  value={config.productName}
                  onChange={(e) => updateConfig({ productName: e.target.value })}
                  placeholder="e.g. Premium Course Access"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  className="builder-input"
                  value={config.productDescription}
                  onChange={(e) => updateConfig({ productDescription: e.target.value })}
                  placeholder="Describe your product..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <div style={{ display: "flex", gap: 10 }}>
                <FormField label="Price" style={{ flex: 1 }}>
                  <input
                    className="builder-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={config.price}
                    onChange={(e) => updateConfig({ price: e.target.value })}
                    placeholder="29.99"
                  />
                </FormField>
                <FormField label="Currency" style={{ width: 130 }}>
                  <select
                    className="builder-input"
                    value={config.currency}
                    onChange={(e) => updateConfig({ currency: e.target.value })}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <LogoUpload
                value={config.logo}
                onChange={(logo) => updateConfig({ logo })}
              />

              {/* Product Images */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>
                  Product Images
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(config.productImages || []).map((img, i) => (
                    <div key={i} style={{ position: "relative", width: 68, height: 68, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "rgba(239,68,68,0.9)",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.6rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 10,
                      border: "2px dashed rgba(255,255,255,0.1)",
                      background: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.25)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(22,163,74,0.4)"; e.currentTarget.style.color = "rgba(22,163,74,0.6)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          )}

          {/* Design Tab */}
          {activeTab === "design" && (
            <div key="design" className="builder-tab-content" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <FormField label="Template">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                {TEMPLATES.map((t) => {
                  const selected = config.template === t.id;
                  const colors = t.colors || {};
                  const templateLocked = !isPro && PREMIUM_TEMPLATES.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => templateLocked ? handleProFeatureClick(t.name + " template") : updateConfig({ template: t.id })}
                      style={{
                        padding: 8,
                        borderRadius: 12,
                        border: selected ? `2px solid #16a34a` : templateLocked ? "2px solid rgba(139,92,246,0.15)" : "2px solid rgba(255,255,255,0.06)",
                        background: selected ? "rgba(22,163,74,0.08)" : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                        position: "relative",
                      }}
                    >
                      <div style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 8,
                        background: colors.bg || "#fff",
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: t.id === "brutalist" ? "2px solid #000" : "1px solid rgba(0,0,0,0.06)",
                      }}>
                        <div style={{
                          width: "60%",
                          height: "70%",
                          borderRadius: t.id === "brutalist" ? 2 : 4,
                          background: typeof colors.card === "string" && colors.card.startsWith("rgba") ? "#1e293b" : (colors.card || "#fff"),
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 3,
                          border: t.id === "brutalist" ? "2px solid #000" : "none",
                          boxShadow: t.id === "neon" ? `0 0 8px ${colors.accent}44` : "none",
                        }}>
                          <div style={{ width: "50%", height: 3, borderRadius: 2, background: colors.accent || "#16a34a" }} />
                          <div style={{ width: "70%", height: 7, borderRadius: t.id === "brutalist" ? 1 : 3, background: colors.accent || "#16a34a" }} />
                        </div>
                      </div>
                      {selected && (
                        <div style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "#16a34a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                      {templateLocked && (
                        <div style={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "rgba(139,92,246,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        </div>
                      )}
                      <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        {t.name}
                        {templateLocked && (
                          <span style={{ fontSize: "0.5rem", fontWeight: 700, color: "#a78bfa", background: "rgba(139,92,246,0.12)", padding: "1px 4px", borderRadius: 3 }}>PRO</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              </FormField>

              {config.template === "custom" && isPro && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
                  <ColorPicker label="Background Color" value={config.customBgColor || "#ffffff"} onChange={(v) => updateConfig({ customBgColor: v })} />
                  <ColorPicker label="Card Background" value={config.customCardBg || "#ffffff"} onChange={(v) => updateConfig({ customCardBg: v })} />
                  <ColorPicker label="Text Color" value={config.customTextColor || "#1a1a1a"} onChange={(v) => updateConfig({ customTextColor: v })} />
                  <FormField label="Border Style">
                    <input className="builder-input" value={config.customBorderStyle || "1px solid #e5e7eb"} onChange={(e) => updateConfig({ customBorderStyle: e.target.value })} placeholder="1px solid #e5e7eb" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }} />
                  </FormField>
                </div>
              )}

              <ColorPicker
                label="Accent Color"
                value={config.accentColor}
                onChange={(accentColor) => updateConfig({ accentColor })}
              />

              {config.template === "minimal" && (
                <ColorPicker
                  label="Background Color"
                  value={config.backgroundColor}
                  onChange={(backgroundColor) => updateConfig({ backgroundColor })}
                />
              )}

              <FormField label="Font">
                <select
                  className="builder-input"
                  value={config.fontFamily}
                  onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                >
                  {FONTS.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
                  Button Style
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {BUTTON_STYLES.map((bs) => (
                    <button
                      key={bs.id}
                      type="button"
                      onClick={() => updateConfig({ buttonStyle: bs.id })}
                      style={{
                        flex: 1,
                        padding: "9px 14px",
                        borderRadius: bs.radius,
                        border: config.buttonStyle === bs.id ? "2px solid #16a34a" : "2px solid rgba(255,255,255,0.06)",
                        background: config.buttonStyle === bs.id ? "rgba(22,163,74,0.12)" : "rgba(255,255,255,0.02)",
                        color: config.buttonStyle === bs.id ? "#22c55e" : "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        transition: "all 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      {bs.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
                  Background Pattern
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {BACKGROUND_PATTERNS.map((bp) => (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => updateConfig({ backgroundPattern: bp.id })}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: config.backgroundPattern === bp.id ? "2px solid #16a34a" : "2px solid rgba(255,255,255,0.06)",
                        background: config.backgroundPattern === bp.id ? "rgba(22,163,74,0.08)" : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: config.backgroundPattern === bp.id ? "#22c55e" : "rgba(255,255,255,0.5)",
                        transition: "all 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      {bp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div key="features" className="builder-tab-content" style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              <ToggleField
                label="Quantity Selector"
                description="Let customers choose how many to buy"
                value={config.enableQuantity}
                onChange={(v) => updateConfig({ enableQuantity: v })}
              />
              {config.enableQuantity && (
                <SubField>
                  <FormField label="Max Quantity">
                    <input
                      className="builder-input"
                      type="number"
                      min="1"
                      max="100"
                      value={config.maxQuantity}
                      onChange={(e) => updateConfig({ maxQuantity: parseInt(e.target.value) || 10 })}
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Discount Codes"
                description="Allow customers to enter a coupon code"
                value={config.enableCoupon}
                onChange={(v) => updateConfig({ enableCoupon: v })}
              />
              {config.enableCoupon && (
                <SubField>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FormField label="Coupon Code" style={{ flex: 1 }}>
                      <input
                        className="builder-input"
                        value={config.couponCode}
                        onChange={(e) => updateConfig({ couponCode: e.target.value.toUpperCase() })}
                        placeholder="SAVE10"
                        style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                      />
                    </FormField>
                    <FormField label="Discount %" style={{ width: 90 }}>
                      <input
                        className="builder-input"
                        type="number"
                        min="1"
                        max="100"
                        value={config.couponDiscount}
                        onChange={(e) => updateConfig({ couponDiscount: parseInt(e.target.value) || 0 })}
                      />
                    </FormField>
                  </div>
                </SubField>
              )}

              <ToggleField
                label="Countdown Timer"
                description="Create urgency with a deadline"
                value={config.enableCountdown}
                onChange={(v) => updateConfig({ enableCountdown: v })}
              />
              {config.enableCountdown && (
                <SubField>
                  <FormField label="Deadline">
                    <input
                      className="builder-input"
                      type="datetime-local"
                      value={config.countdownDate}
                      onChange={(e) => updateConfig({ countdownDate: e.target.value })}
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Stock Counter"
                description={'"Only X left" urgency'}
                value={config.enableStockCounter}
                onChange={(v) => updateConfig({ enableStockCounter: v })}
              />
              {config.enableStockCounter && (
                <SubField>
                  <FormField label="Stock Count">
                    <input
                      className="builder-input"
                      type="number"
                      min="1"
                      value={config.stockCount}
                      onChange={(e) => updateConfig({ stockCount: parseInt(e.target.value) || 0 })}
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Guarantee Badge"
                description="Show a money-back guarantee"
                value={config.enableGuaranteeBadge}
                onChange={(v) => updateConfig({ enableGuaranteeBadge: v })}
              />
              {config.enableGuaranteeBadge && (
                <SubField>
                  <FormField label="Guarantee Text">
                    <input
                      className="builder-input"
                      value={config.guaranteeText}
                      onChange={(e) => updateConfig({ guaranteeText: e.target.value })}
                      placeholder="30-Day Money Back Guarantee"
                    />
                  </FormField>
                </SubField>
              )}

              {!isPro && (
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "10px 0 2px" }}>
                  Pro
                </div>
              )}

              <ToggleField
                label="Social Proof"
                description="Show how many people bought this"
                value={config.enableSocialProof}
                onChange={(v) => updateConfig({ enableSocialProof: v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Social Proof")}
              />
              {config.enableSocialProof && isPro && (
                <SubField>
                  <FormField label="Customer Count">
                    <input
                      className="builder-input"
                      type="number"
                      min="0"
                      value={config.socialProofCount}
                      onChange={(e) => updateConfig({ socialProofCount: parseInt(e.target.value) || 0 })}
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Testimonials"
                description="Add customer reviews to your checkout"
                value={config.enableTestimonials}
                onChange={(v) => updateConfig({ enableTestimonials: v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Testimonials")}
              />
              {config.enableTestimonials && isPro && (
                <div>
                  {(config.testimonials || []).map((t, i) => (
                    <div key={i} style={{
                      padding: 12,
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      marginBottom: 8,
                      position: "relative",
                      background: "rgba(255,255,255,0.02)",
                    }}>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(i)}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(255,255,255,0.3)",
                          padding: 0,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <input
                        className="builder-input"
                        value={t.name}
                        onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                        placeholder="Customer name"
                        style={{ marginBottom: 6, fontSize: "0.8rem" }}
                      />
                      <textarea
                        className="builder-input"
                        value={t.text}
                        onChange={(e) => updateTestimonial(i, "text", e.target.value)}
                        placeholder="Their review..."
                        rows={2}
                        style={{ marginBottom: 6, fontSize: "0.8rem", resize: "vertical" }}
                      />
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateTestimonial(i, "rating", star)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={star <= t.rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTestimonial}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      fontSize: "0.8rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      color: "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 600,
                      transition: "all 0.15s",
                    }}
                  >
                    + Add Testimonial
                  </button>
                </div>
              )}

              <ToggleField
                label="Exit-Intent Popup"
                description="Show a discount when users try to leave"
                value={config.enableExitIntent}
                onChange={(v) => updateConfig({ enableExitIntent: v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Exit-Intent Popup")}
                tag="+10-30% conversions"
              />
              {config.enableExitIntent && isPro && (
                <SubField>
                  <FormField label="Headline">
                    <input
                      className="builder-input"
                      value={config.exitIntentHeadline}
                      onChange={(e) => updateConfig({ exitIntentHeadline: e.target.value })}
                      placeholder="Wait! Don't miss out!"
                    />
                  </FormField>
                  <FormField label="Discount %">
                    <input
                      className="builder-input"
                      type="number"
                      min="1"
                      max="100"
                      value={config.exitIntentDiscount}
                      onChange={(e) => updateConfig({ exitIntentDiscount: parseInt(e.target.value) || 0 })}
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Order Bump"
                description="Offer an add-on product at checkout"
                value={config.enableBumpOffer}
                onChange={(v) => updateConfig({ enableBumpOffer: v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Order Bump")}
                tag="+15-30% revenue"
              />
              {config.enableBumpOffer && isPro && (
                <SubField>
                  <FormField label="Bump Product Name">
                    <input
                      className="builder-input"
                      value={config.bumpOfferName}
                      onChange={(e) => updateConfig({ bumpOfferName: e.target.value })}
                      placeholder="e.g. Priority Support"
                    />
                  </FormField>
                  <FormField label="Bump Price">
                    <input
                      className="builder-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.bumpOfferPrice}
                      onChange={(e) => updateConfig({ bumpOfferPrice: e.target.value })}
                      placeholder="9.99"
                    />
                  </FormField>
                  <FormField label="Description">
                    <input
                      className="builder-input"
                      value={config.bumpOfferDescription}
                      onChange={(e) => updateConfig({ bumpOfferDescription: e.target.value })}
                      placeholder="Get priority email support for 1 year"
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Promo Banner"
                description="Scrolling promotional text above checkout"
                value={config.enablePromoBanner}
                onChange={(v) => updateConfig({ enablePromoBanner: v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Promo Banner")}
              />
              {config.enablePromoBanner && isPro && (
                <SubField>
                  <FormField label="Banner Text">
                    <input
                      className="builder-input"
                      value={config.promoBannerText}
                      onChange={(e) => updateConfig({ promoBannerText: e.target.value })}
                      placeholder="Limited time offer - Save 20% today!"
                    />
                  </FormField>
                </SubField>
              )}

              <ToggleField
                label="Password Protection"
                description="Require a code to view checkout"
                value={config.enablePasswordProtection}
                onChange={(v) => updateConfig({ enablePasswordProtection: v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Password Protection")}
              />
              {config.enablePasswordProtection && isPro && (
                <SubField>
                  <FormField label="Access Code">
                    <input
                      className="builder-input"
                      value={config.passwordProtectionCode}
                      onChange={(e) => updateConfig({ passwordProtectionCode: e.target.value })}
                      placeholder="Enter access code"
                      style={{ fontFamily: "var(--font-mono)" }}
                    />
                  </FormField>
                </SubField>
              )}
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === "advanced" && (
            <div key="advanced" className="builder-tab-content" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              <FormField label="Custom Thank You Message">
                <textarea
                  className="builder-input"
                  value={config.customThankYou}
                  onChange={(e) => updateConfig({ customThankYou: e.target.value })}
                  placeholder="Thank you for your purchase!"
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <FormField label="Success Redirect URL">
                <input
                  className="builder-input"
                  value={config.successRedirectUrl}
                  onChange={(e) => updateConfig({ successRedirectUrl: e.target.value })}
                  placeholder="https://example.com/thank-you"
                />
              </FormField>

              <FormField label="SEO Title">
                <input
                  className="builder-input"
                  value={config.metaTitle}
                  onChange={(e) => updateConfig({ metaTitle: e.target.value })}
                  placeholder="Custom page title for search engines"
                />
              </FormField>

              <FormField label="SEO Description">
                <textarea
                  className="builder-input"
                  value={config.metaDescription}
                  onChange={(e) => updateConfig({ metaDescription: e.target.value })}
                  placeholder="Custom description for search engines"
                  rows={2}
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <FormField label="Custom CSS">
                <textarea
                  className="builder-input"
                  value={config.customCSS}
                  onChange={(e) => updateConfig({ customCSS: e.target.value })}
                  placeholder=".my-class { color: red; }"
                  rows={4}
                  style={{ resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
                />
              </FormField>

              <ToggleField
                label="Remove PayGate Branding"
                description={'Hide the "Built with PayGate" badge'}
                value={config.enableBranding === false}
                onChange={(v) => updateConfig({ enableBranding: !v })}
                locked={!isPro}
                onLockedClick={() => handleProFeatureClick("Remove Branding")}
              />

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={exportConfig}
                  style={{
                    flex: 1,
                    fontSize: "0.8rem",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                </button>
                <label
                  style={{
                    flex: 1,
                    fontSize: "0.8rem",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Import
                  <input type="file" accept=".json" onChange={importConfig} style={{ display: "none" }} />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div
        className={`builder-preview-panel${isMobile && mobileView !== "preview" ? " mobile-hidden" : ""}`}
        style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0f0f0f" }}
      >
        {/* Preview toolbar */}
        <div style={{
          padding: "10px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          background: "#141414",
        }}>
          {[
            { id: "desktop", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { id: "tablet", icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
            { id: "mobile", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setPreviewDevice(d.id)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "none",
                background: previewDevice === d.id ? "rgba(22,163,74,0.1)" : "transparent",
                color: previewDevice === d.id ? "#22c55e" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={d.icon} />
              </svg>
            </button>
          ))}
        </div>

        {/* Preview area */}
        <div style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          padding: previewDevice === "desktop" ? 0 : 32,
          background: previewDevice === "desktop" ? "#0f0f0f" : "#0a0a0a",
        }}>
          <div
            className="preview-frame"
            style={{
              width: previewWidths[previewDevice],
              maxWidth: "100%",
              height: previewDevice === "desktop" ? "100%" : undefined,
              minHeight: previewDevice !== "desktop" ? 600 : undefined,
              borderRadius: previewDevice === "desktop" ? 0 : 16,
              overflow: "hidden",
              boxShadow: previewDevice === "desktop" ? "none" : "0 20px 60px rgba(0,0,0,0.5)",
              border: previewDevice === "desktop" ? "none" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <CheckoutPreview
              config={config}
              isPreview={true}
              onPay={() => toast.info("Payment would process via Stripe in production")}
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && config.id && (
        <ShareModal
          url={getCheckoutUrl(config.id)}
          onClose={() => setShowShareModal(false)}
          plan={plan}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="animate-modal-backdrop"
          onClick={() => setShowUpgradeModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
        >
          <div
            className="animate-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 20,
              padding: "32px 28px",
              maxWidth: 380,
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Glow circle */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))",
              border: "1px solid rgba(139,92,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", margin: "0 0 6px" }}>
              Unlock {upgradeFeature}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: 1.6 }}>
              This feature is available on the Pro plan. Upgrade to access all premium tools and boost your conversions.
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 20,
              textAlign: "left",
            }}>
              {["All 8 templates", "2% platform fee (vs 5%)", "Unlimited pages", "Revenue analytics", "Advanced sharing"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => { setShowUpgradeModal(false); router.push("/pricing"); }}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
              }}
            >
              View Pro Plans
            </button>

            <button
              onClick={() => setShowUpgradeModal(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.8rem",
                cursor: "pointer",
                marginTop: 10,
                fontFamily: "inherit",
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Stripe Connect Modal */}
      {showConnectModal && (
        <div
          className="animate-modal-backdrop"
          onClick={() => setShowConnectModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
        >
          <div
            className="animate-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 20,
              padding: "32px 28px",
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
              border: "1px solid rgba(59,130,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", margin: "0 0 6px" }}>
              Connect Stripe to Publish
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: 1.6 }}>
              To receive payments from your checkout pages, you need to connect your Stripe account first. This takes about 2 minutes.
            </p>

            <button
              onClick={() => { setShowConnectModal(false); handleConnectStripe(); }}
              disabled={connectLoading}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {connectLoading ? (
                <><span className="spinner" style={{ width: 16, height: 16 }} /> Connecting...</>
              ) : (
                <>Connect Stripe Account</>
              )}
            </button>

            <button
              onClick={() => setShowConnectModal(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.8rem",
                cursor: "pointer",
                marginTop: 10,
                fontFamily: "inherit",
              }}
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Helper Components ===== */

function SubField({ children }) {
  return (
    <div style={{
      paddingLeft: 14,
      borderLeft: "2px solid rgba(22,163,74,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: -4,
    }}>
      {children}
    </div>
  );
}

function FormField({ label, children, style }) {
  return (
    <div style={style}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.55)",
          marginBottom: 5,
        }}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function ToggleField({ label, description, value, onChange, locked, onLockedClick, tag }) {
  return (
    <div
      onClick={locked ? onLockedClick : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 13px",
        borderRadius: 12,
        border: locked ? "1px solid rgba(139,92,246,0.12)" : value ? "1px solid rgba(22,163,74,0.15)" : "1px solid rgba(255,255,255,0.06)",
        background: locked ? "rgba(139,92,246,0.03)" : value ? "rgba(22,163,74,0.05)" : "rgba(255,255,255,0.02)",
        transition: "all 0.2s ease",
        cursor: locked ? "pointer" : "default",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: locked ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 6 }}>
          {label}
          {locked && (
            <span style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              color: "#a78bfa",
              background: "rgba(139,92,246,0.12)",
              padding: "2px 6px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              PRO
            </span>
          )}
          {tag && !locked && (
            <span style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              color: "#f59e0b",
              background: "rgba(245,158,11,0.1)",
              padding: "2px 6px",
              borderRadius: 4,
            }}>
              {tag}
            </span>
          )}
        </div>
        {description && (
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{description}</div>
        )}
      </div>
      {locked ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#a78bfa",
          padding: "5px 10px",
          borderRadius: 7,
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.12)",
          whiteSpace: "nowrap",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Unlock
        </div>
      ) : (
        <button
          type="button"
          className={`toggle-switch ${value ? "active" : ""}`}
          onClick={() => onChange(!value)}
          style={{
            background: value ? "#16a34a" : "rgba(255,255,255,0.1)",
          }}
        />
      )}
    </div>
  );
}

function ProfileMenuItem({ icon, label, onClick, accent, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "9px 12px",
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: "0.82rem",
        fontWeight: 500,
        color: danger ? "#ef4444" : accent ? "#a78bfa" : "rgba(255,255,255,0.6)",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "all 0.1s",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", opacity: 0.7 }}>{icon}</span>
      {label}
    </button>
  );
}
