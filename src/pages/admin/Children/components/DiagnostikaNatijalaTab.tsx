import type { ChildDetailOut } from "@/types/children.types";
import { cn, formatDate } from "@/lib/utils";
import { useExams } from "@/hooks/specialist/useExams";
import { Brain, Loader2 } from "lucide-react";

interface Props {
  child: ChildDetailOut;
}

function scoreStatus(score: number): { label: string; cls: string } {
  if (score >= 1)   return { label: "Yaxshi",   cls: "bg-emerald-50 text-emerald-600" };
  if (score >= 0.5) return { label: "O'rtacha",  cls: "bg-amber-50 text-amber-600" };
  return               { label: "Past",     cls: "bg-red-50 text-red-500" };
}

export function DiagnostikaNatijalaTab({ child }: Props) {
  const diagnosticResults: any[] = (child.diagnostic_results as any) ?? [];
  const { useResultsList } = useExams();
  const { data: examResults, isLoading: examsLoading } = useResultsList({ child_id: child.id });

  // Diagnostika — grouped by section
  const sectionMap = new Map<string, { exercise_name: string; score: number; date: string }[]>();
  for (const result of diagnosticResults) {
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

  return (
    <div className="space-y-6">
      {/* Imtihon natijalari */}
      {examsLoading ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
      ) : examResults && examResults.length > 0 && (
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

      {/* Diagnostika natijalari jadvali */}
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
      ) : !examResults?.length && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center py-16">
          <p className="text-[#9EB1D4] font-medium">Diagnostika natijalari mavjud emas</p>
        </div>
      )}
    </div>
  );
}
