import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import type { DoctorDashboard } from "@/types/analytics.types";

interface Props {
  apiData?: DoctorDashboard["ai_plan"] | null;
}

export default function AIPlanProgress({ apiData }: Props) {
  const navigate = useNavigate();
  const progressPercent = apiData?.completion_percent ?? 0;
  const offset = 502.6 * (1 - progressPercent / 100);

  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6">AI Reja bo'yicha o'zlashtirish</h3>

      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="80" stroke="#F1F5F9" strokeWidth="12" fill="none" />
          <circle cx="96" cy="96" r="80" stroke="#2ECC71" strokeWidth="12" fill="none"
            strokeDasharray="502.6" strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-800">{progressPercent}%</span>
          <span className="text-xs text-slate-500 font-medium">Bajarildi</span>
        </div>
      </div>

      <div className="bg-[#2ECC71]/14 rounded-2xl p-4 mb-6 w-full">
        <p className="text-xs text-emerald-800 leading-relaxed">
          {apiData ? `${apiData.mastered_items}/${apiData.total_items} ta mashq o'zlashtirildi · AI aniqligi: ${apiData.ai_accuracy}%` : "AI reja hali yaratilmagan"}
        </p>
      </div>

      <Button onClick={() => navigate({ to: "/specialist/ai-plan" })}
        className="w-full bg-[#2ECC71] hover:bg-emerald-600 h-12 rounded-xl text-white font-semibold">
        To'liq hisobotni ko'rish
      </Button>
    </Card>
  );
}
