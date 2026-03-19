import { Calendar as CalendarIcon } from "lucide-react";

interface PlanItem {
  week: string;
  topic: string;
}

interface MonthlyPlanListProps {
  plan: PlanItem[];
}

export function MonthlyPlanList({ plan }: MonthlyPlanListProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-bold text-[#2D3142]">Oylik rivojlanish rejasi</h3>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-[#2D3142] text-[13px] font-medium rounded-[10px] hover:bg-gray-50 transition-colors shadow-sm">
          <CalendarIcon className="w-4 h-4" />
          Oylik rejani tahrirlash
        </button>
      </div>

      <div className="space-y-3">
        {plan.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 p-4 bg-[#F8F9FB] rounded-[16px]">
            <span className="text-[13px] font-bold text-[#4D89FF] min-w-[60px]">{item.week}</span>
            <span className="text-[14px] font-medium text-[#2D3142]">{item.topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
