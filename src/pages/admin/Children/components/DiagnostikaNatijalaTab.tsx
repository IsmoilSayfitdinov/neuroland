import { useQuery } from "@tanstack/react-query";
import type { ChildDetailOut } from "@/types/children.types";
import { cn, formatDate } from "@/lib/utils";
import { useExams } from "@/hooks/specialist/useExams";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import { AnalyticsAPI } from "@/api/analytics.api";
import { Brain, Loader2, TrendingUp, TrendingDown, BarChart3, Info, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Props {
  child: ChildDetailOut;
}

const SECTION_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  "Nutq rivojlanishi":   { bar: "bg-blue-500",    bg: "bg-blue-50",    text: "text-blue-600" },
  "Motorika":            { bar: "bg-emerald-500",  bg: "bg-emerald-50",  text: "text-emerald-600" },
  "Mayda Motorika":      { bar: "bg-teal-500",     bg: "bg-teal-50",     text: "text-teal-600" },
  "Yirik Motorika":      { bar: "bg-green-500",    bg: "bg-green-50",    text: "text-green-600" },
  "Kognitiv rivojlanish":{ bar: "bg-purple-500",   bg: "bg-purple-50",   text: "text-purple-600" },
  "Sensor holat":        { bar: "bg-amber-500",    bg: "bg-amber-50",    text: "text-amber-600" },
  "Ijtimoiy ko'nikmalar":{ bar: "bg-pink-500",    bg: "bg-pink-50",    text: "text-pink-600" },
  "O'z-o'ziga xizmat":  { bar: "bg-orange-500",   bg: "bg-orange-50",   text: "text-orange-600" },
};

const getColor = (section: string) =>
  SECTION_COLORS[section] ?? { bar: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-600" };

function scoreStatus(score: number): { label: string; cls: string } {
  if (score >= 1)   return { label: "Yaxshi",   cls: "bg-emerald-50 text-emerald-600" };
  if (score >= 0.5) return { label: "O'rtacha",  cls: "bg-amber-50 text-amber-600" };
  return               { label: "Past",     cls: "bg-red-50 text-red-500" };
}

export function DiagnostikaNatijalaTab({ child }: Props) {
  const { useResultsByChild, useGenerateAI } = useDiagnostics();
  const { data: diagnosticResults, isLoading: resultsLoading } = useResultsByChild(child.id);
  const { useResultsList } = useExams();
  const { data: examResults, isLoading: examsLoading } = useResultsList({ child_id: child.id });
  const generateAI = useGenerateAI();

  // Analytics API — radar + mental age
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["doctor-patient-diagnostics", child.id],
    queryFn: () => AnalyticsAPI.getDoctorPatientDiagnostics(child.id),
  });

  // Diagnostika — grouped by section (for table view)
  const sectionMap = new Map<string, { exercise_name: string; score: number; date: string }[]>();
  for (const result of diagnosticResults ?? []) {
    for (const answer of result.answers ?? []) {
      if (!sectionMap.has(answer.section_name)) sectionMap.set(answer.section_name, []);
      const existing = sectionMap.get(answer.section_name)!;
      const idx = existing.findIndex((e) => e.exercise_name === answer.exercise_name);
      if (idx >= 0) {
        existing[idx] = { exercise_name: answer.exercise_name, score: answer.score, date: result.date };
      } else {
        existing.push({ exercise_name: answer.exercise_name, score: answer.score, date: result.date });
      }
    }
  }

  const isLoading = analyticsLoading || examsLoading || resultsLoading;

  const handleGenerateAI = () => {
    generateAI.mutate(child.id, {
      onSuccess: () => toast.success("AI tahlil muvaffaqiyatli generatsiya qilindi!"),
      onError: (err: any) => {
        const msg = err?.response?.data?.detail;
        toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "AI tahlil generatsiya qilishda xatolik");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const hasResults = (diagnosticResults?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Generate AI button */}
      {hasResults && (
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#2D3142]">AI tahlil generatsiya qilish</p>
              <p className="text-[12px] text-[#9EB1D4]">
                Diagnostika natijalariga asosan aqliy yoshni hisoblash va konsultatsiya kartasini to'ldirish
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateAI}
            disabled={generateAI.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-[14px] transition-colors disabled:opacity-50 shrink-0"
          >
            {generateAI.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generatsiya qilinmoqda...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI tahlilni boshlash
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Qisqa tahlil ── */}
      {analytics && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
            <BarChart3 className="w-5 h-5 text-[#4D89FF]" />
            <h3 className="text-[15px] font-bold text-[#2D3142]">Qisqa tahlil</h3>
          </div>

          <div className="p-6 space-y-5">
            {/* Section progress bars */}
            <div className="space-y-3 pt-1">
              {analytics.radar.details.map((detail) => {
                const color = getColor(detail.section_name);
                return (
                  <div key={detail.section_name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#2D3142] font-medium">{detail.section_name}</span>
                      <span className="text-[13px] font-bold text-[#2D3142]">{detail.current}%</span>
                    </div>
                    <div className="h-[10px] w-full bg-gray-100 rounded-full overflow-hidden relative">
                      {/* Previous (ghost bar) */}
                      {detail.previous > 0 && (
                        <div
                          className={cn("absolute h-full rounded-full opacity-20", color.bar)}
                          style={{ width: `${Math.min(detail.previous, 100)}%` }}
                        />
                      )}
                      {/* Current */}
                      <div
                        className={cn("h-full rounded-full transition-all duration-700 relative", color.bar)}
                        style={{ width: `${Math.min(detail.current, 100)}%` }}
                      />
                    </div>
                    {detail.change !== 0 && (
                      <div className="flex items-center gap-1">
                        {detail.change > 0 ? (
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        )}
                        <span className={cn("text-[11px] font-bold", detail.change > 0 ? "text-emerald-500" : "text-red-400")}>
                          {detail.change > 0 ? "+" : ""}{detail.change}%
                        </span>
                        <span className="text-[11px] text-[#9EB1D4]">oldingi davr</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI recommendation */}
            {analytics.mental_age.percentage > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-bold text-blue-700 mb-1">
                      Umumiy ball: {analytics.mental_age.total_score} / {analytics.mental_age.max_score} ({analytics.mental_age.percentage}%)
                    </p>
                    <p className="text-[12px] text-blue-600 leading-relaxed">
                      {analytics.radar.overall_current >= 70
                        ? "Bolaning rivojlanishi yaxshi darajada. Doimiy monitoring talab etiladi."
                        : analytics.radar.overall_current >= 40
                          ? "Intensiv kursga tavsiya etilgan. Doimiy monitoring talab etiladi."
                          : "Alohida e'tibor va intensiv mashg'ulotlar tavsiya etiladi."
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Imtihon natijalari ── */}
      {examResults && examResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[16px] font-bold text-[#2D3142]">Imtihon natijalari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examResults.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full",
                      exam.exam_type === "quarterly" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600")}>
                      {exam.exam_type === "quarterly" ? "Choraklik" : "Oylik"}
                    </span>
                    <span className="text-[12px] text-[#9EB1D4]">{formatDate(exam.date)}</span>
                  </div>
                  <span className="text-[11px] text-[#9EB1D4]">{exam.specialist_name}</span>
                </div>
                {exam.comment && (
                  <p className="text-[13px] text-[#5A6484] leading-relaxed">{exam.comment}</p>
                )}
                {(exam as any).ai_comparison && (
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Brain className="w-3.5 h-3.5 text-blue-600" />
                      <p className="text-[11px] font-bold text-blue-600">AI taqqoslama</p>
                    </div>
                    <p className="text-[12px] text-[#2D3142] leading-relaxed">{(exam as any).ai_comparison}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Diagnostika natijalari jadvali ── */}
      {sectionMap.size > 0 ? (
        <div className="space-y-4">
          <h2 className="text-[16px] font-bold text-[#2D3142]">Diagnostika natijalari</h2>
          {Array.from(sectionMap.entries()).map(([section, items]) => (
            <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="font-bold text-[#2D3142] text-[14px]">{section}</h3>
              </div>
              <div className="grid grid-cols-3 px-6 py-2 border-b border-gray-50 bg-gray-50/50">
                <span className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wide">Ko'nikma nomi</span>
                <span className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wide">Status</span>
                <span className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wide">Sana</span>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item, i) => {
                  const s = scoreStatus(item.score);
                  return (
                    <div key={i} className="grid grid-cols-3 items-center px-6 py-3.5">
                      <span className="text-[13px] text-[#2D3142]">{item.exercise_name}</span>
                      <span className={cn("text-[11px] font-bold px-3 py-1 rounded-full w-fit", s.cls)}>{s.label}</span>
                      <span className="text-[12px] text-[#9EB1D4]">{formatDate(item.date)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : !examResults?.length && !analytics && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center py-16">
          <p className="text-[#9EB1D4] font-medium">Diagnostika natijalari mavjud emas</p>
        </div>
      )}
    </div>
  );
}
