import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Languages, 
  Sparkles, 
  HelpCircle, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Globe2, 
  Code2, 
  FileJson,
  Cpu,
  RefreshCw,
  Terminal
} from "lucide-react";
import { formatNumber } from "../utils";

interface LocalizationPlaygroundProps {
  onWordsTranslated: (words: number) => void;
  badgeActive: boolean;
  setBadgeActive: (active: boolean) => void;
  currentTier: string;
}

export default function LocalizationPlayground({ 
  onWordsTranslated, 
  badgeActive, 
  setBadgeActive,
  currentTier
}: LocalizationPlaygroundProps) {
  // Input states
  const [sourceText, setSourceText] = useState<string>(
    JSON.stringify({
      "welcome_message": "Welcome back to our enterprise hub! We protect your privacy.",
      "get_started_btn": "Get Started & Secure Account",
      "checkout_disclaimer": "By clicking check out, you agree to our GDPR terms and conditions."
    }, null, 2)
  );
  
  const [targetLang, setTargetLang] = useState<string>("Arabic");
  const [tone, setTone] = useState<string>("Professional");
  const [culturalContext, setCulturalContext] = useState<string>("GCC");
  const [legalCompliance, setLegalCompliance] = useState<boolean>(true);
  const [culturalFirewall, setCulturalFirewall] = useState<boolean>(true);
  
  // App response states
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [stats, setStats] = useState<{ inputWords: number; outputWords: number; totalWords: number; isMocked: boolean } | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Parse translation preview for the sandbox
  const [parsedPreview, setParsedPreview] = useState<Record<string, string>>({
    "welcome_message": "مرحباً بك مجدداً في مركز أعمالنا! نحن نحمي خصوصيتك بالكامل.",
    "get_started_btn": "ابدأ الآن وأمن حسابك",
    "checkout_disclaimer": "بالنقر على إتمام الدفع، فإنك توافق على الشروط والأحكام المتوافقة مع القوانين المحلية."
  });

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetLang,
          tone,
          culturalContext,
          legalCompliance
        })
      });
      const data = await response.json();
      if (data.success) {
        setTranslatedText(data.translation);
        setStats(data.stats);
        
        // Deduct/Track words
        onWordsTranslated(data.stats.totalWords);

        // Try to parse translated JSON to update sandbox preview
        try {
          const parsed = JSON.parse(data.translation);
          setParsedPreview(parsed);
        } catch (e) {
          // If plain text was translated, put it under a generic key
          setParsedPreview({
            "welcome_message": data.translation,
            "get_started_btn": targetLang === "Arabic" ? "ابدأ الآن" : "Get Started",
            "checkout_disclaimer": targetLang === "Arabic" ? "تطبق الشروط والأحكام" : "Terms apply"
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (type === "translation") {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // Quick preset templates
  const applyPreset = (type: "json" | "landing" | "alert") => {
    if (type === "json") {
      setSourceText(JSON.stringify({
        "app_title": "Enterprise Cloud Console",
        "action_delete": "Delete permanently",
        "billing_notice": "Your premium subscription will renew tomorrow automatically."
      }, null, 2));
    } else if (type === "landing") {
      setSourceText("Unlock your dynamic software potential with cloud localization automation. Connect your repository to deploy in 40+ countries safely.");
    } else {
      setSourceText("WARNING: Unauthorized access detected. IP has been logged for regulatory compliance.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="playground-root">
      {/* Left Column: Configuration & Inputs */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        
        {/* Core Localizer Interface */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Languages className="text-teal-400 w-5 h-5" />
              <h3 className="text-md font-semibold text-slate-100 font-sans">محرك التوطين الفوري (Localization Console)</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">
                Model: Gemini 3.5 Flash
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-sans">تطبيقات سريعة:</span>
            <button 
              onClick={() => applyPreset("json")}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono flex items-center gap-1"
            >
              <FileJson className="w-3 h-3 text-amber-400" />
              JSON UI
            </button>
            <button 
              onClick={() => applyPreset("landing")}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 font-sans"
            >
              نص دعائي
            </button>
            <button 
              onClick={() => applyPreset("alert")}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 font-sans"
            >
              تحذير أمني
            </button>
          </div>

          {/* Source Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>نص المصدر (Source Key-Value JSON or Plain Text)</span>
              <span className="text-[11px] text-slate-500 font-mono">UTF-8 Encoded</span>
            </label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full h-44 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
              placeholder="اكتب النص أو قم بلصق كود الترجمة هنا..."
            />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">اللغة المستهدفة</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-md p-2 focus:outline-none focus:border-teal-500"
              >
                <option value="Arabic">العربية (Arabic)</option>
                <option value="English">الإنجليزية (English)</option>
                <option value="French">الفرنسية (French)</option>
                <option value="Spanish">الإسبانية (Spanish)</option>
                <option value="Turkish">التركية (Turkish)</option>
                <option value="German">الألمانية (German)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">نبرة الصوت (Tone)</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-md p-2 focus:outline-none focus:border-teal-500"
              >
                <option value="Professional">مهني / رسمي (Professional)</option>
                <option value="Friendly">ودود / ترحيبي (Friendly)</option>
                <option value="Technical & Precise">تقني دقيق (Technical)</option>
                <option value="Creative & Bold">إبداعي / جريء (Creative)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">الإقليم الثقافي المستهدف</label>
              <select
                value={culturalContext}
                onChange={(e) => setCulturalContext(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-md p-2 focus:outline-none focus:border-teal-500"
              >
                <option value="GCC">الخليج العربي (Saudi/UAE Context)</option>
                <option value="North Africa">شمال أفريقيا (Egypt/Morocco Context)</option>
                <option value="Levant">بلاد الشام (Jordan/Lebanon Context)</option>
                <option value="Global Neutral">معايير حيادية عالمية (Global Neutral)</option>
              </select>
            </div>
          </div>

          {/* Security & Firewall toggles */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5 flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="text-emerald-400 w-4 h-4" />
              جدار الحماية الثقافي والقانوني (SaaS Localization Firewalls)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={culturalFirewall}
                  onChange={(e) => setCulturalFirewall(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-teal-500 focus:ring-teal-500/20 w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-300">جدار الحماية الثقافي</span>
                  <span className="text-[10px] text-slate-500">منع المصطلحات غير الملائمة محلياً تلقائياً</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalCompliance}
                  onChange={(e) => setLegalCompliance(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-teal-500 focus:ring-teal-500/20 w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-300">التوافق القانوني والسياسات</span>
                  <span className="text-[10px] text-slate-500">صياغة آمنة لشروط الـ GDPR والضرائب</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-sans font-bold text-sm py-2.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-200"
          >
            {isTranslating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري استدعاء الذكاء الاصطناعي وتطبيق الفلاتر...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توطين وترجمة فورية آمنة (Gemini AI Run)</span>
              </>
            )}
          </button>
        </div>

        {/* Translation Output */}
        {translatedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="text-teal-400 w-4 h-4" />
                مخرجات التوطين (Localized Code Output)
              </h4>
              <button
                onClick={() => handleCopy(translatedText, "translation")}
                className="text-[11px] hover:text-white bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded flex items-center gap-1 transition-all border border-slate-700"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedText ? "تم النسخ" : "نسخ الكود"}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-emerald-400 text-xs font-mono p-4 rounded-lg overflow-x-auto border border-slate-800 max-h-48">
              {translatedText}
            </pre>

            {/* AI Metering Details */}
            {stats && (
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 grid grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">كلمات المصدر</span>
                  <span className="text-xs font-semibold text-slate-300">{stats.inputWords} كلمة</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">كلمات المخرج</span>
                  <span className="text-xs font-semibold text-slate-300">{stats.outputWords} كلمة</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">حالة المفتاح والسرية</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {stats.isMocked ? "توطين محلي آمن" : "Gemini API"}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Right Column: Live App Simulator Preview */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="text-emerald-400 w-5 h-5" />
              <h3 className="text-md font-semibold text-slate-100 font-sans">محاكاة حية لموقع العميل (Live Site Preview)</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              SDK Render Mode
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            هذه لوحة محاكاة مباشرة لتطبيق شركتك بعد دمج حزمة الـ <code className="text-teal-400 font-mono">L-AI-C SDK</code>. يقرأ الـ SDK نصوص الموقع ويقوم بتوطينها تلقائياً باللغة والنبرة الصحيحة:
          </p>

          {/* Simulated Browser Frame */}
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            {/* Browser Header Bar */}
            <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
              </div>
              <div className="bg-slate-950 flex-1 mx-4 text-center py-1 rounded text-[10px] text-slate-400 font-mono select-none flex items-center justify-center gap-1 border border-slate-800/60">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                https://demo.mycompany.com
              </div>
            </div>

            {/* Mock Landing Page Body */}
            <div className="p-6 flex flex-col gap-6 bg-slate-950 text-slate-200 min-h-[260px] relative font-sans leading-normal">
              
              {/* Fake logo header */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider text-teal-400 font-mono">⚡️ SAAS_PRO</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {targetLang === "Arabic" ? "العربية" : targetLang}
                </span>
              </div>

              {/* Main Headline */}
              <div className="flex flex-col gap-2 text-center mt-3">
                <h4 className="text-md md:text-lg font-bold text-white tracking-tight leading-snug">
                  {parsedPreview.welcome_message}
                </h4>
              </div>

              {/* CTA and input button */}
              <div className="flex flex-col gap-2 items-center">
                <button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-[1.02] text-slate-950 font-bold text-xs py-2 px-6 rounded-md shadow-md transition duration-150">
                  {parsedPreview.get_started_btn}
                </button>
                <p className="text-[9px] text-slate-500 text-center max-w-xs mt-1">
                  {parsedPreview.checkout_disclaimer}
                </p>
              </div>

              {/* Powered by L-AI-C Badge - Crucial viral element */}
              <div className="mt-auto border-t border-slate-900 pt-3 flex items-center justify-between">
                <span className="text-[9px] text-slate-600">© 2026 SaaS Pro Inc.</span>
                
                {badgeActive ? (
                  <motion.div 
                    layoutId="viral-badge"
                    className="flex items-center gap-1.5 text-[9px] bg-teal-950/60 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-sans shadow"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-teal-400" />
                    <span>توطين بواسطة <strong className="font-bold font-mono">L-AI-C</strong></span>
                  </motion.div>
                ) : (
                  <span className="text-[9px] text-slate-700">لا يوجد شعار</span>
                )}
              </div>

            </div>
          </div>

          {/* Badge viral incentive control */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">مكافأة الشعار الفيروسي (Growth Hack)</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                +1,000 كلمة/الشهر
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              ضع شعار التوطين الذكي في موقعك، وسيقوم نظامنا بقراءة تفعيل الشعار تلقائياً وزيادة باقتك الشهرية فوراً.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setBadgeActive(!badgeActive)}
                className={`flex-1 text-xs py-1.5 px-3 rounded-lg font-bold border transition ${
                  badgeActive 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" 
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {badgeActive ? "شعار L-AI-C مفعل بموقعك (تعطيل)" : "تفعيل الشعار بموقعك الآن"}
              </button>
            </div>
          </div>

          {/* Embed snippet code blocks */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">كود تضمين الشعار (Embed Snippet)</span>
              <button
                onClick={() => handleCopy(`<div id="laic-badge" data-key="laic_badge_129"></div>\n<script src="${window.location.origin}/sdk/laic-badge.js" defer></script>`, "embed-code")}
                className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-1 font-sans"
              >
                {copiedCode === "embed-code" ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                {copiedCode === "embed-code" ? "تم نسخ كود التضمين" : "نسخ كود الشعار"}
              </button>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800 overflow-x-auto">
              {`<div id="laic-badge" data-key="laic_badge_129"></div>
<script src="${window.location.origin}/sdk/laic-badge.js" defer></script>`}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
