export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20ac", name: "Euro" },
  { code: "GBP", symbol: "\u00a3", name: "British Pound" },
  { code: "JPY", symbol: "\u00a5", name: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "INR", symbol: "\u20b9", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
];

export function getCurrencySymbol(code) {
  return CURRENCIES.find((c) => c.code === code)?.symbol || "$";
}

export function formatPrice(amount, currency = "USD") {
  const symbol = getCurrencySymbol(currency);
  const num = parseFloat(amount) || 0;
  if (currency === "JPY") return `${symbol}${Math.round(num).toLocaleString()}`;
  return `${symbol}${num.toFixed(2)}`;
}

export const FONTS = [
  { value: "Inter, system-ui, sans-serif", label: "Inter" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
  { value: "system-ui, sans-serif", label: "System Default" },
];

export const TEMPLATES = [
  { id: "minimal", name: "Minimal", description: "Clean and simple", colors: { bg: "#ffffff", card: "#ffffff", accent: "#16a34a" } },
  { id: "bold", name: "Bold", description: "High contrast and impactful", colors: { bg: "#0f172a", card: "#1e293b", accent: "#3b82f6" } },
  { id: "gradient", name: "Gradient", description: "Colorful gradient backgrounds", colors: { bg: "#f0fdf4", card: "#ffffff", accent: "#16a34a" } },
  { id: "glass", name: "Glass", description: "Glassmorphism effects", colors: { bg: "#0a2414", card: "rgba(255,255,255,0.08)", accent: "#22c55e" } },
  { id: "neon", name: "Neon", description: "Dark with neon glow accents", colors: { bg: "#0a0a0a", card: "#141414", accent: "#00ff88" } },
  { id: "sunset", name: "Sunset", description: "Warm gradient tones", colors: { bg: "#fff7ed", card: "#ffffff", accent: "#f97316" } },
  { id: "brutalist", name: "Brutalist", description: "Bold borders, sharp corners", colors: { bg: "#ffffff", card: "#ffffff", accent: "#000000" } },
  { id: "custom", name: "Custom", description: "Your own color scheme", colors: { bg: "#ffffff", card: "#ffffff", accent: "#16a34a" } },
];

export const PRESET_COLORS = [
  "#16a34a", "#15803d", "#22c55e", "#065f46",
  "#d97706", "#f59e0b", "#3b82f6", "#06b6d4",
  "#7c3aed", "#ec4899", "#1e293b", "#000000",
];

export const BUTTON_STYLES = [
  { id: "pill", label: "Pill", radius: "9999px" },
  { id: "rounded", label: "Rounded", radius: "12px" },
  { id: "square", label: "Square", radius: "4px" },
];

export const BACKGROUND_PATTERNS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "gradient", label: "Gradient" },
];

export function getDefaultPageConfig() {
  return {
    id: "",
    productName: "",
    productDescription: "",
    price: "",
    currency: "USD",
    template: "minimal",
    accentColor: "#16a34a",
    backgroundColor: "#ffffff",
    backgroundPattern: "none",
    fontFamily: "Inter, system-ui, sans-serif",
    buttonStyle: "pill",
    logo: null,
    productImages: [],
    enableQuantity: false,
    maxQuantity: 10,
    enableCoupon: false,
    couponCode: "",
    couponDiscount: 10,
    enableCountdown: false,
    countdownDate: "",
    enableStockCounter: false,
    stockCount: 50,
    enableSocialProof: false,
    socialProofCount: 1247,
    enableTestimonials: false,
    testimonials: [
      { name: "Sarah K.", text: "Absolutely love this product!", rating: 5 },
    ],
    customThankYou: "Thank you for your purchase! We'll send you a confirmation email shortly.",
    customCSS: "",
    metaTitle: "",
    metaDescription: "",
    successRedirectUrl: "",
    enableBranding: true,
    customBgColor: "#ffffff",
    customCardBg: "#ffffff",
    customTextColor: "#1a1a1a",
    customBorderStyle: "1px solid #e5e7eb",
    enableExitIntent: false,
    exitIntentHeadline: "Wait! Don't miss out!",
    exitIntentDiscount: 10,
    enableBumpOffer: false,
    bumpOfferName: "",
    bumpOfferPrice: "",
    bumpOfferDescription: "",
    enableGuaranteeBadge: false,
    guaranteeText: "30-Day Money Back Guarantee",
    enablePromoBanner: false,
    promoBannerText: "Limited time offer - Save 20% today!",
    enablePasswordProtection: false,
    passwordProtectionCode: "",
  };
}

export function generateQRDataUrl(text, size = 200) {
  // Simple QR code as SVG via a deterministic pattern (visual placeholder)
  // In production, use a real QR library
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export function getCheckoutUrl(id) {
  return `${getBaseUrl()}/checkout/${id}`;
}

export function timeUntil(dateString) {
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}
