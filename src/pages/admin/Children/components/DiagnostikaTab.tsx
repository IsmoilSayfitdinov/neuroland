import type { ChildDetailOut, DiagnosticResult } from "@/types/children.types";
import { formatDate } from "@/lib/utils";
import { useExams } from "@/hooks/specialist/useExams";
import { Calendar } from "lucide-react";

interface Props {
  child: ChildDetailOut;
}

export function DiagnostikaTab({ child }: Props) {
  const results: DiagnosticResult[] = (child.diagnostic_results as any) ?? [];
  const latest = results[results.length - 1] as any;
  const { useScheduleByChild } = useExams();
  const { data: examSchedule } = useScheduleByChild(child.id);
  console.log(examSchedule?.next_monthly_exam);
  
  if (!latest) {
    return (
      <div className="space-y-4">
        {/* Exam schedule even when no diagnostics */}
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
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center py-16">
          <p className="text-[#9EB1D4] font-medium">Diagnostika ma'lumotlari mavjud emas</p>
        </div>
      </div>
    );
  }

  const answers: any[] = latest.answers ?? [];
  const totalAnswers = answers.length;
  const completedAnswers = answers.filter((a) => a.score >= 1).length;
  const progressPct = totalAnswers > 0 ? Math.round((completedAnswers / totalAnswers) * 100) : 0;

  // Group by section_name

  

  return (
    <div className="space-y-4">
      {/* Exam Schedule */}
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

      {/* Progress header */}
      <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-[12px] text-[#9EB1D4] font-medium">Diagnostika davri</span>
            <p className="text-[13px] font-bold text-[#2D3142] mt-0.5">
              {formatDate(latest.date)}
              {latest.comment && <span className="text-[#9EB1D4] font-normal ml-2">— {latest.comment}</span>}
            </p>
          </div>
          <span className="text-[22px] font-bold text-[#2D3142]">{progressPct}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-orange-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[11px] text-[#9EB1D4] mt-1">Diagnostika jarayoni</p>
      </div>

   
    </div>
  );
}
