import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function EfficiencyStats() {
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
              <span className="text-slate-800">75%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2ECC71] rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Qisman</span>
              <span className="text-slate-800">20%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Qayta ishlash</span>
              <span className="text-slate-800">5%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '5%' }} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-baseline justify-between border-t pt-4">
          <span className="text-xs text-slate-500">O'rtacha</span>
          <span className="text-2xl font-bold text-emerald-500">88%</span>
        </div>
      </CardContent>
    </Card>
  );
}
