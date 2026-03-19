import { cn, formatDate } from "@/lib/utils";
import type { DiagnosticResult } from "@/types/children.types";

interface DiagnosticsTabProps {
  results: DiagnosticResult[];
}

const scoreLabel = (score: number) => {
  if (score >= 1) return { label: "Mustaqil", color: "bg-[#E8FFF3] text-[#3DB87E]" };
  if (score >= 0.5) return { label: "Yordam bilan", color: "bg-amber-50 text-amber-600" };
  return { label: "Bajarmadi", color: "bg-red-50 text-red-500" };
};

export default function DiagnosticsTab({ results }: DiagnosticsTabProps) {
  if (!results || results.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-[#9EB1D4] font-medium">Diagnostika ma'lumotlari yo'q</p>
      </div>
    );
  }

  const latest = results[results.length - 1];
  const totalAnswers = latest.answers.length;
  const totalScore = latest.answers.reduce((s, a) => s + a.score, 0);
  const maxScore = totalAnswers;
  const percent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Group by section
  const grouped = latest.answers.reduce<Record<string, typeof latest.answers>>((acc, a) => {
    if (!acc[a.section_name]) acc[a.section_name] = [];
    acc[a.section_name].push(a);
    return acc;
  }, {});

  const allDates = results.map((r) => r.date).sort();
  const startDate = allDates[0] ? formatDate(allDates[0]) : "—";
  const endDate = allDates[allDates.length - 1] ? formatDate(allDates[allDates.length - 1]) : "—";

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[13px] font-bold text-[#2D3142]">
              Diagnostika davri: {startDate} — {endDate}
            </p>
            <p className="text-[11px] text-[#9EB1D4] mt-0.5">Diagnostika jarayoni</p>
          </div>
          <span className="text-[14px] font-bold text-[#2D3142]">{percent}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      {Object.entries(grouped).map(([section, answers]) => (
        <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="font-bold text-[#2D3142] text-[14px]">{section}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {answers.map((answer, idx) => {
              const { label, color } = scoreLabel(answer.score);
              return (
                <div key={idx} className="flex items-center justify-between px-5 py-3">
                  <p className="text-[13px] text-[#2D3142]">{answer.exercise_name}</p>
                  <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold", color)}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
