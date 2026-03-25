import { useState } from "react";
import MentalAgeGauge from "./MentalAgeGauge";
import SkillRadarChart from "./SkillRadarChart";
import { Info, Loader2, Calendar, FileText, Sparkles, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import { ChildrenAPI } from "@/api/children.api";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { DiagnosticResult } from "@/types/diagnostics.types";

export interface DiagnosticsSidebarProps {
  childId: number | null;
  /** Called when user selects a saved result to view its scores in the main area */
  onSelectResult?: (result: DiagnosticResult) => void;
  /** Currently selected result ID */
  selectedResultId?: number | null;
}

function scoreLabel(score: number): { label: string; cls: string; dot: string } {
  if (score >= 1) return { label: "Mustaqil", cls: "text-emerald-600", dot: "bg-emerald-500" };
  if (score >= 0.5) return { label: "Yordam bilan", cls: "text-amber-600", dot: "bg-amber-400" };
  return { label: "Bajarmadi", cls: "text-red-500", dot: "bg-red-400" };
}

function ResultCard({
  result,
  defaultOpen,
  isSelected,
  onSelect,
}: {
  result: DiagnosticResult;
  defaultOpen?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  const answers = result.answers ?? [];
  const answersCount = answers.length;
  const completedCount = answers.filter((a) => a.score >= 1).length;
  const partialCount = answers.filter((a) => a.score === 0.5).length;
  const failedCount = answers.filter((a) => a.score === 0).length;
  const pct = answersCount > 0 ? Math.round((completedCount / answersCount) * 100) : 0;

  // Group by section
  const sectionMap = new Map<string, typeof answers>();
  for (const a of answers) {
    if (!sectionMap.has(a.section_name)) sectionMap.set(a.section_name, []);
    sectionMap.get(a.section_name)!.push(a);
  }

  return (
    <div className={cn("border-b border-gray-50 last:border-b-0", isSelected && "bg-blue-50/50")}>
      <div className="px-5 py-3">
        {/* Header row */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full hover:opacity-80 transition-opacity text-left"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#9EB1D4]" />
              <span className="text-[12px] font-bold text-[#2D3142]">{formatDate(result.date)}</span>
              {isSelected && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">Tanlangan</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#2D3142]">{pct}%</span>
              {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#9EB1D4]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#9EB1D4]" />}
            </div>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                pct >= 70 ? "bg-emerald-400" : pct >= 40 ? "bg-amber-400" : "bg-red-400"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-emerald-600">{completedCount} mustaqil</span>
            <span className="text-[10px] font-bold text-amber-600">{partialCount} yordam</span>
            <span className="text-[10px] font-bold text-red-500">{failedCount} bajarmadi</span>
          </div>
        </button>

        {/* Select button */}
        {onSelect && (
          <button
            onClick={onSelect}
            className={cn(
              "mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-colors",
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-[#2D3142] hover:bg-blue-50 hover:text-blue-600"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            {isSelected ? "Ko'rsatilmoqda" : "Diagnostikada ko'rsatish"}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="px-5 pb-4 space-y-3">
          {result.comment && (
            <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
              <p className="text-[10px] text-blue-700 leading-relaxed">{result.comment}</p>
            </div>
          )}

          {Array.from(sectionMap.entries()).map(([section, sectionAnswers]) => (
            <div key={section}>
              <p className="text-[10px] font-bold text-[#9EB1D4] uppercase tracking-wider mb-1.5">{section}</p>
              <div className="space-y-1">
                {sectionAnswers.map((a, i) => {
                  const s = scoreLabel(a.score);
                  return (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
                        <span className="text-[11px] text-[#2D3142] truncate">{a.exercise_name}</span>
                      </div>
                      <span className={cn("text-[10px] font-bold shrink-0 ml-2", s.cls)}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiagnosticsSidebar({ childId, onSelectResult, selectedResultId }: DiagnosticsSidebarProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { mutate: generateAI, isPending: isGenerating } = useMutation({
    mutationFn: (id: number) => DiagnosticsAPI.generateAI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostics-results", childId] });
      queryClient.invalidateQueries({ queryKey: ["diagnostics", "results", childId] });
      queryClient.invalidateQueries({ queryKey: ["doctor-patient-diagnostics", childId] });
      toast.success("AI tahlil muvaffaqiyatli generatsiya qilindi!");
      if (childId) {
        navigate({ to: `/specialist/patients/${childId}` });
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "AI tahlil generatsiya qilishda xatolik");
    },
  });

  const latestResult = results?.length ? results[results.length - 1] : null;
  const previousResult = results && results.length > 1 ? results[results.length - 2] : null;

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

  const totalScore = latestResult?.answers?.reduce((acc, a) => acc + a.score, 0) ?? 0;
  const maxScore = (latestResult?.answers?.length ?? 0) * 1.0;
  const mentalPercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const chronoMonths = child?.birth_date
    ? Math.floor((Date.now() - new Date(child.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : 0;
  const mentalMonths = Math.round((mentalPercent / 100) * chronoMonths);
  const diffMonths = mentalMonths - chronoMonths;

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

  const hasResults = (results?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Saved results list */}
      {hasResults && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h4 className="text-[13px] font-bold text-[#2D3142]">Saqlangan natijalar</h4>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              {results!.length} ta
            </span>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {[...results!].reverse().map((result, i) => (
              <ResultCard
                key={result.id}
                result={result}
                defaultOpen={i === 0}
                isSelected={selectedResultId === result.id}
                onSelect={onSelectResult ? () => onSelectResult(result) : undefined}
              />
            ))}
          </div>
        </div>
      )}

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

      {/* Yakunlash button */}
      {hasResults && (
        <button
          onClick={() => generateAI(childId)}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-[14px] font-bold rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI tahlil generatsiya qilinmoqda...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Yakunlash va AI tahlil
            </>
          )}
        </button>
      )}
    </div>
  );
}
