import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden",
      className
    )}>
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-50 rounded-full opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon with layered rings */}
        <div className="relative mb-6">
          <div className="absolute inset-0 w-24 h-24 bg-blue-100/40 rounded-full animate-ping [animation-duration:3s]" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center ring-8 ring-blue-50/50">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <Icon className="w-7 h-7 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Dotted line separator */}
        <div className="flex items-center gap-1.5 mb-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
          ))}
        </div>

        <h3 className="text-[18px] font-bold text-[#2D3142] mb-2">{title}</h3>
        {description && (
          <p className="text-[14px] text-[#9EB1D4] max-w-[340px] mb-7 leading-relaxed">
            {description}
          </p>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11 px-7 rounded-[14px] flex items-center gap-2.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
