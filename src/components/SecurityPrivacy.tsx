import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Key, 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Zap, 
  AlertOctagon, 
  Eye, 
  EyeOff,
  Database,
  Lock,
  Wifi,
  Activity
} from "lucide-react";
import { ScopedApiKey } from "../types";
import { generateMockApiKey, formatNumber } from "../utils";

interface SecurityPrivacyProps {
  apiKeys: ScopedApiKey[];
  onAddApiKey: (newKey: ScopedApiKey) => void;
  onRevokeApiKey: (id: string) => void;
}

export default function SecurityPrivacy({ 
  apiKeys, 
  onAddApiKey, 
  onRevokeApiKey 
}: SecurityPrivacyProps) {
  const [newKeyLabel, setNewKeyLabel] = useState<string>("");
  const [newKeyDomain, setNewKeyDomain] = useState<string>("");
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  
  // Simulated stats
  const [cloudflareActive, setCloudflareActive] = useState<boolean>(true);
  const [stripeRadarLevel, setStripeRadarLevel] = useState<string>("HIGH");
  const [blockedRequests, setBlockedRequests] = useState<number>(1420);

  const handleCreateKey = (e: FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel.trim() || !newKeyDomain.trim()) return;

    const keyString = generateMockApiKey(newKeyLabel);
    const newKey: ScopedApiKey = {
      id: Math.random().toString(36).substring(7),
      key: keyString,
      label: newKeyLabel,
      allowedDomain: newKeyDomain,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Active"
    };

    onAddApiKey(newKey);
    setNewKeyLabel("");
    setNewKeyDomain("");
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  const handleSimulateAttack = () => {
    setBlockedRequests((prev) => prev + Math.floor(Math.random() * 50) + 10);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Scoped API Keys Management */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Key className="text-teal-400 w-5 h-5" />
              <h3 className="text-md font-semibold text-slate-100 font-sans">إدارة مفاتيح الـ API المقيدة (Scoped API Keys)</h3>
            </div>
            <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">
              CORS Protection Enabled
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            قم بتوليد مفاتيح برمجية مقيدة للـ SDK. لن تعمل هذه المفاتيح إلا من خلال النطاقات (Domains) المحددة فقط لمنع استهلاك رصيدك البرمجي من مواقع أخرى غير مصرح لها.
          </p>

          {/* Form to generate new Key */}
          <form onSubmit={handleCreateKey} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300 font-sans">إنشاء مفتاح API جديد</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-400">اسم المرجع (Label)</label>
                <input 
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="مثال: موقع المتجر الإلكتروني الرئيسي"
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-sans"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-400">النطاق المسموح به (Allowed Origin)</label>
                <input 
                  type="text"
                  value={newKeyDomain}
                  onChange={(e) => setNewKeyDomain(e.target.value)}
                  placeholder="https://mycompany.com"
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              <span>توليد مفتاح API آمن</span>
            </button>
          </form>

          {/* Key list table */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300 font-sans">المفاتيح البرمجية النشطة</span>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <th className="p-3 font-sans">الوصف والملصق</th>
                    <th className="p-3 font-sans">مفتاح API</th>
                    <th className="p-3 font-sans">النطاق المسموح</th>
                    <th className="p-3 text-center font-sans">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-900/40 text-slate-300 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200 font-sans">{k.label}</span>
                          <span className="text-[10px] text-slate-500 font-mono">تاريخ الإنشاء: {k.createdAt}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {visibleKeyId === k.id ? k.key : `${k.key.slice(0, 10)}...••••••••`}
                          </span>
                          <button 
                            onClick={() => toggleKeyVisibility(k.id)}
                            className="text-slate-500 hover:text-slate-300"
                          >
                            {visibleKeyId === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-teal-400">{k.allowedDomain}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onRevokeApiKey(k.id)}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1 rounded transition"
                          title="إلغاء المفتاح"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {apiKeys.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500 font-sans">
                        لا توجد مفاتيح API نشطة حالياً. قم بإنشاء مفتاح لتشغيل الـ SDK.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Right: AI Zero Retention Policy & Security Status */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        
        {/* Enterprise Compliance Guard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="text-emerald-400 w-5 h-5" />
            <h3 className="text-md font-semibold text-slate-100 font-sans">امتثال الذكاء الاصطناعي (AI Compliance)</h3>
          </div>

          <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Lock className="text-emerald-400 w-4 h-4" />
              <span className="text-xs font-bold text-emerald-400 font-sans">سياسة عدم حفظ البيانات (Zero Data Retention)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              يتم إرسال النصوص البرمجية إلى نماذج <strong className="font-mono">Gemini (Google)</strong> عبر واجهات مخصصة تضمن تفعيل خيار حماية الخصوصية المطلق. <strong>لن يتم استخدام أي نص أو كود من برمجيات عملائنا لأجل تدريب النماذج العامة</strong>.
            </p>
          </div>

          {/* Encryption Standards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center gap-3">
              <Lock className="text-teal-400 w-4 h-4 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-sans">تشفير البيانات</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 font-sans">AES-256 Bit</span>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center gap-3">
              <Database className="text-teal-400 w-4 h-4 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-sans">أمان قاعدة البيانات</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 font-sans">Row-Level (RLS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DDoS & Anti-Fraud dashboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="text-amber-400 w-5 h-5" />
              <h3 className="text-md font-semibold text-slate-100 font-sans">أنظمة التصدي للاحتيال و DDoS</h3>
            </div>
          </div>

          {/* Cloudflare Controller */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 font-sans">حماية Cloudflare Enterprise WAF</span>
              <button
                onClick={() => setCloudflareActive(!cloudflareActive)}
                className={`text-[10px] px-2 py-0.5 rounded font-bold font-sans transition ${
                  cloudflareActive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {cloudflareActive ? "درع الحماية نشط" : "غير نشط"}
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>تصفية هجمات حجب الخدمة (DDoS Shield)</span>
              <span className="text-slate-300 font-mono">100% Uptime Guarantee</span>
            </div>
          </div>

          {/* Stripe Radar Controller */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 font-sans">الذكاء الاصطناعي Stripe Radar</span>
              <select
                value={stripeRadarLevel}
                onChange={(e) => setStripeRadarLevel(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300 p-1"
              >
                <option value="MAX">الحد الأقصى للتصدي (Max Blocking)</option>
                <option value="HIGH">حماية قياسية ذكية (High Protection)</option>
                <option value="NORMAL">تصفية أساسية (Standard)</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              * إيقاف فوري للبطاقات المسروقة لمنع عمليات رد الأموال الاحتيالية (Chargeback Prevention).
            </p>
          </div>

          {/* Live request blocking stat */}
          <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-sans">الطلبات الضارة والـ Bot المحجوبة (24h)</span>
              <span className="text-sm font-bold text-rose-400 font-mono mt-0.5">{formatNumber(blockedRequests)} طلب</span>
            </div>
            <button
              onClick={handleSimulateAttack}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] py-1 px-3 rounded border border-rose-500/20 transition-all font-sans"
            >
              محاكاة تصدي لهجوم بوتات
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
