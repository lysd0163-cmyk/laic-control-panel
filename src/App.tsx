import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe2, 
  Coins, 
  Gift, 
  ShieldCheck, 
  Terminal, 
  BookOpen, 
  Menu, 
  X, 
  Cpu, 
  Sparkles, 
  Activity, 
  Lock,
  User,
  LogOut,
  ChevronLeft,
  Settings,
  Download,
  ExternalLink,
  HelpCircle,
  CreditCard
} from "lucide-react";
import { 
  SubscriptionInfo, 
  ReferralUser, 
  AffiliateStats, 
  ScopedApiKey 
} from "./types";
import { formatNumber } from "./utils";

// Import modules
import LocalizationPlayground from "./components/LocalizationPlayground";
import BillingMeteringHub from "./components/BillingMeteringHub";
import RewardsSystem from "./components/RewardsSystem";
import SecurityPrivacy from "./components/SecurityPrivacy";
import AdminDashboard from "./components/AdminDashboard";
import DeveloperDocs from "./components/DeveloperDocs";

export default function App() {
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Tab management
  const [activeTab, setActiveTab] = useState<string>("playground");

  // State initialization (with localStorage persistence)
  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => {
    const cached = localStorage.getItem("laic_subscription");
    if (cached) return JSON.parse(cached);
    return {
      tier: "FREE",
      baseWordLimit: 5000,
      bonusWordLimit: 0,
      usedWords: 1450,
      priceUSD: 0,
      badgeActive: false,
      geographicRegion: "ME",
    };
  });

  const [referrals, setReferrals] = useState<ReferralUser[]>(() => {
    const cached = localStorage.getItem("laic_referrals");
    if (cached) return JSON.parse(cached);
    return [
      { id: "ref_1", developerName: "أحمد الدليمي", email: "ahmed.dev@gmail.com", status: "Registered", wordsEarned: 2500, date: "2026-06-20" },
      { id: "ref_2", developerName: "سارة الصافي", email: "sara.saf@dev.co", status: "Registered", wordsEarned: 2500, date: "2026-06-24" }
    ];
  });

  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats>(() => {
    const cached = localStorage.getItem("laic_affiliate_stats");
    if (cached) return JSON.parse(cached);
    return {
      clickCount: 140,
      signUps: 24,
      conversions: 4,
      unpaidEarnings: 119.20,
      totalWithdrawn: 120.00,
      referralLink: "https://l-ai-c.com/ref/ali_saad_1803i"
    };
  });

  const [apiKeys, setApiKeys] = useState<ScopedApiKey[]>(() => {
    const cached = localStorage.getItem("laic_api_keys");
    if (cached) return JSON.parse(cached);
    return [
      { 
        id: "key_1", 
        key: "laic_live_a71b29cc51df30e84bc9", 
        label: "لوحة تحكم المتجر الرئيسي (CORS Scope)", 
        allowedDomain: "https://app.mycompany.com", 
        createdAt: "2026-06-25", 
        status: "Active" 
      }
    ];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("laic_subscription", JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem("laic_referrals", JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem("laic_affiliate_stats", JSON.stringify(affiliateStats));
  }, [affiliateStats]);

  useEffect(() => {
    localStorage.setItem("laic_api_keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  // Compute total earned referral words
  const computedReferralBonus = referrals.reduce((sum, ref) => sum + ref.wordsEarned, 0);
  
  // Badge extra word loop
  const badgeBonus = subscription.badgeActive ? 1000 : 0;
  const totalLimit = subscription.baseWordLimit + computedReferralBonus + badgeBonus;

  // Words added/translated callback
  const handleWordsTranslated = (words: number) => {
    setSubscription((prev) => ({
      ...prev,
      usedWords: Math.min(totalLimit, prev.usedWords + words),
    }));
  };

  // Referral added callback
  const handleAddReferral = (newRef: ReferralUser) => {
    setReferrals((prev) => [newRef, ...prev]);
    triggerGlobalConfetti();
  };

  // API Key management callbacks
  const handleAddApiKey = (newKey: ScopedApiKey) => {
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleRevokeApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const triggerGlobalConfetti = () => {
    console.log("Viral action captured! Word budget updated.");
  };

  const menuItems = [
    { id: "playground", label: "لوحة العمل والتوطين", subtitle: "AI Localization", icon: Globe2 },
    { id: "billing", label: "باقات الدفع والاستهلاك", subtitle: "Usage & Billing", icon: Coins },
    { id: "rewards", label: "الهدايا ونظام الإحالات", subtitle: "Rewards & Viral", icon: Gift },
    { id: "security", label: "المفاتيح وحماية البيانات", subtitle: "Security & Keys", icon: ShieldCheck },
    { id: "admin", label: "لوحة تحكم الإدارة", subtitle: "Admin Telemetry", icon: Activity },
    { id: "docs", label: "دليل المطورين والـ SDK", subtitle: "Developer Docs", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="app-viewport">
      
      {/* Top Navigation / Mobile Header */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-850 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </span>
          <span className="font-bold text-sm tracking-wide text-slate-100 font-sans">L-AI-C Control Panel</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-white p-1"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Main Grid Wrapper */}
      <div className="flex-1 flex relative">
        
        {/* Sidebar Navigation - Desktop */}
        <aside className={`fixed inset-y-0 right-0 z-40 lg:z-0 lg:static flex-shrink-0 w-72 bg-slate-900 border-l border-slate-850 flex flex-col justify-between transform transition-transform duration-200 lg:transform-none ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}>
          
          <div className="flex flex-col gap-6 p-6">
            {/* SaaS Brand Logo */}
            <div className="hidden lg:flex items-center gap-3 border-b border-slate-850 pb-5">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-slate-950 shadow-lg shadow-teal-500/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-100 tracking-tight font-sans">Localization AI Control</span>
                <span className="text-[10px] text-teal-400 font-mono font-bold tracking-wider">L-AI-C • B2B Hub</span>
              </div>
            </div>

            {/* Simulated Workspace Selector */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 border border-teal-500/20 font-bold font-mono">
                AS
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate font-sans">علي سعد (Workspace)</span>
                <span className="text-[9px] text-slate-500 truncate font-mono">ali.saad1803i@coadec...</span>
              </div>
            </div>

            {/* Sidebar navigation list */}
            <nav className="flex flex-col gap-1.5" id="sidebar-nav">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition font-sans text-right ${
                      isSelected 
                        ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/5 border border-teal-500/20 text-teal-400" 
                        : "hover:bg-slate-850 border border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isSelected ? "text-teal-400" : "text-slate-400"}`} />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{item.label}</span>
                        <span className="text-[9px] text-slate-500 font-mono font-medium tracking-wide mt-0.5">{item.subtitle}</span>
                      </div>
                    </div>
                    {isSelected && <ChevronLeft className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: Real-time Word Meter Quick Display */}
          <div className="p-6 border-t border-slate-850 flex flex-col gap-3">

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                <span>مجموع الكلمات المستهلكة</span>
                <span className="font-mono font-bold text-slate-300">
                  {Math.round((subscription.usedWords / totalLimit) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-teal-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${(subscription.usedWords / totalLimit) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 text-right">
                {formatNumber(subscription.usedWords)} / {formatNumber(totalLimit)} W
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 border-t border-slate-900 pt-2 font-sans">
              <span>الباقة: <strong className="text-teal-400 font-mono">{subscription.tier}</strong></span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                مؤمن
              </span>
            </div>
          </div>

        </aside>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6" id="dashboard-main-content">
          
          {/* Top Banner: Global SaaS Status and Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${
                  subscription.tier === "FREE" ? "bg-amber-400" : "bg-teal-400"
                }`} />
                <h2 className="text-lg font-bold text-white tracking-tight font-sans">
                  {activeTab === "playground" && "محرك التوطين والـ AI Playground"}
                  {activeTab === "billing" && "إدارة الاشتراكات والاستهلاك (Billing)"}
                  {activeTab === "rewards" && "نظام المكافآت الذكي والنمو الفيروسي"}
                  {activeTab === "security" && "معايير الأمان وحماية الـ API"}
                  {activeTab === "admin" && "المراقبة الفورية للخوادم الحوسبية"}
                  {activeTab === "docs" && "دليل المطورين وتكامل الـ SDK"}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                {activeTab === "playground" && "توطين برمجيات المؤسسة ديناميكياً باستخدام حواجز الحماية الثقافية والقانونية."}
                {activeTab === "billing" && "تتبع استهلاك الكلمات الشهري بدقة تامة، والتحكم في باقات الدفع ومحاكاة التسعير الجغرافي."}
                {activeTab === "rewards" && "كسب رصيد مجاني من الكلمات وعمولات سحب بنسبة 20% مدى الحياة بمجرد نشر المنصة."}
                {activeTab === "security" && "إنشاء مفاتيح API مقيدة بـ CORS لضمان خصوصية بياناتك وسياسات Zero Data Retention."}
                {activeTab === "admin" && "مراقبة مستويات المعالج، وحجم الطلبات الفورية، والتحكم في مبيعات الخطة ومعدلات الاحتيال."}
                {activeTab === "docs" && "خطوات إدماج حزمة SDK البرمجية داخل كود موقعك في غضون دقائق معدودة."}
              </p>
            </div>

            {/* Live stats summary */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850/60 font-mono">
              <Cpu className="w-4 h-4 text-teal-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">حالة الربط</span>
                <span className="text-xs font-bold text-slate-200">Express + Vite Node</span>
              </div>
            </div>
          </div>

          {/* Dynamic Module Rendering */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {activeTab === "playground" && (
                  <LocalizationPlayground 
                    onWordsTranslated={handleWordsTranslated}
                    badgeActive={subscription.badgeActive}
                    setBadgeActive={(active) => setSubscription((prev) => ({ ...prev, badgeActive: active }))}
                    currentTier={subscription.tier}
                  />
                )}
                {activeTab === "billing" && (
                  <BillingMeteringHub 
                    subscription={subscription}
                    setSubscription={setSubscription}
                    bonusWords={computedReferralBonus}
                  />
                )}
                {activeTab === "rewards" && (
                  <RewardsSystem 
                    referrals={referrals}
                    onAddReferral={handleAddReferral}
                    affiliateStats={affiliateStats}
                    setAffiliateStats={setAffiliateStats}
                    badgeActive={subscription.badgeActive}
                    setBadgeActive={(active) => setSubscription((prev) => ({ ...prev, badgeActive: active }))}
                  />
                )}
                {activeTab === "security" && (
                  <SecurityPrivacy 
                    apiKeys={apiKeys}
                    onAddApiKey={handleAddApiKey}
                    onRevokeApiKey={handleRevokeApiKey}
                  />
                )}
                {activeTab === "admin" && (
                  <AdminDashboard />
                )}
                {activeTab === "docs" && (
                  <DeveloperDocs />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </main>

      </div>

    </div>
  );
}
