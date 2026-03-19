import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    isWarning?: boolean;
    text: string;
  };
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-[#EEF4FF]",
  iconColor = "text-[#4D89FF]",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider mb-2">
            {title}
          </h3>
          <p className="text-3xl font-bold text-[#2D3142]">{value}</p>
        </div>
        <div className={cn("p-2.5 rounded-xl", iconBgColor)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-[6px] mt-2">
          <span
            className={cn(
              "text-[13px] font-bold tracking-tight",
              trend.isWarning 
                ? "text-red-500" 
                : trend.isPositive 
                  ? "text-[#3DB87E]" 
                  : "text-red-500"
            )}
          >
            {trend.value}
          </span>
          <span className={cn(
            "text-[12px] font-medium tracking-tight",
             trend.isWarning 
                ? "text-[#FF8A00]" 
                : trend.isPositive 
                  ? "text-[#3DB87E]" 
                  : "text-red-500"
          )}>{trend.text}</span>
        </div>
      )}
    </div>
  );
}
