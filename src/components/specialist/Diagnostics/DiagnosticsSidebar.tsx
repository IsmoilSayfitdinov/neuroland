import MentalAgeGauge from "./MentalAgeGauge";
import SkillRadarChart from "./SkillRadarChart";
import { Info, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import { ChildrenAPI } from "@/api/children.api";

interface DiagnosticsSidebarProps {
  childId: number | null;
}

export default function DiagnosticsSidebar({ childId }: DiagnosticsSidebarProps) {
  const { data: child } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => ChildrenAPI.getById(childId!, true),
    enabled: !!childId,
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["diagnostics-results", childId],
    queryFn: () => DiagnosticsAPI.getResults({ child_id: childId! }),
    enabled: !!childId,
  });

  const latestResult = results?.length ? results[results.length - 1] : null;
  const previousResult = results && results.length > 1 ? results[results.length - 2] : null;

  // Compute scores by section
  const computeScores = (result: typeof latestResult) => {
    if (!result?.answers?.length) return {};
    const map: Record<string, { total: number; count: number }> = {};
    result.answers.forEach((a) => {
      if (!map[a.section_name]) map[a.section_name] = { total: 0, count: 0 };
      map[a.section_name].total += a.score;
      map[a.section_name].count += 1;
    });
    return map;
  };

  const currentScores = computeScores(latestResult);

  // Mental age calculation
  const totalScore = latestResult?.answers?.reduce((acc, a) => acc + a.score, 0) ?? 0;
  const maxScore = (latestResult?.answers?.length ?? 0) * 1.0;
  const mentalPercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Chronological age in months
  const chronoMonths = child?.birth_date
    ? Math.floor((Date.now() - new Date(child.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : 0;
  const mentalMonths = Math.round((mentalPercent / 100) * chronoMonths);
  const diffMonths = mentalMonths - chronoMonths;

  // First result date
  const firstResultDate = results?.length ? results[0].date : null;

  if (!childId) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-400 font-medium">Bolani tanlang</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MentalAgeGauge
        percentage={mentalPercent}
        totalScore={totalScore}
        maxScore={maxScore}
        mentalMonths={mentalMonths}
        chronoMonths={chronoMonths}
        diff={diffMonths}
      />
      <SkillRadarChart
        currentScores={currentScores}
        previousResult={previousResult}
      />

      {firstResultDate && diffMonths !== 0 && (
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-50 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">{diffMonths} oy o'sish</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {new Date(firstResultDate).toLocaleDateString("uz-UZ")} dan beri
          </p>
        </div>
      )}

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
