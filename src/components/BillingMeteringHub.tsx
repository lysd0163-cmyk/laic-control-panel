import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  MapPin, 
  Coins, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Percent, 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2,
  Info,
  Trash2
} from "lucide-react";
import { 
  SubscriptionInfo, 
  SubscriptionTierType 
} from "../types";
import { 
  REGIONS, 
  getGeographicPrice, 
  formatNumber, 
  TIER_BASE_LIMITS 
} from "../utils";

interface SavedCard {
  id: string;
  cardNo: string;
  bankName: string;
  cardType: string;
  expiry: string;
  isDefault: boolean;
}

interface BillingMeteringHubProps {
  subscription: SubscriptionInfo;
  setSubscription: (sub: SubscriptionInfo | ((prev: SubscriptionInfo) => SubscriptionInfo)) => void;
  bonusWords: number;
}

export default function BillingMeteringHub({ 
  subscription, 
  setSubscription,
  bonusWords 
}: BillingMeteringHubProps) {
  const [simulatedRegion, setSimulatedRegion] = useState<string>("ME");
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedTierToBuy, setSelectedTierToBuy] = useState<SubscriptionTierType | null>(null);
  
  // Saved Cards persistence
  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    const cached = localStorage.getItem("laic_saved_cards");
    if (cached) return JSON.parse(cached);
    return [
      {
        id: "card_rafidain",
        cardNo: "1968164176",
        bankName: "مصرف الرافدين (Rafidain Bank)",
        cardType: "MasterCard",
        expiry: "09/31",
        isDefault: true
      }
    ];
  });

  const [newCardNo, setNewCardNo] = useState<string>("");
  const [newCardBank, setNewCardBank] = useState<string>("");
  const [newCardExpiry, setNewCardExpiry] = useState<string>("12/30");
  const [newCardType, setNewCardType] = useState<string>("MasterCard");
  const [showAddCardForm, setShowAddCardForm] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("laic_saved_cards", JSON.stringify(savedCards));
  }, [savedCards]);
  const [topUpWordsAmount, setTopUpWordsAmount] = useState<number>(10000);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalWordLimit = subscription.baseWordLimit + bonusWords + (subscription.badgeActive ? 1000 : 0);
  const usagePercentage = Math.min(100, (subscription.usedWords / totalWordLimit) * 100);

  const handleRegionChange = (regionCode: string) => {
    setSimulatedRegion(regionCode);
    setSubscription((prev) => {
      const geoPriceInfo = getGeographicPrice(prev.tier, regionCode);
      return {
        ...prev,
        geographicRegion: regionCode,
        priceUSD: geoPriceInfo.price,
      };
    });
  };

  const initiatePurchase = (tier: SubscriptionTierType) => {
    if (tier === "FREE" && subscription.tier !== "FREE") {
      setSubscription((prev) => ({
        ...prev,
        tier: "FREE",
        baseWordLimit: TIER_BASE_LIMITS.FREE,
        priceUSD: 0,
      }));
      triggerSuccess("تم إلغاء الاشتراك والعودة للباقة المجانية.");
      return;
    }
    setSelectedTierToBuy(tier);
    setShowCheckoutModal(true);
  };

  const confirmSubscriptionUpgrade = () => {
    if (!selectedTierToBuy) return;
    
    const geoPriceInfo = getGeographicPrice(selectedTierToBuy, simulatedRegion);
    setSubscription((prev) => ({
      ...prev,
      tier: selectedTierToBuy,
      baseWordLimit: TIER_BASE_LIMITS[selectedTierToBuy],
      priceUSD: geoPriceInfo.price,
    }));
    
    setShowCheckoutModal(false);
    triggerSuccess(`تهانينا! تم ترقية حسابك بنجاح إلى الباقة ${selectedTierToBuy === "PRO" ? "الاحترافية" : "المؤسسية"}.`);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handlePayAsYouGoTopUp = () => {
    setSubscription((prev) => ({
      ...prev,
      baseWordLimit: prev.baseWordLimit + topUpWordsAmount,
    }));
    triggerSuccess(`تم تفعيل الشحن الفوري وإضافة ${formatNumber(topUpWordsAmount)} كلمة مجدولة لخطة الاستهلاك.`);
  };

  const handleSimulateWordConsumption = (amount: number) => {
    setSubscription((prev) => ({
      ...prev,
      usedWords: Math.min(totalWordLimit, prev.usedWords + amount),
    }));
  };

  const resetWordConsumption = () => {
    setSubscription((prev) => ({
      ...prev,
      usedWords: 0,
    }));
    triggerSuccess("تم إعادة تعيين سجل استهلاك الكلمات الشهري.");
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast alert */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500/30 text-emerald-300 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-sans text-sm font-semibold"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Top Banner: Geographic Pricing Simulation bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 rounded-lg text-teal-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-sans">محاكي الاستهداف الجغرافي للأسعار (IP-Based Geographic Pricing)</span>
            <span className="text-sm font-semibold text-slate-100 font-sans">توطين الأسعار وفقاً للقوة الشرائية لكل سوق</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-sans">تحديد إقليم العميل:</span>
          <select
            value={simulatedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Usage Metering Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="text-teal-400 w-5 h-5" />
                <h3 className="text-md font-semibold text-slate-100 font-sans">تتبع الاستهلاك اللحظي (Usage-Based Metering Core)</h3>
              </div>
              <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">
                Real-Time Sync
              </span>
            </div>

            {/* Word consumption meter visual */}
            <div className="flex flex-col gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-sans">حالة الباقة والحدود الشهرية:</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {formatNumber(subscription.usedWords)} / {formatNumber(totalWordLimit)} كلمة
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    usagePercentage > 85 
                      ? "bg-rose-500" 
                      : usagePercentage > 60 
                      ? "bg-amber-500" 
                      : "bg-teal-500"
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                <span>{usagePercentage.toFixed(1)}% مستهلك</span>
                <span>المتبقي: {formatNumber(totalWordLimit - subscription.usedWords)} كلمة</span>
              </div>
            </div>

            {/* Breakdown of limits */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-slate-300 font-sans">توزيع الرصيد الحالي للكلمات:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500">الرصيد الأساسي للباقة</span>
                  <span className="text-xs font-bold text-slate-200 mt-1">{formatNumber(subscription.baseWordLimit)} كلمة</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500">مكافآت الإحالات البرمجية</span>
                  <span className="text-xs font-bold text-teal-400 mt-1">+{formatNumber(bonusWords)} كلمة</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500">مكافأة تفعيل الشعار</span>
                  <span className="text-xs font-bold text-emerald-400 mt-1">
                    +{subscription.badgeActive ? "1,000" : "0"} كلمة
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Word Generator Controls */}
            <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-sans">
                <Zap className="text-amber-400 w-4 h-4" />
                لوحة التحكم في المحاكاة والاستهلاك (Simulation Controls)
              </h4>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSimulateWordConsumption(1000)}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 py-1.5 px-3 rounded border border-slate-700 flex items-center gap-1 font-sans"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                  استهلاك 1,000 كلمة
                </button>
                <button
                  onClick={() => handleSimulateWordConsumption(10000)}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 py-1.5 px-3 rounded border border-slate-700 flex items-center gap-1 font-sans"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                  استهلاك 10,000 كلمة
                </button>
                <button
                  onClick={resetWordConsumption}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-rose-400 py-1.5 px-3 rounded border border-rose-950 flex items-center gap-1 font-sans ml-auto"
                >
                  إعادة ضبط الاستهلاك
                </button>
              </div>
            </div>

            {/* Pay as you go configuration */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <Info className="text-amber-400 w-4 h-4" />
                <span className="text-xs font-semibold text-amber-300 font-sans">خاصية الشحن التلقائي (Pay-as-you-go Trigger)</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                عند تجاوز حدود الباقة، يمنحك النظام خيار تعبئة كلمات إضافية فورية لتجنب انقطاع الخدمة البرمجية. السعر المعتمد: 10 دولارات لكل 10,000 كلمة إضافية.
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <select
                  value={topUpWordsAmount}
                  onChange={(e) => setTopUpWordsAmount(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded p-1.5 focus:outline-none"
                >
                  <option value={10000}>10,000 كلمة إضافية ($10)</option>
                  <option value={50000}>50,000 كلمة إضافية ($45)</option>
                  <option value={100000}>100,000 كلمة إضافية ($80)</option>
                </select>
                <button
                  onClick={handlePayAsYouGoTopUp}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs py-1.5 px-3.5 rounded font-bold border border-amber-500/30 transition"
                >
                  شراء وتعبئة رصيد الآن
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right: SaaS Subscription Tier Matrix */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 font-sans">
              باقات خطط الاشتراك (Subscription Tiers)
            </h3>

            {/* Free Tier Card */}
            <div className={`p-4 rounded-xl border transition ${
              subscription.tier === "FREE" 
                ? "bg-teal-950/20 border-teal-500/40" 
                : "bg-slate-950 border-slate-850"
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">الخطة المجانية الفيروسية (Free Tier)</span>
                  <span className="text-[10px] text-slate-500 mt-1">المطورون والشركات الناشئة</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">مجاني</span>
              </div>
              <ul className="text-[11px] text-slate-400 flex flex-col gap-1.5 mt-3.5">
                <li className="flex items-center gap-1.5">✓ دعم لغة واحدة إضافية</li>
                <li className="flex items-center gap-1.5">✓ 5,000 كلمة شهرياً</li>
                <li className="flex items-center gap-1.5">✓ نظام المكافآت والإحالات الكامل</li>
              </ul>
              <button
                disabled={subscription.tier === "FREE"}
                onClick={() => initiatePurchase("FREE")}
                className="w-full text-center mt-4 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:bg-teal-500/10 disabled:text-teal-400 text-slate-200 py-1.5 rounded-lg border border-slate-700 disabled:border-teal-500/20"
              >
                {subscription.tier === "FREE" ? "باقاتك الحالية" : "العودة للباقة المجانية"}
              </button>
            </div>

            {/* Pro Tier Card */}
            <div className={`p-4 rounded-xl border relative overflow-hidden transition ${
              subscription.tier === "PRO" 
                ? "bg-teal-950/20 border-teal-500/40 shadow-teal-950/20" 
                : "bg-slate-950 border-slate-850 hover:border-slate-800"
            }`}>
              <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-bl">
                موصى بها
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">الباقة الاحترافية (Pro Tier)</span>
                  <span className="text-[10px] text-slate-500 mt-1">الشركات المتوسطة والنمو السريع</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 line-through">$149</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {getGeographicPrice("PRO", simulatedRegion).formatted}
                  </span>
                </div>
              </div>
              <ul className="text-[11px] text-slate-400 flex flex-col gap-1.5 mt-3.5">
                <li className="flex items-center gap-1.5">✓ لغات غير محدودة</li>
                <li className="flex items-center gap-1.5">✓ 100,000 كلمة شهرياً</li>
                <li className="flex items-center gap-1.5">✓ تفعيل جدار الحماية الثقافي والقانوني</li>
                <li className="flex items-center gap-1.5">✓ دعم فني ذو أولوية</li>
              </ul>
              <button
                disabled={subscription.tier === "PRO"}
                onClick={() => initiatePurchase("PRO")}
                className="w-full text-center mt-4 text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-teal-500/10 disabled:to-teal-500/10 disabled:text-teal-400 text-slate-950 disabled:border disabled:border-teal-500/20 py-1.5 rounded-lg"
              >
                {subscription.tier === "PRO" ? "باقاتك الحالية" : "شراء وترقية الآن"}
              </button>
            </div>

            {/* Enterprise Tier Card */}
            <div className={`p-4 rounded-xl border transition ${
              subscription.tier === "ENTERPRISE" 
                ? "bg-teal-950/20 border-teal-500/40" 
                : "bg-slate-950 border-slate-850"
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">باقة الشركات (Enterprise)</span>
                  <span className="text-[10px] text-slate-500 mt-1">المؤسسات والأنظمة الحساسة</span>
                </div>
                <span className="text-xs font-bold text-slate-400">تسعير مخصص</span>
              </div>
              <ul className="text-[11px] text-slate-400 flex flex-col gap-1.5 mt-3.5">
                <li className="flex items-center gap-1.5">✓ استهلاك كلمات مفتوح تماماً</li>
                <li className="flex items-center gap-1.5">✓ عزل كامل وخوادم وقاعدة بيانات مستقلة</li>
                <li className="flex items-center gap-1.5">✓ توافق كامل مع SLA مع فريق دعم مخصص 24/7</li>
                <li className="flex items-center gap-1.5">✓ جدار حماية وقواعد تصفية مخصصة</li>
              </ul>
              <button
                disabled={subscription.tier === "ENTERPRISE"}
                onClick={() => initiatePurchase("ENTERPRISE")}
                className="w-full text-center mt-4 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:bg-teal-500/10 disabled:text-teal-400 text-slate-200 py-1.5 rounded-lg border border-slate-700 disabled:border-teal-500/20"
              >
                {subscription.tier === "ENTERPRISE" ? "باقاتك الحالية" : "طلب تفاصيل واشتراك مخصص"}
              </button>
            </div>

          </div>

          {/* Saved Cards Manager Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4 text-right" dir="rtl">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 font-sans flex items-center gap-2">
              <CreditCard className="text-teal-400 w-5 h-5" />
              <span>إدارة بطاقات الدفع والماستر كارد المحفوظة</span>
            </h3>

            {/* List saved cards */}
            <div className="flex flex-col gap-3">
              {savedCards.map((card) => (
                <div key={card.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between group transition hover:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                      <CreditCard className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-200 font-sans">{card.bankName}</span>
                      <span className="text-[11px] text-slate-400 font-mono tracking-wider">{card.cardNo}</span>
                      <span className="text-[9px] text-slate-500 font-sans">تاريخ الانتهاء: {card.expiry} • {card.cardType}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSavedCards((prev) => prev.filter((c) => c.id !== card.id));
                      triggerSuccess("تم حذف بطاقة الدفع المحفوظة بنجاح.");
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                    title="حذف البطاقة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {savedCards.length === 0 && (
                <div className="text-xs text-slate-500 font-sans text-center py-4">
                  لا توجد بطاقات دفع مسجلة حالياً.
                </div>
              )}
            </div>

            {/* Add card action */}
            {!showAddCardForm ? (
              <button
                onClick={() => setShowAddCardForm(true)}
                className="w-full text-center py-2 text-xs font-bold bg-slate-950 hover:bg-slate-850 text-teal-400 rounded-lg border border-slate-850 hover:border-slate-800 transition cursor-pointer font-sans"
              >
                + إضافة بطاقة ائتمان جديدة
              </button>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCardNo || !newCardBank) return;
                  const newCard: SavedCard = {
                    id: `card_${Date.now()}`,
                    cardNo: newCardNo,
                    bankName: newCardBank,
                    cardType: newCardType,
                    expiry: newCardExpiry,
                    isDefault: savedCards.length === 0
                  };
                  setSavedCards((prev) => [...prev, newCard]);
                  setNewCardNo("");
                  setNewCardBank("");
                  setShowAddCardForm(false);
                  triggerSuccess("تم حفظ وإضافة بطاقة الدفع الجديدة بنجاح.");
                }}
                className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-sans">اسم البنك / المصدر</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مصرف الرافدين"
                    value={newCardBank}
                    onChange={(e) => setNewCardBank(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-sans">رقم بطاقة الماستر كارد / الفيزا</label>
                  <input
                    type="text"
                    required
                    placeholder="رقم بطاقتك الائتمانية"
                    value={newCardNo}
                    onChange={(e) => setNewCardNo(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-sans">تاريخ الانتهاء</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={newCardExpiry}
                      onChange={(e) => setNewCardExpiry(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-sans">نوع البطاقة</label>
                    <select
                      value={newCardType}
                      onChange={(e) => setNewCardType(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-teal-500"
                    >
                      <option value="MasterCard">MasterCard</option>
                      <option value="Visa">Visa</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs py-2 rounded-lg cursor-pointer font-sans"
                  >
                    حفظ البطاقة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCardForm(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-lg cursor-pointer font-sans"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Stripe Checkout Modal Simulator */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-teal-400 w-5 h-5" />
                <h3 className="text-md font-bold text-white">إتمام الدفع الآمن (Stripe Billing)</h3>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                إلغاء
              </button>
            </div>

            <p className="text-xs text-slate-400">
              أنت بصدد الاشتراك في الباقة <span className="text-teal-400 font-bold">{selectedTierToBuy}</span>. تم تعديل الأسعار لتناسب القدرة الشرائية لإقليمك الحالي ({REGIONS.find((r) => r.code === simulatedRegion)?.name}).
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">اسم المنتج:</span>
                <span className="text-slate-200 font-bold">L-AI-C SaaS {selectedTierToBuy} Plan</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">الإقليم الجغرافي:</span>
                <span className="text-teal-400 font-mono font-bold">{simulatedRegion} (IP Detected)</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-900 pt-2">
                <span className="text-slate-400">القيمة الشهرية:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedTierToBuy ? getGeographicPrice(selectedTierToBuy, simulatedRegion).formatted : ""}
                </span>
              </div>
            </div>

            {/* Dynamic Card Payment Simulator */}
            <div className="flex flex-col gap-3 mt-1 text-right" dir="rtl">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-400 font-medium font-sans">البريد الإلكتروني للفواتير</label>
                <input 
                  type="email" 
                  defaultValue="ali.saad1803i@coadec.uobaghdad.edu.iq" 
                  disabled
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-400 focus:outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-400 font-medium font-sans">بطاقة الدفع النشطة</label>
                
                {savedCards.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {savedCards.map((card) => (
                      <div key={card.id} className="bg-slate-950 border border-teal-500/20 rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-teal-500/15 text-teal-400 text-[8px] font-bold px-2 py-0.5 rounded-br font-sans">
                          آمن ومحفوظ (Stripe Elements)
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 font-sans">{card.bankName}</span>
                          <span className="text-[10px] bg-slate-800 text-teal-400 px-1.5 py-0.5 rounded font-bold font-mono">
                            {card.cardType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-mono text-slate-100 font-bold tracking-widest">
                            ••••  ••••  ••••  {card.cardNo.slice(-4)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">EXP: {card.expiry}</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-sans mt-0.5">
                          رقم بطاقتك الكامل: <span className="font-mono text-slate-400">{card.cardNo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-400 font-sans text-center">
                    يرجى إضافة بطاقة MasterCard نشطة من اللوحة لحفظها وإتمام الدفع.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={confirmSubscriptionUpgrade}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              تأكيد الدفع الآمن والترقية
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
