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
      "flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-[24px] border border-dashed border-gray-200",
      className
    )}>
      <div className="w-16 h-16 bg-[#F8F9FB] rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#9EB1D4]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#2D3142] mb-2">{title}</h3>
      {description && (
        <p className="text-[14px] text-[#9EB1D4] max-w-[300px] mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] flex items-center gap-2"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
