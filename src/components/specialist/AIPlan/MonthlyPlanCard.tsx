import { cn } from "@/lib/utils";
import { Edit2, CheckCircle2 } from "lucide-react";

interface MonthlyPlanCardProps {
  month: string;
  status: "good" | "average" | "poor";
  category: string;
  progress: number;
  tasks: string[];
  isActive?: boolean;
  onClick?: () => void;
}

const statusCfg = {
  good:    { label: "Yaxshi", cls: "text-emerald-600 bg-emerald-50 border-emerald-100", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  average: { label: "O'rta",  cls: "text-orange-500 bg-orange-50 border-orange-100",   dot: "bg-orange-400",  bar: "bg-orange-400"  },
  poor:    { label: "Past",   cls: "text-red-500 bg-red-50 border-red-100",             dot: "bg-red-500",     bar: "bg-red-400"     },
};

const categoryCls: Record<string, string> = {
  Diqqat:           "bg-blue-100 text-blue-600",
  Nutq:             "bg-purple-100 text-purple-600",
  Emotsional:       "bg-pink-100 text-pink-600",
  Sensor:           "bg-emerald-100 text-emerald-600",
  Motor:            "bg-orange-100 text-orange-600",
  Motorika:         "bg-orange-100 text-orange-600",
  Kognitiv:         "bg-indigo-100 text-indigo-600",
  Ijtimoiy:         "bg-cyan-100 text-cyan-600",
  "O'yin":          "bg-lime-100 text-lime-600",
  "O-o'ziga":       "bg-amber-100 text-amber-600",
  "O'z-o'ziga":     "bg-amber-100 text-amber-600",
};

export default function MonthlyPlanCard({
  month, status, category, progress, tasks, isActive = false, onClick,
}: MonthlyPlanCardProps) {
  const s = statusCfg[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-all",
        isActive ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100",
        onClick && "cursor-pointer hover:shadow-md"
      )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <h4 className="font-bold text-[#2D3142] text-[16px]">{month}</h4>
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md w-fit",
            categoryCls[category] ?? "bg-gray-100 text-gray-500"
          )}>
            {category}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            "text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1",
            s.cls
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
            {s.label}
          </span>
          <button className="text-[#9EB1D4] hover:text-[#2D3142] transition-colors">
            <Edit2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-[#9EB1D4] font-bold">Progress</span>
          <span className="text-[11px] text-[#2D3142] font-bold">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", s.bar)} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Tasks */}
      <ul className="space-y-2">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-[#5A6484]">
            <CheckCircle2 size={13} className="text-gray-300 mt-0.5 shrink-0" />
            <span className="leading-snug">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
