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
import { savePage } from "@/lib/storage";

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
  const imageInputRef = useRef(null);
  const autoSaveTimer = useRef(null);

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
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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

  async function handleSave() {
    if (!config.productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!config.price || parseFloat(config.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSaving(true);
    const id = config.id || nanoid(10);
    const pageConfig = { ...config, id };
    savePage(pageConfig);

    toast.success("Page created successfully!");
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

  const previewWidths = {
    desktop: "100%",
    tablet: 768,
    mobile: 375,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--background)" }}>
      {/* Left Panel — Form */}
      <div style={{
        width: 420,
        minWidth: 420,
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--foreground)",
                fontWeight: 700,
                fontSize: "1.1rem",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v16" /><path d="M20 4v16" /><path d="M4 4c0 0 3-2 8-2s8 2 8 2" />
                  <path d="M12 10v8" /><path d="M14.5 10.5c0 0-0.8-0.5-2.5-0.5s-2.5 1-2.5 2 1 1.8 2.5 2.2 2.5 1.2 2.5 2.3-1 2-2.5 2-2.5-0.5-2.5-0.5" />
                </svg>
              </div>
              PayGate
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Auto-save indicator */}
            {autoSaved && (
              <span
                className="animate-save-flash"
                style={{
                  fontSize: "0.72rem",
                  color: "var(--success)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Draft saved
              </span>
            )}
            {hasChanges && !autoSaved && (
              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--warning)",
                display: "inline-block",
              }}
              title="Unsaved changes"
              />
            )}
            <button
              onClick={undo}
              disabled={historyIndex < 0}
              title="Undo (Cmd+Z)"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                cursor: historyIndex < 0 ? "default" : "pointer",
                opacity: historyIndex < 0 ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                transition: "all 0.15s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ padding: "8px 20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}
            >
              {saving ? (
                <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving...</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          padding: "0 12px",
          gap: 2,
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setPrevTab(activeTab); setActiveTab(tab.id); }}
              className={activeTab === tab.id ? "tab-active" : ""}
              style={{
                padding: "12px 14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? "var(--primary)" : "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
                fontFamily: "inherit",
                position: "relative",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {/* Product Tab */}
          {activeTab === "product" && (
            <>
              <FormField label="Product Name">
                <input
                  className="input-base"
                  value={config.productName}
                  onChange={(e) => updateConfig({ productName: e.target.value })}
                  placeholder="e.g. Premium Course Access"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  className="input-base"
                  value={config.productDescription}
                  onChange={(e) => updateConfig({ productDescription: e.target.value })}
                  placeholder="Describe your product..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <div style={{ display: "flex", gap: 12 }}>
                <FormField label="Price" style={{ flex: 1 }}>
                  <input
                    className="input-base"
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
                    className="input-base"
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
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>
                  Product Images
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  {(config.productImages || []).map((img, i) => (
                    <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "var(--danger)",
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
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      border: "2px dashed var(--border)",
                      background: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted-light)",
                      transition: "all 0.15s",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
            </>
          )}

          {/* Design Tab */}
          {activeTab === "design" && (
            <>
              {/* Visual Template Selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
                  Template
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                  {TEMPLATES.map((t) => {
                    const selected = config.template === t.id;
                    const colors = t.colors || {};
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateConfig({ template: t.id })}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: selected ? `2px solid var(--primary)` : "2px solid var(--border)",
                          background: selected ? "var(--primary-light)" : "var(--surface)",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                          position: "relative",
                        }}
                      >
                        {/* Mini preview */}
                        <div style={{
                          width: "100%",
                          height: 52,
                          borderRadius: 6,
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
                            <div style={{ width: "70%", height: 8, borderRadius: t.id === "brutalist" ? 1 : 3, background: colors.accent || "#16a34a" }} />
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
                            background: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          </div>
                        )}
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>{t.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom template color pickers */}
              {config.template === "custom" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)" }}>
                  <ColorPicker label="Background Color" value={config.customBgColor || "#ffffff"} onChange={(v) => updateConfig({ customBgColor: v })} />
                  <ColorPicker label="Card Background" value={config.customCardBg || "#ffffff"} onChange={(v) => updateConfig({ customCardBg: v })} />
                  <ColorPicker label="Text Color" value={config.customTextColor || "#1a1a1a"} onChange={(v) => updateConfig({ customTextColor: v })} />
                  <FormField label="Border Style">
                    <input className="input-base" value={config.customBorderStyle || "1px solid #e5e7eb"} onChange={(e) => updateConfig({ customBorderStyle: e.target.value })} placeholder="1px solid #e5e7eb" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }} />
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
                  className="input-base"
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
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
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
                        padding: "10px 16px",
                        borderRadius: bs.radius,
                        border: config.buttonStyle === bs.id ? "2px solid var(--primary)" : "2px solid var(--border)",
                        background: config.buttonStyle === bs.id ? config.accentColor : "var(--surface)",
                        color: config.buttonStyle === bs.id ? "white" : "var(--foreground)",
                        cursor: "pointer",
                        fontSize: "0.8rem",
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
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
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
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: config.backgroundPattern === bp.id ? "2px solid var(--primary)" : "2px solid var(--border)",
                        background: config.backgroundPattern === bp.id ? "var(--primary-light)" : "var(--surface)",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        transition: "all 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      {bp.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <>
              <ToggleField
                label="Quantity Selector"
                description="Let customers choose how many to buy"
                value={config.enableQuantity}
                onChange={(v) => updateConfig({ enableQuantity: v })}
              />
              {config.enableQuantity && (
                <FormField label="Max Quantity">
                  <input
                    className="input-base"
                    type="number"
                    min="1"
                    max="100"
                    value={config.maxQuantity}
                    onChange={(e) => updateConfig({ maxQuantity: parseInt(e.target.value) || 10 })}
                  />
                </FormField>
              )}

              <ToggleField
                label="Discount Codes"
                description="Allow customers to enter a coupon code"
                value={config.enableCoupon}
                onChange={(v) => updateConfig({ enableCoupon: v })}
              />
              {config.enableCoupon && (
                <div style={{ display: "flex", gap: 12 }}>
                  <FormField label="Coupon Code" style={{ flex: 1 }}>
                    <input
                      className="input-base"
                      value={config.couponCode}
                      onChange={(e) => updateConfig({ couponCode: e.target.value.toUpperCase() })}
                      placeholder="SAVE10"
                      style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                    />
                  </FormField>
                  <FormField label="Discount %" style={{ width: 100 }}>
                    <input
                      className="input-base"
                      type="number"
                      min="1"
                      max="100"
                      value={config.couponDiscount}
                      onChange={(e) => updateConfig({ couponDiscount: parseInt(e.target.value) || 0 })}
                    />
                  </FormField>
                </div>
              )}

              <ToggleField
                label="Countdown Timer"
                description="Create urgency with a deadline"
                value={config.enableCountdown}
                onChange={(v) => updateConfig({ enableCountdown: v })}
              />
              {config.enableCountdown && (
                <FormField label="Deadline">
                  <input
                    className="input-base"
                    type="datetime-local"
                    value={config.countdownDate}
                    onChange={(e) => updateConfig({ countdownDate: e.target.value })}
                  />
                </FormField>
              )}

              <ToggleField
                label="Stock Counter"
                description='Show "Only X left" urgency'
                value={config.enableStockCounter}
                onChange={(v) => updateConfig({ enableStockCounter: v })}
              />
              {config.enableStockCounter && (
                <FormField label="Stock Count">
                  <input
                    className="input-base"
                    type="number"
                    min="1"
                    value={config.stockCount}
                    onChange={(e) => updateConfig({ stockCount: parseInt(e.target.value) || 0 })}
                  />
                </FormField>
              )}

              <ToggleField
                label="Social Proof"
                description="Show how many people bought this"
                value={config.enableSocialProof}
                onChange={(v) => updateConfig({ enableSocialProof: v })}
              />
              {config.enableSocialProof && (
                <FormField label="Customer Count">
                  <input
                    className="input-base"
                    type="number"
                    min="0"
                    value={config.socialProofCount}
                    onChange={(e) => updateConfig({ socialProofCount: parseInt(e.target.value) || 0 })}
                  />
                </FormField>
              )}

              <ToggleField
                label="Testimonials"
                description="Add customer reviews to your checkout"
                value={config.enableTestimonials}
                onChange={(v) => updateConfig({ enableTestimonials: v })}
              />
              {config.enableTestimonials && (
                <div>
                  {(config.testimonials || []).map((t, i) => (
                    <div key={i} style={{
                      padding: 12,
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      marginBottom: 8,
                      position: "relative",
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
                          color: "var(--muted-light)",
                          padding: 0,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <input
                        className="input-base"
                        value={t.name}
                        onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                        placeholder="Customer name"
                        style={{ marginBottom: 6, fontSize: "0.82rem" }}
                      />
                      <textarea
                        className="input-base"
                        value={t.text}
                        onChange={(e) => updateTestimonial(i, "text", e.target.value)}
                        placeholder="Their review..."
                        rows={2}
                        style={{ marginBottom: 6, fontSize: "0.82rem", resize: "vertical" }}
                      />
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateTestimonial(i, "rating", star)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={star <= t.rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
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
                    className="btn-secondary"
                    style={{ width: "100%", padding: "8px 16px", fontSize: "0.82rem" }}
                  >
                    + Add Testimonial
                  </button>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

              {/* Exit-Intent Popup */}
              <ToggleField
                label="Exit-Intent Popup"
                description="Show a discount when users try to leave"
                value={config.enableExitIntent}
                onChange={(v) => updateConfig({ enableExitIntent: v })}
              />
              {config.enableExitIntent && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <FormField label="Headline">
                    <input
                      className="input-base"
                      value={config.exitIntentHeadline}
                      onChange={(e) => updateConfig({ exitIntentHeadline: e.target.value })}
                      placeholder="Wait! Don't miss out!"
                    />
                  </FormField>
                  <FormField label="Discount %">
                    <input
                      className="input-base"
                      type="number"
                      min="1"
                      max="100"
                      value={config.exitIntentDiscount}
                      onChange={(e) => updateConfig({ exitIntentDiscount: parseInt(e.target.value) || 0 })}
                    />
                  </FormField>
                </div>
              )}

              {/* Order Bump */}
              <ToggleField
                label="Order Bump"
                description="Offer an add-on product at checkout"
                value={config.enableBumpOffer}
                onChange={(v) => updateConfig({ enableBumpOffer: v })}
              />
              {config.enableBumpOffer && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <FormField label="Bump Product Name">
                    <input
                      className="input-base"
                      value={config.bumpOfferName}
                      onChange={(e) => updateConfig({ bumpOfferName: e.target.value })}
                      placeholder="e.g. Priority Support"
                    />
                  </FormField>
                  <FormField label="Bump Price">
                    <input
                      className="input-base"
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
                      className="input-base"
                      value={config.bumpOfferDescription}
                      onChange={(e) => updateConfig({ bumpOfferDescription: e.target.value })}
                      placeholder="Get priority email support for 1 year"
                    />
                  </FormField>
                </div>
              )}

              {/* Guarantee Badge */}
              <ToggleField
                label="Guarantee Badge"
                description="Show a money-back guarantee"
                value={config.enableGuaranteeBadge}
                onChange={(v) => updateConfig({ enableGuaranteeBadge: v })}
              />
              {config.enableGuaranteeBadge && (
                <FormField label="Guarantee Text">
                  <input
                    className="input-base"
                    value={config.guaranteeText}
                    onChange={(e) => updateConfig({ guaranteeText: e.target.value })}
                    placeholder="30-Day Money Back Guarantee"
                  />
                </FormField>
              )}

              {/* Promo Banner */}
              <ToggleField
                label="Promo Banner"
                description="Scrolling promotional text above checkout"
                value={config.enablePromoBanner}
                onChange={(v) => updateConfig({ enablePromoBanner: v })}
              />
              {config.enablePromoBanner && (
                <FormField label="Banner Text">
                  <input
                    className="input-base"
                    value={config.promoBannerText}
                    onChange={(e) => updateConfig({ promoBannerText: e.target.value })}
                    placeholder="Limited time offer - Save 20% today!"
                  />
                </FormField>
              )}

              {/* Password Protection */}
              <ToggleField
                label="Password Protection"
                description="Require a code to view checkout"
                value={config.enablePasswordProtection}
                onChange={(v) => updateConfig({ enablePasswordProtection: v })}
              />
              {config.enablePasswordProtection && (
                <FormField label="Access Code">
                  <input
                    className="input-base"
                    value={config.passwordProtectionCode}
                    onChange={(e) => updateConfig({ passwordProtectionCode: e.target.value })}
                    placeholder="Enter access code"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </FormField>
              )}
            </>
          )}

          {/* Advanced Tab */}
          {activeTab === "advanced" && (
            <>
              <FormField label="Custom Thank You Message">
                <textarea
                  className="input-base"
                  value={config.customThankYou}
                  onChange={(e) => updateConfig({ customThankYou: e.target.value })}
                  placeholder="Thank you for your purchase!"
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <FormField label="Success Redirect URL">
                <input
                  className="input-base"
                  value={config.successRedirectUrl}
                  onChange={(e) => updateConfig({ successRedirectUrl: e.target.value })}
                  placeholder="https://example.com/thank-you"
                />
              </FormField>

              <FormField label="SEO Title">
                <input
                  className="input-base"
                  value={config.metaTitle}
                  onChange={(e) => updateConfig({ metaTitle: e.target.value })}
                  placeholder="Custom page title for search engines"
                />
              </FormField>

              <FormField label="SEO Description">
                <textarea
                  className="input-base"
                  value={config.metaDescription}
                  onChange={(e) => updateConfig({ metaDescription: e.target.value })}
                  placeholder="Custom description for search engines"
                  rows={2}
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <FormField label="Custom CSS">
                <textarea
                  className="input-base"
                  value={config.customCSS}
                  onChange={(e) => updateConfig({ customCSS: e.target.value })}
                  placeholder=".my-class { color: red; }"
                  rows={4}
                  style={{ resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                />
              </FormField>

              <ToggleField
                label="PayGate Branding"
                description='Show "Built with PayGate" badge'
                value={config.enableBranding !== false}
                onChange={(v) => updateConfig({ enableBranding: v })}
              />

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={exportConfig}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: "0.82rem", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export JSON
                </button>
                <label
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: "0.82rem", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Import JSON
                  <input type="file" accept=".json" onChange={importConfig} style={{ display: "none" }} />
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--background)" }}>
        {/* Preview toolbar */}
        <div style={{
          padding: "10px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          background: "var(--surface)",
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
                background: previewDevice === d.id ? "var(--primary-light)" : "transparent",
                color: previewDevice === d.id ? "var(--primary)" : "var(--muted-light)",
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
          background: previewDevice === "desktop" ? "transparent" : "var(--background)",
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
              boxShadow: previewDevice === "desktop" ? "none" : "var(--shadow-xl)",
              border: previewDevice === "desktop" ? "none" : "1px solid var(--border)",
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
        />
      )}
    </div>
  );
}

/* Helper Components */
function FormField({ label, children, style }) {
  return (
    <div style={style}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--foreground)",
          marginBottom: 6,
        }}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function ToggleField({ label, description, value, onChange }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid var(--border)",
      background: value ? "var(--primary-light)" : "var(--surface)",
      transition: "all 0.2s ease",
    }}>
      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>{label}</div>
        {description && (
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>{description}</div>
        )}
      </div>
      <button
        type="button"
        className={`toggle-switch ${value ? "active" : ""}`}
        onClick={() => onChange(!value)}
      />
    </div>
  );
}
