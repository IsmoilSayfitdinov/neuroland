import type { ChildDetailOut } from "@/types/children.types";
import { cn, formatDate } from "@/lib/utils";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import { useExams } from "@/hooks/specialist/useExams";
import { Calendar, ChevronDown, ChevronUp, Loader2, FileText } from "lucide-react";
import { useState } from "react";
import type { DiagnosticResult } from "@/types/diagnostics.types";

interface Props {
  child: ChildDetailOut;
}

function scoreLabel(score: number): { label: string; cls: string } {
  if (score >= 1) return { label: "Mustaqil", cls: "bg-emerald-50 text-emerald-600" };
  if (score >= 0.5) return { label: "Yordam bilan", cls: "bg-amber-50 text-amber-600" };
  return { label: "Bajarmadi", cls: "bg-red-50 text-red-500" };
}

function ResultCard({ result, defaultOpen }: { result: DiagnosticResult; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  const answers = result.answers ?? [];
  const totalAnswers = answers.length;
  const completedAnswers = answers.filter((a) => a.score >= 1).length;
  const partialAnswers = answers.filter((a) => a.score === 0.5).length;
  const progressPct = totalAnswers > 0 ? Math.round((completedAnswers / totalAnswers) * 100) : 0;

  // Group answers by section
  const sectionMap = new Map<string, typeof answers>();
  for (const a of answers) {
    if (!sectionMap.has(a.section_name)) sectionMap.set(a.section_name, []);
    sectionMap.get(a.section_name)!.push(a);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-[14px] font-bold text-[#2D3142]">{formatDate(result.date)}</span>
          </div>
          {result.specialist_name && (
            <span className="text-[12px] text-[#9EB1D4]">{result.specialist_name}</span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
              {completedAnswers} mustaqil
            </span>
            {partialAnswers > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
                {partialAnswers} yordam
              </span>
            )}
            <span className="text-[12px] font-bold text-[#2D3142]">{progressPct}%</span>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[#9EB1D4]" /> : <ChevronDown className="w-5 h-5 text-[#9EB1D4]" />}
      </button>

      {isOpen && (
        <div className="border-t border-gray-100">
          {/* Progress bar */}
          <div className="px-6 py-3">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#9EB1D4] mt-1">
              {completedAnswers}/{totalAnswers} mashq mustaqil bajarildi
            </p>
          </div>

          {/* Comment */}
          {result.comment && (
            <div className="px-6 pb-3">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <p className="text-[11px] font-bold text-blue-600">Izoh</p>
                </div>
                <p className="text-[12px] text-[#2D3142] leading-relaxed">{result.comment}</p>
              </div>
            </div>
          )}

          {/* Answers by section */}
          {Array.from(sectionMap.entries()).map(([section, sectionAnswers]) => (
            <div key={section}>
              <div className="px-6 py-2 bg-gray-50/80">
                <span className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">{section}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {sectionAnswers.map((a, i) => {
                  const s = scoreLabel(a.score);
                  return (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-3">
                      <span className="text-[13px] text-[#2D3142]">{a.exercise_name}</span>
                      <span className="text-[11px] text-[#9EB1D4]">{a.age_group_name}</span>
                      <span className={cn("text-[11px] font-bold px-3 py-1 rounded-full w-fit", s.cls)}>
                        {s.label}
                      </span>
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

export function DiagnostikaTab({ child }: Props) {
  const { useResultsByChild } = useDiagnostics();
  const { data: results, isLoading: resultsLoading } = useResultsByChild(child.id);
  const { useScheduleByChild } = useExams();
  const { data: examSchedule } = useScheduleByChild(child.id);

  if (resultsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Exam schedule */}
      {examSchedule && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#4D89FF]" />
            <h3 className="text-[15px] font-bold text-[#2D3142]">Imtihon jadvali</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#F8F9FB] rounded-xl">
              <p className="text-[11px] text-[#9EB1D4] font-medium">Oylik imtihon</p>
              <p className="text-[14px] font-bold text-[#2D3142] mt-1">
                {examSchedule.next_monthly_exam ? formatDate(examSchedule.next_monthly_exam) : "Belgilanmagan"}
              </p>
            </div>
            <div className="p-3 bg-[#F8F9FB] rounded-xl">
              <p className="text-[11px] text-[#9EB1D4] font-medium">Choraklik imtihon</p>
              <p className="text-[14px] font-bold text-[#2D3142] mt-1">
                {examSchedule.next_quarterly_exam ? formatDate(examSchedule.next_quarterly_exam) : "Belgilanmagan"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results list */}
      {results && results.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#2D3142]">
              Diagnostika natijalari ({results.length})
            </h3>
          </div>
          {[...results].reverse().map((result, i) => (
            <ResultCard key={result.id} result={result} defaultOpen={i === 0} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center py-16">
          <p className="text-[#9EB1D4] font-medium">Diagnostika ma'lumotlari mavjud emas</p>
        </div>
      )}
    </div>
  );
}
