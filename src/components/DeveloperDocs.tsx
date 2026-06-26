import { useState } from "react";
import { motion } from "motion/react";
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

export default function DeveloperDocs() {
  const [activeTab, setActiveTab] = useState<string>("js-sdk");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const jsSdkCode = `/**
 * L-AI-C (Localization AI Control) JavaScript SDK
 * Version: 1.0.2-stable
 * Enterprise Compliance: GDPR & Zero Data Retention Active
 */

class LAICLocalizer {
  constructor(config = {}) {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || "https://api.l-ai-c.com/v1/translate";
    this.targetLang = config.targetLang || "Arabic";
    this.tone = config.tone || "Professional";
    this.culturalContext = config.culturalContext || "GCC";
    this.legalCompliance = config.legalCompliance !== false;
  }

  /**
   * Translates a text string or a JSON object securely
   */
  async localize(content) {
    if (!this.apiKey) {
      throw new Error("L-AI-C SDK Error: API Key is required.");
    }

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": \`Bearer \${this.apiKey}\`,
          "X-LAIC-Origin": window.location.origin
        },
        body: JSON.stringify({
          text: content,
          targetLang: this.targetLang,
          tone: this.tone,
          culturalContext: this.culturalContext,
          legalCompliance: this.legalCompliance
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to localize content");
      }

      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error("[L-AI-C SDK] Error during dynamic localization:", error);
      // Return fallback original content if API fails
      return content;
    }
  }
}

// Global Export
window.LAICLocalizer = LAICLocalizer;`;

  const reactSdkCode = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { LAICLocalizer } from '@laic/sdk-js';

const LAICContext = createContext(null);

export const LAICProvider = ({ children, apiKey, config }) => {
  const [localizer, setLocalizer] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sdkInstance = new LAICLocalizer({
      apiKey,
      ...config
    });
    setLocalizer(sdkInstance);
    setIsReady(true);
  }, [apiKey, config]);

  return (
    <LAICContext.Provider value={{ localizer, isReady }}>
      {children}
    </LAICContext.Provider>
  );
};

export const useLAIC = () => {
  const context = useContext(LAICContext);
  if (!context) {
    throw new Error("useLAIC must be used within a LAICProvider");
  }
  return context;
};

// Custom Localization component to swap strings on-the-fly
export const LocalizedText = ({ children }) => {
  const { localizer, isReady } = useLAIC();
  const [localized, setLocalized] = useState(children);

  useEffect(() => {
    if (isReady && localizer) {
      localizer.localize(children).then(setLocalized);
    }
  }, [children, localizer, isReady]);

  return <>{localized}</>;
};`;

  const curlCode = `curl -X POST "https://api.l-ai-c.com/v1/translate" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer laic_live_your_scoped_api_key" \\
  -d '{
    "text": {
      "welcome_headline": "Welcome back to SaaS Pro Console",
      "action_save": "Save changes"
    },
    "targetLang": "Arabic",
    "tone": "Professional",
    "culturalContext": "GCC",
    "legalCompliance": true
  }'`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col gap-5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-teal-400 w-5 h-5" />
          <h3 className="text-md font-bold text-slate-100 font-sans">وثائق المطورين وتكامل الـ SDK (Developer Integration Console)</h3>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">
          SDK Version 1.0.2 Stable
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-sans">
        تتيح حزمة الـ <code className="text-teal-400 font-mono">L-AI-C SDK</code> لشركتك توطين صفحات الويب وتطبيقات الهاتف تلقائياً بلحظة تحميل الصفحة. يقرأ الـ SDK نصوص الواجهة ويربطها بخوادمنا الحوسبية الآمنة لتطبيق الذكاء الاصطناعي والجدران الثقافية فوراً.
      </p>

      {/* Docs Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("js-sdk")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition font-sans ${
            activeTab === "js-sdk" 
              ? "border-teal-500 text-teal-400" 
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          حزمة JavaScript SDK
        </button>
        <button
          onClick={() => setActiveTab("react-sdk")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition font-sans ${
            activeTab === "react-sdk" 
              ? "border-teal-500 text-teal-400" 
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          مكونات React Integration
        </button>
        <button
          onClick={() => setActiveTab("curl-api")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition font-mono ${
            activeTab === "curl-api" 
              ? "border-teal-500 text-teal-400" 
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          cURL API Endpoint
        </button>
      </div>

      {/* Tab Content rendering codeblocks */}
      <div className="relative">
        {activeTab === "js-sdk" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans">كود حزمة الجافا سكربت الكاملة (Vanilla JS SDK Class):</span>
              <button
                onClick={() => handleCopy(jsSdkCode, "js-sdk-copy")}
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-sans"
              >
                {copiedSection === "js-sdk-copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === "js-sdk-copy" ? "تم نسخ الكود" : "نسخ الكود"}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto max-h-96">
              {jsSdkCode}
            </pre>
          </div>
        )}

        {activeTab === "react-sdk" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans">تكامل الـ Context والـ Wrapper لمطوري React:</span>
              <button
                onClick={() => handleCopy(reactSdkCode, "react-sdk-copy")}
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-sans"
              >
                {copiedSection === "react-sdk-copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === "react-sdk-copy" ? "تم نسخ الكود" : "نسخ الكود"}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto max-h-96">
              {reactSdkCode}
            </pre>
          </div>
        )}

        {activeTab === "curl-api" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans">استدعاء مباشر للمحرك عبر cURL:</span>
              <button
                onClick={() => handleCopy(curlCode, "curl-copy")}
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-sans"
              >
                {copiedSection === "curl-copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === "curl-copy" ? "تم نسخ الكود" : "نسخ الكود"}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto max-h-96">
              {curlCode}
            </pre>
          </div>
        )}
      </div>

      {/* Guide details panel */}
      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
          <ShieldCheck className="text-emerald-400 w-4 h-4" />
          قواعد حماية CORS وفحص المجال التلقائي
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          عند استدعاء خوادم <strong className="font-mono">L-AI-C</strong>، يقوم جدار حماية الشبكة بفحص الرويسة (Origin) الخاصة بمتصفح المستخدم ومقارنتها بقائمة المجالات المسموح بها والمربوطة بمفتاح الـ API. إذا لم يتطابق النطاق، فسيتم حظر الطلب تلقائياً لحمايتك من الاختراق وسرقة رصيدك من الكلمات.
        </p>
      </div>

    </div>
  );
}
