import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AIPlanProgress() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Al Reja bo'yicha o'zlashtirish</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        {/* Progress Circle Chart (Simplified with SVG) */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="#F1F5F9"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="#2ECC71"
            strokeWidth="12"
            fill="none"
            strokeDasharray="502.6"
            strokeDashoffset={502.6 * (1 - 0.70)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-800">70%</span>
          <span className="text-xs text-slate-500 font-medium">Bajarildi</span>
        </div>
      </div>

      <div className="bg-[#2ECC71]/14 rounded-2xl p-4 mb-6 w-full">
        <p className="text-xs text-emerald-800 leading-relaxed">
          AI bashorat qilgan natijaga <span className="font-bold text-[#2ECC71]">92%</span> muvofiqlik
        </p>
      </div>

      <Button className="w-full bg-[#2ECC71] hover:bg-emerald-600 h-12 rounded-xl text-white font-semibold">
        To'liq hisobotni ko'rish
      </Button>
    </Card>
  );
}
