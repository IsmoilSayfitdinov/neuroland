import MentalAgeGauge from "./MentalAgeGauge";
import SkillRadarChart from "./SkillRadarChart";
import { Info } from "lucide-react";

export default function DiagnosticsSidebar() {
  return (
    <div className="space-y-6">
      <MentalAgeGauge />
      <SkillRadarChart />
      
      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-50 text-center">
        <h3 className="text-xl font-black text-slate-800 mb-1">-25 oy o'sish</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2023-11-15 dan beri</p>
      </div>

      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-blue-500" />
          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Hisoblash formulasi</h4>
        </div>
        
        <div className="bg-slate-100/50 p-3 rounded-xl mb-4 text-[10px] font-bold text-slate-500 italic">
          Aqliy yosh % = [Yig'ilgan ball / Maksimal ball] x 100
        </div>
        
        <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
          Har bir ko'nikma 3 yosh guruhida baholanadi. Natija xronologik yoshga nisbatan aqliy rivojlanish darajasini ko'rsatadi.
        </p>
      </div>
    </div>
  );
}
