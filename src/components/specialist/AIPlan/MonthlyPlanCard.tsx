import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Edit2, CheckCircle2 } from "lucide-react";

interface MonthlyPlanCardProps {
  month: string;
  status: 'good' | 'average' | 'poor';
  category: string;
  progress: number;
  tasks: string[];
  isActive?: boolean;
}

export default function MonthlyPlanCard({
  month,
  status,
  category,
  progress,
  tasks,
  isActive = false,
}: MonthlyPlanCardProps) {
  const statusConfig = {
    good: { 
      label: 'Yaxshi', 
      color: 'text-emerald-500 border-emerald-100 bg-emerald-50/30', 
      dot: 'bg-emerald-500',
      bar: 'bg-emerald-500'
    },
    average: { 
      label: 'O\'rta', 
      color: 'text-orange-500 border-orange-100 bg-orange-50/30', 
      dot: 'bg-orange-500',
      bar: 'bg-orange-500'
    },
    poor: { 
      label: 'Past', 
      color: 'text-red-500 border-red-100 bg-red-50/30', 
      dot: 'bg-red-500',
      bar: 'bg-red-500'
    },
  };

  const categoryConfig: Record<string, string> = {
    "Diqqat": "bg-blue-50 text-blue-600",
    "Nutq": "bg-purple-50 text-purple-600",
    "Emotsional": "bg-pink-50 text-pink-600",
    "Sensor": "bg-emerald-50 text-emerald-600",
    "Motor": "bg-orange-50 text-orange-600",
    "Kognitiv": "bg-indigo-50 text-indigo-600",
    "Ijtimoiy": "bg-cyan-50 text-cyan-600",
    "O-o'ziga": "bg-amber-50 text-amber-600",
    "O'yin": "bg-lime-50 text-lime-600",
  };

  return (
    <Card className={cn(
      "border-slate-100 shadow-sm transition-all relative overflow-hidden rounded-[32px]",
      isActive ? "ring-2 ring-blue-600 ring-offset-0 border-blue-600" : "bg-white"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-slate-800 text-lg">{month}</h4>
            <span className={cn(
              "text-[10px] font-bold px-2.5 py-1 rounded-md w-fit",
              categoryConfig[category] || "bg-slate-100 text-slate-500"
            )}>
              {category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5",
              statusConfig[status].color
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig[status].dot)}></span>
              {statusConfig[status].label}
            </span>
            <button className="text-slate-300 hover:text-slate-400 transition-colors">
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 font-bold">Progress</span>
            <span className="text-xs text-slate-800 font-black">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                statusConfig[status].bar
              )} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <ul className="space-y-3">
          {tasks.map((task, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
              <CheckCircle2 size={14} className="text-slate-300 mt-0.5 shrink-0" />
              <span className="leading-snug">{task}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
