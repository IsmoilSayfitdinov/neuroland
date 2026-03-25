import { useNavigate } from "@tanstack/react-router";
import { Calendar as CalendarIcon, BookOpen } from "lucide-react";

export function MonthlyPlanList({ plan }: any) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-bold text-[#2D3142]">Mavzular</h3>
        <button onClick={() => navigate({to: "/admin/topics"})} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-[#2D3142] text-[13px] font-medium rounded-[10px] hover:bg-gray-50 transition-colors shadow-sm">
          <CalendarIcon className="w-4 h-4" />
            Mavzularni tahrirlash
        </button>
      </div>

      <div className="space-y-3">
        {plan.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F0F4FF] to-[#F8F9FB] rounded-[16px] border border-[#E8EDFB] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-[#4D89FF]/10 rounded-[12px] shrink-0">
              <BookOpen className="w-5 h-5 text-[#4D89FF]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#2D3142] truncate">
                {item.title}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                {formatDate(item.start_date)} — {formatDate(item.end_date)}
              </p>
            </div>

            {item.active_groups?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {item.active_groups.map((group: string, gIdx: number) => (
                  <span
                    key={gIdx}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#4D89FF] bg-[#4D89FF]/10 rounded-full"
                  >
                    {group}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
