// PayGate Plan System
// Free: Limited features, 5% fee, 3 pages
// Pro: Everything, 2% fee, unlimited pages

export const PLANS = {
  free: {
    id: "free",
    name: "Starter",
    price: 0,
    priceYearly: 0,
    platformFee: 5,
    maxPages: 3,
    features: {
      // Templates
      templates: ["minimal", "bold", "gradient", "sunset"],
      // Conversion tools
      enableQuantity: true,
      enableCoupon: true,
      enableCountdown: true,
      enableStockCounter: true,
      enableGuaranteeBadge: true,
      // Locked on free
      enableExitIntent: false,
      enableBumpOffer: false,
      enableSocialProof: false,
      enableTestimonials: false,
      enablePromoBanner: false,
      enablePasswordProtection: false,
      // Sharing
      shareLink: true,
      shareQR: false,
      shareSocial: false,
      shareEmbed: false,
      // Advanced
      customCSS: false,
      removeBranding: false,
      seoMeta: false,
      successRedirect: false,
      revenueAnalytics: false,
      customerExport: false,
      embedButton: false,
      emailPaymentLink: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 12,
    priceYearly: 99,
    platformFee: 2,
    maxPages: Infinity,
    features: {
      // Templates — all
      templates: ["minimal", "bold", "gradient", "glass", "neon", "sunset", "brutalist", "custom"],
      // Conversion tools — all
      enableQuantity: true,
      enableCoupon: true,
      enableCountdown: true,
      enableStockCounter: true,
      enableGuaranteeBadge: true,
      enableExitIntent: true,
      enableBumpOffer: true,
      enableSocialProof: true,
      enableTestimonials: true,
      enablePromoBanner: true,
      enablePasswordProtection: true,
      // Sharing — all
      shareLink: true,
      shareQR: true,
      shareSocial: true,
      shareEmbed: true,
      // Advanced — all
      customCSS: true,
      removeBranding: true,
      seoMeta: true,
      successRedirect: true,
      revenueAnalytics: true,
      customerExport: true,
      embedButton: true,
      emailPaymentLink: true,
    },
  },
};

// Feature descriptions for upgrade prompts
export const PRO_FEATURES = [
  { key: "enableExitIntent", label: "Exit Intent Popup", description: "Show a discount when visitors try to leave — boosts conversions 10-30%" },
  { key: "enableBumpOffer", label: "Order Bumps", description: "Offer add-on products at checkout — increases revenue 15-30%" },
  { key: "enableSocialProof", label: "Social Proof", description: "Show purchase counts to build trust and urgency" },
  { key: "enableTestimonials", label: "Testimonials", description: "Display customer reviews on your checkout page" },
  { key: "enablePromoBanner", label: "Promo Banner", description: "Scrolling promotional banner above checkout" },
  { key: "enablePasswordProtection", label: "Password Protection", description: "Restrict access with an access code" },
  { key: "removeBranding", label: "Remove Branding", description: "Remove 'Built with PayGate' from checkout pages" },
  { key: "customCSS", label: "Custom CSS", description: "Full control with custom styling" },
  { key: "revenueAnalytics", label: "Revenue Analytics", description: "Track earnings, charts, and transaction history" },
  { key: "embedButton", label: "Embeddable Buy Button", description: "Add a buy button to any website" },
  { key: "emailPaymentLink", label: "Email Payment Links", description: "Formatted payment links for email campaigns" },
  { key: "shareEmbed", label: "Embed & QR Sharing", description: "Share via QR codes, embeds, and social media" },
];

// Premium templates (locked on free plan)
export const PREMIUM_TEMPLATES = ["glass", "neon", "brutalist", "custom"];

// Check if user has a specific feature
export function hasFeature(plan, featureKey) {
  const planData = PLANS[plan] || PLANS.free;
  return planData.features[featureKey] === true;
}

// Check if a template is available
export function hasTemplate(plan, templateId) {
  const planData = PLANS[plan] || PLANS.free;
  return planData.features.templates.includes(templateId);
}

// Check if user can create more pages
export function canCreatePage(plan, currentPageCount) {
  const planData = PLANS[plan] || PLANS.free;
  return currentPageCount < planData.maxPages;
}

// Get platform fee percentage
export function getPlatformFee(plan) {
  const planData = PLANS[plan] || PLANS.free;
  return planData.platformFee;
}

// Get plan data
export function getPlan(planId) {
  return PLANS[planId] || PLANS.free;
}
