import { cn, formatDate } from "@/lib/utils";
import type { DiagnosticResult } from "@/types/children.types";

interface DiagnosticsResultsTabProps {
  results: DiagnosticResult[];
}

const scoreStatus = (score: number) => {
  if (score >= 1) return { label: "Yaxshi", color: "bg-[#E8FFF3] text-[#3DB87E]" };
  if (score >= 0.5) return { label: "O'rtacha", color: "bg-amber-50 text-amber-600" };
  return { label: "Past", color: "bg-red-50 text-red-500" };
};

export default function DiagnosticsResultsTab({ results }: DiagnosticsResultsTabProps) {
  if (!results || results.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-[#9EB1D4] font-medium">Diagnostika natijalari yo'q</p>
      </div>
    );
  }

  // Merge all answers grouped by section
  const grouped = results.reduce<Record<string, { exercise_name: string; score: number; date: string }[]>>(
    (acc, result) => {
      result.answers.forEach((a) => {
        if (!acc[a.section_name]) acc[a.section_name] = [];
        acc[a.section_name].push({
          exercise_name: a.exercise_name,
          score: a.score,
          date: result.date,
        });
      });
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([section, answers]) => (
        <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section title */}
          <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/40">
            <p className="font-bold text-[#2D3142] text-[14px]">{section}</p>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-3 px-5 py-2 border-b border-gray-50">
            <p className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">Ko'nikma nomi</p>
            <p className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">Status</p>
            <p className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">Sana</p>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {answers.map((a, idx) => {
              const { label, color } = scoreStatus(a.score);
              return (
                <div key={idx} className="grid grid-cols-3 items-center px-5 py-3">
                  <p className="text-[13px] text-[#2D3142]">{a.exercise_name}</p>
                  <span className={cn("inline-flex w-fit px-3 py-1 rounded-full text-[11px] font-bold", color)}>
                    {label}
                  </span>
                  <p className="text-[12px] text-[#9EB1D4]">{formatDate(a.date)}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
