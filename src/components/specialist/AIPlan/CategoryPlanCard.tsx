import { cn } from "@/lib/utils";
import {
  ShieldAlert, MessageSquare, Users, Heart,
  Brain, Activity, Fingerprint, Accessibility, Gamepad2, Sparkles,
  CheckCircle2, Circle, Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlansAPI } from "@/api/plans.api";
import { toast } from "sonner";

const config: Record<string, { icon: React.ElementType; color: string; bar: string; bg: string }> = {
  "Diqqat":           { icon: ShieldAlert,   color: "text-blue-500",    bar: "bg-blue-500",    bg: "bg-blue-50"   },
  "Nutq":             { icon: MessageSquare, color: "text-purple-500",  bar: "bg-purple-500",  bg: "bg-purple-50" },
  "Ijtimoiy":         { icon: Users,         color: "text-cyan-500",    bar: "bg-cyan-500",    bg: "bg-cyan-50"   },
  "Emotsional":       { icon: Heart,         color: "text-pink-500",    bar: "bg-pink-500",    bg: "bg-pink-50"   },
  "Kognitiv":         { icon: Brain,         color: "text-indigo-500",  bar: "bg-indigo-500",  bg: "bg-indigo-50" },
  "Motorika":         { icon: Activity,      color: "text-orange-500",  bar: "bg-orange-500",  bg: "bg-orange-50" },
  "Motor":            { icon: Activity,      color: "text-orange-500",  bar: "bg-orange-500",  bg: "bg-orange-50" },
  "Sensor":           { icon: Fingerprint,   color: "text-emerald-500", bar: "bg-emerald-500", bg: "bg-emerald-50"},
  "O-o'ziga xizmat":  { icon: Accessibility, color: "text-amber-500",   bar: "bg-amber-500",   bg: "bg-amber-50"  },
  "O'z-o'ziga xizmat":{ icon: Accessibility, color: "text-amber-500",   bar: "bg-amber-500",   bg: "bg-amber-50"  },
  "O'yin":            { icon: Gamepad2,       color: "text-lime-500",    bar: "bg-lime-500",    bg: "bg-lime-50"   },
};

const fallback = { icon: Sparkles, color: "text-slate-500", bar: "bg-slate-400", bg: "bg-slate-50" };

interface GoalItemData {
  id: number;
  exercise_name: string;
  is_mastered?: boolean;
}

interface Props {
  category: string;
  progress: number;
  recommendations: string[];
  items?: GoalItemData[];
}

export default function CategoryPlanCard({ category, progress, recommendations, items }: Props) {
  const { icon: Icon, color, bar, bg } = config[category] ?? fallback;
  const queryClient = useQueryClient();

  const { mutate: toggleMastered, isPending } = useMutation({
    mutationFn: ({ id, is_mastered }: { id: number; is_mastered: boolean }) =>
      PlansAPI.patchMonthlyGoalItem(id, { is_mastered }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plan"] });
      toast.success("Holat yangilandi");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <div className={cn("rounded-2xl p-5 flex flex-col gap-4", bg)}>
      {/* Icon + name */}
      <div className="flex items-center gap-3">
        <div className={cn("w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm", color)}>
          <Icon size={17} />
        </div>
        <h4 className="font-bold text-[#2D3142] text-[14px]">{category}</h4>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-[#9EB1D4] font-bold">Taraqqiyot:</span>
          <span className="text-[12px] font-bold text-[#2D3142]">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", bar)} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Exercises with mastered toggle */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-[#9EB1D4] uppercase tracking-wider">
          Tavsiya etilgan mashqlar:
        </p>
        <ul className="space-y-1.5">
          {items && items.length > 0
            ? items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => !isPending && toggleMastered({ id: item.id, is_mastered: !item.is_mastered })}
                  className="flex items-center gap-2 text-[12px] text-[#5A6484] cursor-pointer hover:bg-white/50 rounded-lg px-1.5 py-1 transition-colors"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 shrink-0" />
                  ) : item.is_mastered ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={cn("leading-snug", item.is_mastered && "line-through text-slate-400")}>
                    {item.exercise_name}
                  </span>
                </li>
              ))
            : recommendations.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-[#5A6484]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9EB1D4] shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
