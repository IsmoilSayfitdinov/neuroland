import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors, categoryColors, statusProgressColors } from "../constantsData";
import type { MonthData } from "../constantsData";

interface MonthCardProps {
  data: MonthData;
}

export function MonthCard({ data }: MonthCardProps) {
  const { month, status, category, progress, tasks, isActive } = data;

  return (
    <div
      className={cn(
        "bg-white p-6 rounded-[20px] border transition-all duration-200 shadow-sm flex flex-col min-h-[310px]",
        isActive
          ? "border-[#4D89FF] shadow-[0_4px_20px_-4px_rgba(77,137,255,0.2)]"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-[#2D3142]">{month}</h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] font-bold",
              statusColors[status]
            )}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-6">
        <span
          className={cn(
            "px-2.5 py-1 rounded-md text-[11px] font-medium",
            categoryColors[category]
          )}
        >
          {category}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[11.5px] font-medium mb-1.5">
          <span className="text-[#9EB1D4]">Progress</span>
          <span className="text-[#2D3142] font-bold">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", statusProgressColors[status])}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-[10px] mt-auto">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-[14px] h-[14px] text-gray-300 shrink-0 mt-[2px]" />
            <span className="text-[11.5px] text-[#6B7A99] font-medium leading-[1.3]">
              {task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
