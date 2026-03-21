import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { DoctorDashboard } from "@/types/analytics.types";

interface Props {
  apiData?: DoctorDashboard["effectiveness"] | null;
}

export default function EfficiencyStats({ apiData }: Props) {
  const successPercent = apiData?.success_percent ?? 0;
  const partialPercent = apiData?.partial_percent ?? 0;
  const redoPercent = apiData?.redo_percent ?? 0;
  const avgPercent = Math.round(successPercent * 1 + partialPercent * 0.5);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">Samaradorlik</CardTitle>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </CardHeader>
      <CardContent className="mt-4 flex flex-col justify-between h-full">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Muvaffaqiyatli</span>
              <span className="text-slate-800">{successPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2ECC71] rounded-full transition-all" style={{ width: `${successPercent}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Qisman</span>
              <span className="text-slate-800">{partialPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${partialPercent}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Qayta ishlash</span>
              <span className="text-slate-800">{redoPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${redoPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-baseline justify-between border-t pt-4">
          <span className="text-xs text-slate-500">O'rtacha</span>
          <span className="text-2xl font-bold text-emerald-500">{avgPercent}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
