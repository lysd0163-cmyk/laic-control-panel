import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Server, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  ShieldAlert, 
  Globe2, 
  Cpu, 
  HardDrive, 
  Clock, 
  Users,
  RefreshCw
} from "lucide-react";
import { formatNumber } from "../utils";

export default function AdminDashboard() {
  // Telemetry simulation states
  const [cpu, setCpu] = useState<number>(18.4);
  const [memory, setMemory] = useState<number>(44.2);
  const [latency, setLatency] = useState<number>(34);
  const [activeRequests, setActiveRequests] = useState<number>(14);
  const [requestHistory, setRequestHistory] = useState<number[]>([12, 15, 18, 14, 22, 19, 15, 17, 14, 20]);

  // Financial simulations
  const [mrr, setMrr] = useState<number>(24850);
  const [subscribers, setSubscribers] = useState<number>(168);
  const [fraudRate, setFraudRate] = useState<number>(0.04);

  // Tick simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // CPU fluctuations
      setCpu((prev) => {
        const delta = (Math.random() * 4 - 2);
        return Math.max(5, Math.min(95, parseFloat((prev + delta).toFixed(1))));
      });

      // Latency fluctuation
      setLatency((prev) => {
        const delta = Math.floor(Math.random() * 6 - 3);
        return Math.max(15, Math.min(120, prev + delta));
      });

      // Requests fluctuation
      setActiveRequests((prev) => {
        const delta = Math.floor(Math.random() * 4 - 2);
        const next = Math.max(2, Math.min(100, prev + delta));
        
        // Update history
        setRequestHistory((history) => {
          const nextHistory = [...history.slice(1), next];
          return nextHistory;
        });
        
        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateNewSub = () => {
    setMrr((prev) => prev + 149);
    setSubscribers((prev) => prev + 1);
  };

  const regionalData = [
    { name: "الشرق الأوسط (MENA)", count: 74, percentage: 44, color: "bg-teal-500" },
    { name: "أوروبا (Europe)", count: 42, percentage: 25, color: "bg-indigo-500" },
    { name: "أمريكا الشمالية (North America)", count: 32, percentage: 19, color: "bg-emerald-500" },
    { name: "آسيا والمحيط الهادئ (APAC)", count: 15, percentage: 9, color: "bg-amber-500" },
    { name: "أفريقيا جنوب الصحراء (Africa)", count: 5, percentage: 3, color: "bg-rose-500" }
  ];

  // SVG Chart Calculation Helpers
  const maxHistoryVal = Math.max(...requestHistory, 30);
  const chartWidth = 360;
  const chartHeight = 80;
  const points = requestHistory.map((val, idx) => {
    const x = (idx / (requestHistory.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxHistoryVal) * chartHeight + 10;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex flex-col gap-6" id="admin-root">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* MRR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-sans">الإيرادات الشهرية المتكررة (MRR)</span>
            <span className="text-lg font-bold text-emerald-400 font-mono mt-1">${formatNumber(mrr)}</span>
            <span className="text-[10px] text-emerald-500 font-sans mt-0.5">✓ نمو متسارع (+24%)</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Paid Subscribers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-sans">الشركات المشتركة النشطة</span>
            <span className="text-lg font-bold text-slate-100 font-mono mt-1">{subscribers} شركة</span>
            <button 
              onClick={handleSimulateNewSub}
              className="text-[9px] text-teal-400 hover:underline font-sans mt-1 text-right block"
            >
              + إضافة شركة جديدة يدوياً
            </button>
          </div>
          <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Global Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-sans">متوسط زمن الاستجابة العالمي</span>
            <span className="text-lg font-bold text-slate-100 font-mono mt-1">{latency}ms</span>
            <span className="text-[10px] text-slate-500 font-sans mt-0.5">توجيه ذكي عبر Edge Network</span>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Fraud rate blocked by stripe radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-sans">نسبة النزاعات والاحتيال</span>
            <span className="text-lg font-bold text-rose-400 font-mono mt-1">{fraudRate.toFixed(2)}%</span>
            <span className="text-[10px] text-slate-500 font-sans mt-0.5">آمن تماماً (مستهدف &lt; 0.5%)</span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Server Telemetry and live chart */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="text-teal-400 w-5 h-5" />
                <h3 className="text-md font-semibold text-slate-100 font-sans">مؤشرات أداء البنية التحتية والمخدمات (Telemetry)</h3>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                LIVE
              </span>
            </div>

            {/* Simulated Specs dials */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-sans">استهلاك المعالج CPU</span>
                  <Cpu className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <span className="text-md font-bold font-mono text-slate-200">{cpu}%</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${cpu}%` }} />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-sans">استهلاك الذاكرة RAM</span>
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-md font-bold font-mono text-slate-200">{memory}%</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${memory}%` }} />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-sans">الطلبات الفورية النشطة</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-md font-bold font-mono text-slate-200">{activeRequests} reqs</span>
                <span className="text-[9px] text-emerald-400 font-sans">صحة الخوادم: 100%</span>
              </div>
            </div>

            {/* Live Chart line: Pure SVG Chart */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300 font-sans">تاريخ معدل طلبات الـ API الفورية (Requests Timeline)</span>
              
              <div className="w-full h-24 mt-2 flex items-end relative overflow-hidden">
                <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight + 15}`} preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2.5"
                    points={points}
                  />
                  {requestHistory.map((val, idx) => {
                    const x = (idx / (requestHistory.length - 1)) * chartWidth;
                    const y = chartHeight - (val / maxHistoryVal) * chartHeight + 10;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#10b981"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-2 mt-1">
                <span>منذ 30 ثانية</span>
                <span>الآن</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right column: regional breakdown graph list */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe2 className="text-teal-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-200 font-sans">التوزيع الجغرافي للمشتركين (Regional Density)</h3>
            </div>

            <p className="text-xs text-slate-400 leading-normal font-sans">
              نسب استهلاك الكلمات والطلبات البرمجية حسب الإقليم الجغرافي للشركات المشتركة:
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              {regionalData.map((reg) => (
                <div key={reg.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 font-sans">{reg.name}</span>
                    <span className="font-mono text-slate-400">{reg.count} شركة ({reg.percentage}%)</span>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${reg.percentage}%` }}
                      className={`h-full rounded-full ${reg.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-center mt-2">
              <p className="text-[10px] text-slate-500 font-sans leading-normal">
                * يتم معالجة وتوجيه الطلبات تلقائياً إلى أقرب مركز بيانات لـ Cloud Run في منطقتي (europe-west2 / me-central1) لتأمين أفضل سرعة.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
