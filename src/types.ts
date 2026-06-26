export type SubscriptionTierType = "FREE" | "PRO" | "ENTERPRISE";

export interface SubscriptionInfo {
  tier: SubscriptionTierType;
  baseWordLimit: number;
  bonusWordLimit: number;
  usedWords: number;
  priceUSD: number;
  badgeActive: boolean;
  geographicRegion: string;
}

export interface ReferralUser {
  id: string;
  developerName: string;
  email: string;
  status: "Registered" | "Upgraded" | "Pending";
  wordsEarned: number;
  date: string;
}

export interface AffiliateStats {
  clickCount: number;
  signUps: number;
  conversions: number;
  unpaidEarnings: number;
  totalWithdrawn: number;
  referralLink: string;
}

export interface ScopedApiKey {
  id: string;
  key: string;
  label: string;
  allowedDomain: string;
  createdAt: string;
  status: "Active" | "Revoked";
}

export interface TranslationLog {
  id: string;
  sourceText: string;
  translatedText: string;
  targetLang: string;
  tone: string;
  wordsCount: number;
  timestamp: string;
}

export interface ServerMetrics {
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
  activeRequests: number;
  requestHistory: number[];
}
