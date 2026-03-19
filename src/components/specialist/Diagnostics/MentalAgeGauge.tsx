import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MentalAgeGaugeProps {
  percentage: number;
  totalScore: number;
  maxScore: number;
  mentalMonths: number;
  chronoMonths: number;
  diff: number;
}

export default function MentalAgeGauge({
  percentage,
  totalScore,
  maxScore,
  mentalMonths,
  chronoMonths,
  diff,
}: MentalAgeGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const gaugeColor = percentage >= 70 ? "#22C55E" : percentage >= 40 ? "#F59E0B" : "#EF4444";
  const mentalPct = chronoMonths > 0 ? Math.round((mentalMonths / chronoMonths) * 100) : 0;

  return (
    <Card className="shadow-sm border-slate-100 rounded-2xl">
      <CardHeader className="flex flex-row items-center border-b border-slate-50 pb-4">
        <CardTitle className="text-sm font-bold text-slate-800">Aqliy yosh natijasi</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="relative flex flex-col items-center justify-center mb-8">
          <svg className="w-48 h-48 -rotate-90">
            <circle cx="96" cy="96" r={radius} stroke="#F1F5F9" strokeWidth="12" fill="none" />
            <circle
              cx="96" cy="96" r={radius}
              stroke="#D1D5DB" strokeWidth="12" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - 0.75 * circumference}
              strokeLinecap="round" className="opacity-20"
            />
            <circle
              cx="96" cy="96" r={radius}
              stroke={gaugeColor} strokeWidth="12" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aqliy yosh</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Yig'ilgan ball</span>
            <span className="font-bold text-slate-800">{totalScore.toFixed(1)} / {maxScore.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Aqliy yosh</span>
            <span className="font-bold text-slate-800">{mentalMonths} oy</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Xronologik yosh</span>
            <span className="font-bold text-slate-800">{chronoMonths} oy</span>
          </div>

          <div className={`${diff < 0 ? "bg-red-50" : "bg-emerald-50"} rounded-xl p-3 flex justify-between items-center`}>
            <span className={`text-xs font-bold ${diff < 0 ? "text-red-400" : "text-emerald-400"}`}>Farq</span>
            <span className={`text-xs font-bold ${diff < 0 ? "text-red-600" : "text-emerald-600"}`}>
              {diff > 0 ? "+" : ""}{diff} oy
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Aqliy</span>
              <span>Xronologik</span>
            </div>
            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-500" style={{ width: `${mentalPct}%` }} />
              <div className="h-full bg-blue-400" style={{ width: `${100 - mentalPct}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
