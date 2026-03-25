import { Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlansAPI } from "@/api/plans.api";
import { toast } from "sonner";
import type { MonthlyGoal } from "@/types/plans.types";

// Theme colors for different sections
const SECTION_THEMES: Record<
  string,
  { iconBg: string; iconColor: string; cardBg: string; progressTrack: string; progressFill: string }
> = {
  default: {
    iconBg: "bg-[#2563EB]",
    iconColor: "text-white",
    cardBg: "bg-[#F4FBFA]",
    progressTrack: "bg-blue-100",
    progressFill: "bg-[#2563EB]",
  },
};

function getTheme(section: string) {
  const s = section.toLowerCase();
  if (s.includes("nutq"))
    return { iconBg: "bg-[#A855F7]", iconColor: "text-white", cardBg: "bg-[#FCF5FF]", progressTrack: "bg-purple-100", progressFill: "bg-[#A855F7]" };
  if (s.includes("motor"))
    return { iconBg: "bg-[#F97316]", iconColor: "text-white", cardBg: "bg-[#FFF8F3]", progressTrack: "bg-orange-100", progressFill: "bg-[#F97316]" };
  if (s.includes("sensor"))
    return { iconBg: "bg-[#10B981]", iconColor: "text-white", cardBg: "bg-[#F2FFF5]", progressTrack: "bg-emerald-100", progressFill: "bg-[#10B981]" };
  if (s.includes("kognitiv") || s.includes("bilish"))
    return { iconBg: "bg-[#6366F1]", iconColor: "text-white", cardBg: "bg-[#F0F0FF]", progressTrack: "bg-indigo-100", progressFill: "bg-[#6366F1]" };
  if (s.includes("diqqat"))
    return { iconBg: "bg-[#2563EB]", iconColor: "text-white", cardBg: "bg-[#F4FBFA]", progressTrack: "bg-blue-100", progressFill: "bg-[#2563EB]" };
  if (s.includes("ijtimoiy"))
    return { iconBg: "bg-[#06B6D4]", iconColor: "text-white", cardBg: "bg-[#F0FDFF]", progressTrack: "bg-cyan-100", progressFill: "bg-[#06B6D4]" };
  if (s.includes("emotsional") || s.includes("emosional"))
    return { iconBg: "bg-[#EC4899]", iconColor: "text-white", cardBg: "bg-[#FFF5F8]", progressTrack: "bg-pink-100", progressFill: "bg-[#EC4899]" };
  if (s.includes("xizmat"))
    return { iconBg: "bg-[#F59E0B]", iconColor: "text-white", cardBg: "bg-[#FFFDF5]", progressTrack: "bg-amber-100", progressFill: "bg-[#F59E0B]" };
  return SECTION_THEMES.default;
}

interface MonthlyPlanViewProps {
  monthlyGoal: MonthlyGoal | null;
  monthName: string;
  planId: number | null;
}

export function MonthlyPlanView({ monthlyGoal, monthName }: MonthlyPlanViewProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleMastered } = useMutation({
    mutationFn: ({ itemId, isMastered }: { itemId: number; isMastered: boolean }) =>
      PlansAPI.patchMonthlyGoalItem(itemId, { is_mastered: isMastered }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
      toast.success("Ko'nikma holati yangilandi");
    },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  if (!monthlyGoal) {
    return (
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm mt-6 text-center">
        <p className="text-[#9EB1D4] font-medium">
          Joriy oy uchun reja mavjud emas. Avval yillik reja va guruhni tanlang.
        </p>
      </div>
    );
  }

  // Group items by section_name
  const sectionMap = new Map<string, typeof monthlyGoal.items>();
  for (const item of monthlyGoal.items) {
    if (!sectionMap.has(item.section_name)) sectionMap.set(item.section_name, []);
    sectionMap.get(item.section_name)!.push(item);
  }

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm mt-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-[22px] font-bold text-[#2D3142] mb-1">
            Joriy oy rejasi — {monthName}
          </h2>
          <p className="text-[14px] text-[#6B7A99]">
            {sectionMap.size} ta asosiy rivojlanish yo'nalishi bo'yicha batafsil reja
          </p>
          {monthlyGoal.notes && (
            <p className="text-[12px] text-[#9EB1D4] mt-1">{monthlyGoal.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#F0F5FF] text-[#4D89FF] rounded-[12px] text-[13px] font-semibold">
          <Activity className="w-4 h-4" />
          Faol oy
        </div>
      </div>

      {/* Grid of Cards */}
      {sectionMap.size === 0 ? (
        <p className="text-[#9EB1D4] text-[13px] text-center py-8">
          Bu oy uchun mashqlar mavjud emas
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from(sectionMap.entries()).map(([section, items]) => {
            const theme = getTheme(section);
            const masteredCount = items.filter((i) => i.is_mastered).length;
            const progress = items.length > 0 ? Math.round((masteredCount / items.length) * 100) : 0;

            return (
              <div key={section} className={cn("p-6 rounded-[24px] flex flex-col min-h-[320px]", theme.cardBg)}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={cn("w-[42px] h-[42px] rounded-[14px] flex items-center justify-center", theme.iconBg, theme.iconColor)}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#2D3142]">{section}</h3>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-[10px]">
                    <span className="text-[13px] text-[#6B7A99] font-medium">Taraqqiyot</span>
                    <span className="text-[18px] font-bold text-[#2D3142]">{progress}%</span>
                  </div>
                  <div className={cn("h-[6px] w-[85%] rounded-full overflow-hidden", theme.progressTrack)}>
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", theme.progressFill)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#9EB1D4] mt-1.5">
                    {masteredCount}/{items.length} o'zlashtirildi
                  </p>
                </div>

                {/* Items List */}
                <div className="mt-auto pt-2">
                  <h4 className="text-[12px] font-bold text-[#6B7A99] mb-3">Mashqlar:</h4>
                  <ul className="space-y-[10px]">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start gap-[8px] cursor-pointer group"
                        onClick={() =>
                          toggleMastered({ itemId: item.id, isMastered: !item.is_mastered })
                        }
                      >
                        <CheckCircle2
                          className={cn(
                            "w-4 h-4 shrink-0 mt-[1px] transition-colors",
                            item.is_mastered
                              ? "text-[#22C55E]"
                              : "text-gray-300 group-hover:text-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-[12.5px] font-medium leading-[1.4] transition-colors",
                            item.is_mastered
                              ? "text-[#9EB1D4] line-through"
                              : "text-[#6B7A99]"
                          )}
                        >
                          {item.exercise_name}
                          <span className="text-[10px] text-[#9EB1D4] ml-1">
                            ({item.current_score} → {item.target_score})
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
