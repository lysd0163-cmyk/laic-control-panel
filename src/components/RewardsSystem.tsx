import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  Link2, 
  Award, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  UserPlus,
  Compass
} from "lucide-react";
import { ReferralUser, AffiliateStats } from "../types";
import { formatNumber } from "../utils";

interface RewardsSystemProps {
  referrals: ReferralUser[];
  onAddReferral: (newReferral: ReferralUser) => void;
  affiliateStats: AffiliateStats;
  setAffiliateStats: (stats: AffiliateStats | ((prev: AffiliateStats) => AffiliateStats)) => void;
  badgeActive: boolean;
  setBadgeActive: (active: boolean) => void;
}

export default function RewardsSystem({ 
  referrals, 
  onAddReferral,
  affiliateStats,
  setAffiliateStats,
  badgeActive,
  setBadgeActive
}: RewardsSystemProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [newDevName, setNewDevName] = useState<string>("");

  const handleCopyLink = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSimulateReferral = () => {
    if (!newDevName.trim()) return;
    
    const randomId = Math.random().toString(36).substring(7);
    const mockRef: ReferralUser = {
      id: randomId,
      developerName: newDevName,
      email: `${newDevName.toLowerCase().replace(/\s+/g, "_")}@dev.com`,
      status: "Registered",
      wordsEarned: 2500,
      date: new Date().toISOString().split("T")[0]
    };

    onAddReferral(mockRef);
    setNewDevName("");
  };

  const handleSimulateAffiliateSale = () => {
    setAffiliateStats((prev) => ({
      ...prev,
      clickCount: prev.clickCount + Math.floor(Math.random() * 20) + 5,
      signUps: prev.signUps + 1,
      conversions: prev.conversions + 1,
      unpaidEarnings: prev.unpaidEarnings + 29.80, // 20% of $149 Pro tier
    }));
  };

  const handleWithdrawEarnings = () => {
    if (affiliateStats.unpaidEarnings === 0) return;
    setAffiliateStats((prev) => ({
      ...prev,
      totalWithdrawn: prev.totalWithdrawn + prev.unpaidEarnings,
      unpaidEarnings: 0
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Referral Hub: Refer-a-Developer */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="text-teal-400 w-5 h-5" />
              <h3 className="text-md font-semibold text-slate-100 font-sans">برنامج إحالة المطورين (Refer-a-Developer Loop)</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-sans font-bold">
              مكافأة الطرفين: +2,500 كلمة
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            قم بنشر رابط الإحالة الخاص بك بين مطوري البرمجيات. عند تسجيل أي مطور جديد من خلال رابطك الفريد، سيحصل كِلاكما على <strong>2,500 كلمة إضافية</strong> مجانية في حساباتكما لمرة واحدة.
          </p>

          {/* Copyable referral code link */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Link2 className="text-teal-400 w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-mono text-slate-300 break-all select-all">
                {affiliateStats.referralLink}
              </span>
            </div>
            <button
              onClick={() => handleCopyLink(affiliateStats.referralLink, "referral")}
              className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 py-1.5 px-4 rounded border border-slate-700 flex items-center justify-center gap-1.5 font-sans w-full md:w-auto transition-all"
            >
              {copiedLink === "referral" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === "referral" ? "تم نسخ الرابط" : "نسخ الرابط الفريد"}</span>
            </button>
          </div>

          {/* Simulate Referrals Generator */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3.5 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <UserPlus className="text-teal-400 w-4 h-4" />
              <span>محاكاة تسجيل مطور جديد عبر رابطك (Sandbox Invite Link)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDevName}
                onChange={(e) => setNewDevName(e.target.value)}
                placeholder="مثال: يوسف خالد، DevSamir"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={handleSimulateReferral}
                disabled={!newDevName.trim()}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 text-slate-950 font-sans font-bold text-xs px-4 py-1.5 rounded-lg transition"
              >
                محاكاة تسجيل ناجح
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              * سيؤدي النقر على المحاكاة إلى تسجيل المطور في السجل وإضافة 2,500 كلمة إلى رصيد حسابك فوراً!
            </p>
          </div>

          {/* Referrals table list */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-slate-300 font-sans">سجل الإحالات الخاص بك ({referrals.length})</h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <th className="p-2.5 font-sans">المطور المحال</th>
                    <th className="p-2.5 font-sans">تاريخ التسجيل</th>
                    <th className="p-2.5 font-sans">الحالة</th>
                    <th className="p-2.5 font-sans">مكافأتك</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-900/40 text-slate-300 transition-colors">
                      <td className="p-2.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{ref.developerName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ref.email}</span>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-[11px]">{ref.date}</td>
                      <td className="p-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ref.status === "Registered" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {ref.status === "Registered" ? "مسجل ونشط" : ref.status}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-teal-400 font-mono">+{formatNumber(ref.wordsEarned)} كلمة</td>
                    </tr>
                  ))}
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500 font-sans">
                        لم يتم تسجيل أي مطور من خلال رابطك حتى الآن.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Right: Affiliate Dashboard (لوحة المسوقين والمؤثرين) */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="text-amber-400 w-5 h-5" />
              <h3 className="text-md font-semibold text-slate-100 font-sans">لوحة التسويق بالعمولة (Affiliate Program)</h3>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold font-sans">
              عمولة بنسبة 20%
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            احصل على عمولة دورية بنسبة <strong>20%</strong> مدى الحياة من قيمة الاشتراكات المدفوعة التي تتم عن طريق روابطك ومنشوراتك التقنية.
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
              <span className="text-[10px] text-slate-500 font-sans">عدد نقرات الرابط</span>
              <span className="text-sm font-mono font-bold text-slate-200 mt-1">
                {formatNumber(affiliateStats.clickCount)}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
              <span className="text-[10px] text-slate-500 font-sans">التسجيلات المجانية</span>
              <span className="text-sm font-mono font-bold text-slate-200 mt-1">
                {formatNumber(affiliateStats.signUps)}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
              <span className="text-[10px] text-slate-500 font-sans">الاشتراكات المدفوعة</span>
              <span className="text-sm font-mono font-bold text-teal-400 mt-1">
                {formatNumber(affiliateStats.conversions)} خطة
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col">
              <span className="text-[10px] text-slate-500 font-sans">أرباح معلقة للسحب</span>
              <span className="text-sm font-mono font-bold text-emerald-400 mt-1">
                ${affiliateStats.unpaidEarnings.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Simulator Controls */}
          <div className="border-t border-slate-850 pt-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300 font-sans">محاكي مبيعات الـ Affiliates (Simulator)</span>
            <button
              onClick={handleSimulateAffiliateSale}
              className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 py-1.5 px-3 rounded border border-slate-700 font-sans flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              محاكاة مبيعة مدفوعة جديدة (+$29.80 عمولة)
            </button>
          </div>

          {/* Payout controller */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-sans">إجمالي الأرباح المسحوبة:</span>
                <span className="text-md font-bold text-slate-200 font-mono">${affiliateStats.totalWithdrawn.toFixed(2)}</span>
              </div>
              <button
                disabled={affiliateStats.unpaidEarnings === 0}
                onClick={handleWithdrawEarnings}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-slate-900 disabled:opacity-40 text-emerald-400 text-xs py-1.5 px-4 rounded-lg font-bold border border-emerald-500/20 transition-all font-sans"
              >
                طلب سحب الأرباح الآن
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              * يتم معالجة طلبات سحب الأرباح فورياً وتلقائياً عبر Stripe Connect أو PayPal إلى حسابك البنكي.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
