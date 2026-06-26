import { SubscriptionInfo, SubscriptionTierType } from "./types";

export const REGIONS = [
  { code: "ME", name: "الشرق الأوسط وشمال أفريقيا (خصم 50%)", discount: 0.50, currency: "USD", symbol: "$" },
  { code: "US", name: "أمريكا الشمالية (السعر القياسي)", discount: 0.00, currency: "USD", symbol: "$" },
  { code: "EU", name: "أوروبا (السعر القياسي)", discount: 0.00, currency: "EUR", symbol: "€" },
  { code: "AS", name: "آسيا والمحيط الهادئ (خصم 40%)", discount: 0.40, currency: "USD", symbol: "$" },
  { code: "AF", name: "أفريقيا جنوب الصحراء (خصم 65%)", discount: 0.65, currency: "USD", symbol: "$" }
];

export const TIER_BASE_LIMITS: Record<SubscriptionTierType, number> = {
  FREE: 5000,
  PRO: 100000,
  ENTERPRISE: 1000000,
};

export const TIER_BASE_PRICES: Record<SubscriptionTierType, number> = {
  FREE: 0,
  PRO: 149,
  ENTERPRISE: 999,
};

// Calculate pricing adapted to geographic location
export function getGeographicPrice(tier: SubscriptionTierType, regionCode: string): { price: number; formatted: string } {
  const basePrice = TIER_BASE_PRICES[tier];
  if (tier === "FREE") return { price: 0, formatted: "مجاني" };
  if (tier === "ENTERPRISE") return { price: basePrice, formatted: "تسعير مخصص" };

  const region = REGIONS.find((r) => r.code === regionCode) || REGIONS[0];
  const discountedPrice = Math.round(basePrice * (1 - region.discount));
  
  if (region.currency === "EUR") {
    return {
      price: discountedPrice,
      formatted: `${discountedPrice} ${region.symbol} / شهرياً`,
    };
  }
  return {
    price: discountedPrice,
    formatted: `$${discountedPrice} / شهرياً`,
  };
}

// Generate random mock API key
export function generateMockApiKey(label: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let keyPart = "";
  for (let i = 0; i < 32; i++) {
    keyPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `laic_live_${keyPart.toLowerCase()}`;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
