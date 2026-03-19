import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string; // Default: text-[#3DB87E]
  icon: ElementType;
  iconColor?: string;     // Default: text-[#4D89FF]
  iconBg?: string;        // Default: bg-[#F0F5FF]
  className?: string;     // Generic className for overriding
}

export function StatCard({
  title,
  value,
  subtitle,
  subtitleColor = "text-[#3DB87E]",
  icon: Icon,
  iconColor = "text-[#4D89FF]",
  iconBg = "bg-[#F0F5FF]",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm relative", className)}>
      <div className={cn("absolute top-6 right-6 w-10 h-10 rounded-[12px] flex items-center justify-center", iconBg, iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[12px] font-bold tracking-wider text-[#9EB1D4] mb-3 pr-8 uppercase truncate">
        {title}
      </p>
      <p className="text-[32px] font-bold text-[#2D3142] mb-2">{value}</p>
      <p className={cn("text-[13px] font-medium", subtitleColor)}>{subtitle}</p>
    </div>
  );
}
