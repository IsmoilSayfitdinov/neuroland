import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";

export default function EfficiencyStats() {
  const { data: results, isLoading } = useQuery({
    queryKey: ["diagnostics-results-all"],
    queryFn: () => DiagnosticsAPI.getResults(),
  });

  // Aggregate scores from all diagnostic results
  let successPercent = 0;
  let partialPercent = 0;
  let failPercent = 0;
  let avgPercent = 0;

  if (results?.length) {
    let totalAnswers = 0;
    let success = 0;
    let partial = 0;
    let fail = 0;

    for (const result of results) {
      for (const ans of result.answers) {
        totalAnswers++;
        if (ans.score >= 1.0) success++;
        else if (ans.score >= 0.5) partial++;
        else fail++;
      }
    }

    if (totalAnswers > 0) {
      successPercent = Math.round((success / totalAnswers) * 100);
      partialPercent = Math.round((partial / totalAnswers) * 100);
      failPercent = Math.round((fail / totalAnswers) * 100);
      avgPercent = Math.round(((success * 100 + partial * 50) / totalAnswers));
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">Samaradorlik</CardTitle>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </CardHeader>
      <CardContent className="mt-4 flex flex-col justify-between h-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
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
                  <span className="text-slate-800">{failPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${failPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-baseline justify-between border-t pt-4">
              <span className="text-xs text-slate-500">O'rtacha</span>
              <span className="text-2xl font-bold text-emerald-500">{avgPercent}%</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
