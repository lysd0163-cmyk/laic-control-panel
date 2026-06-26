import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. API Endpoint: AI Translation & Cultural Guardrails
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang, tone, culturalContext, legalCompliance } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text to translate" });
    }

    const client = getGeminiClient();

    // Contextual instructions for high-fidelity translation
    const systemInstruction = `You are the core translation engine of Localization AI Control (L-AI-C), a highly secure enterprise-grade SaaS system.
Your mission is to localize software content (can be UI labels, long descriptions, or structured JSON) into the target language.

Target Language: ${targetLang}
Tone Preference: ${tone || "Professional"}
Cultural Adaptations for: ${culturalContext || "Standard Localization"}
Legal Compliance Checked: ${legalCompliance ? "Yes, ensure terms respect local legal terminology" : "No"}

Follow these guidelines strictly:
1. Provide accurate, natural, and highly contextual translations.
2. Filter/localize idioms to fit the target culture.
3. Keep structural markers, variable templates (like {name}, {{user}}, %s), and HTML tags untouched.
4. If the input is in JSON format, parse it and only translate the values, preserving the keys exactly as is.
5. Apply cultural firewalls: ensure the translated content respects cultural standards of the selected region (e.g., formal addressing in some regions, localized names or currencies if applicable).`;

    let resultText = "";
    let isMocked = false;

    if (client) {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Localize the following content:
${text}`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3,
        },
      });
      resultText = response.text || "";
    } else {
      // Return a simulated high-quality localization if Gemini is offline
      isMocked = true;
      const parsedText = typeof text === "string" ? text : JSON.stringify(text);
      
      // Basic translation simulations for common terms to show a live and immersive experience
      if (parsedText.toLowerCase().includes("welcome") || parsedText.includes("مرحباً") || parsedText.includes("أهلاً")) {
        resultText = targetLang === "Arabic" || targetLang === "العربية" 
          ? "مرحباً بكم في منصتنا. نحن نسعى لتوفير تجربة مستخدم مخصصة وآمنة تماماً."
          : `Welcome to our platform. We aim to provide a fully secure and personalized user experience in ${targetLang}.`;
      } else if (parsedText.toLowerCase().includes("pay") || parsedText.toLowerCase().includes("checkout")) {
        resultText = targetLang === "Arabic" || targetLang === "العربية"
          ? "الدفع الآمن - تمت معالجة معاملاتك وفقاً لمعايير الأمان العالمية والتوافق القانوني."
          : `Secure Payment - Your transaction has been processed in compliance with global security and legal standards in ${targetLang}.`;
      } else {
        // Generic high-quality mockup translation with an elegant translation effect
        resultText = `[ترجمة تجريبية - ${targetLang} (${tone})]
نص المصدر: "${parsedText.length > 50 ? parsedText.slice(0, 47) + "..." : parsedText}"
الضبط الثقافي: تم تفعيل حواجز الحماية والقوانين المحلية لـ ${culturalContext || "العالمية"}.`;
      }
    }

    // Calculate simulated stats
    const inputWords = typeof text === "string" ? text.split(/\s+/).filter(Boolean).length : JSON.stringify(text).split(/\s+/).filter(Boolean).length;
    const outputWords = resultText.split(/\s+/).filter(Boolean).length;
    const totalWordsCount = inputWords + outputWords;

    res.json({
      success: true,
      translation: resultText,
      stats: {
        inputWords,
        outputWords,
        totalWords: totalWordsCount,
        isMocked,
      },
    });
  } catch (error: any) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: error.message || "Internal server error during localization" });
  }
});

// 2. Vite Integration for Dev / Production Static Assets
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`L-AI-C Backend Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();
