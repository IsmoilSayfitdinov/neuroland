import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  ChevronDown,
  User,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { PlansAPI } from "@/api/plans.api";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import type { MonthlyGoalItem } from "@/types/plans.types";

const MONTH_NAMES = [
  "",
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth() + 1];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export default function YearlyPlanDetailAdmin() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const planId = Number(id);

  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

  // Fetch plan detail
  const { data: plan, isLoading } = useQuery({
    queryKey: ["yearly-plan-detail", planId],
    queryFn: () => PlansAPI.getYearlyPlan(planId),
    enabled: !!planId,
  });

  // Generate AI plan
  const generateMutation = useMutation({
    mutationFn: () =>
      PlansAPI.generateAiPlan(planId, {
        group: plan!.group,
        start_date: plan!.start_date,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plan-detail", planId] });
      queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
      toast.success("AI reja muvaffaqiyatli yaratildi!");
    },
    onError: () => toast.error("AI reja yaratishda xatolik yuz berdi"),
  });

  // Patch monthly goal item (toggle is_mastered)
  const patchItemMutation = useMutation({
    mutationFn: ({ itemId, is_mastered }: { itemId: number; is_mastered: boolean }) =>
      PlansAPI.patchMonthlyGoalItem(itemId, { is_mastered }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plan-detail", planId] });
    },
    onError: () => toast.error("Yangilashda xatolik yuz berdi"),
  });

  const toggleMonth = (monthNumber: number) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthNumber)) {
        next.delete(monthNumber);
      } else {
        next.add(monthNumber);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        {/* Back + header skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-40 rounded-lg" />
        </div>
        {/* Cards skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-[20px]" />
        ))}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-[#9EB1D4] text-[15px]">Reja topilmadi</p>
        <button
          onClick={() => navigate({ to: "/admin/yearly-plans" })}
          className="flex items-center gap-2 text-blue-600 hover:underline text-[13px] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga qaytish
        </button>
      </div>
    );
  }

  const masteredCount = plan.monthly_goals
    .flatMap((g) => g.items)
    .filter((i) => i.is_mastered).length;
  const totalCount = plan.monthly_goals.flatMap((g) => g.items).length;

  return (
    <div className="mx-auto pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate({ to: "/admin/yearly-plans" })}
            className="flex items-center gap-1.5 text-[#9EB1D4] hover:text-[#2D3142] transition-colors text-[13px] font-medium mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Orqaga
          </button>
          <h1 className="text-[22px] font-bold text-[#2D3142]">
            {plan.group_name}
          </h1>
          <p className="text-[12px] text-[#9EB1D4] mt-0.5">
            Boshlanish: {formatDate(plan.start_date)}
          </p>
        </div>

        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors disabled:opacity-70 shrink-0"
        >
          {generateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {generateMutation.isPending ? "Generatsiya..." : "AI Reja yaratish"}
        </button>
      </div>

      {/* Summary info card */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {plan.group_name?.slice(0, 2).toUpperCase() ?? "G"}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#2D3142]">
                {plan.group_name}
              </p>
              <p className="text-[11px] text-[#9EB1D4]">
                Yaratilgan: {formatDate(plan.created_at)}
              </p>
            </div>
          </div>
          {totalCount > 0 && (
            <div className="flex items-center gap-4 text-[12px] text-[#9EB1D4]">
              <span>
                Mashqlar:{" "}
                <span className="font-bold text-[#2D3142]">{totalCount}</span>
              </span>
              <span>
                Bajarildi:{" "}
                <span className="font-bold text-emerald-600">
                  {masteredCount}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* AI Summary */}
        {plan.ai_summary && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-[11px] font-bold text-blue-600 mb-1.5 uppercase tracking-wide">
              AI Xulosa
            </p>
            <p className="text-[13px] text-[#2D3142] leading-relaxed">
              {plan.ai_summary}
            </p>
          </div>
        )}
      </div>

      {/* Monthly Goals */}
      <div className="space-y-3">
        <h2 className="text-[16px] font-bold text-[#2D3142]">Oylik maqsadlar</h2>

        {plan.monthly_goals.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-dashed border-gray-200 py-12 flex flex-col items-center gap-3 text-center">
            <Sparkles className="w-8 h-8 text-[#9EB1D4]" />
            <p className="text-[14px] font-medium text-[#9EB1D4]">
              Oylik maqsadlar mavjud emas
            </p>
            <p className="text-[12px] text-[#9EB1D4]">
              AI reja yaratish tugmasini bosing
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {plan.monthly_goals.map((goal) => {
              const isExpanded = expandedMonths.has(goal.month_number);
              const monthLabel = `${goal.month_number}-oy (${MONTH_NAMES[goal.month_number] ?? ""})`;
              const masteredItems = goal.items.filter((i) => i.is_mastered).length;

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Month header (accordion trigger) */}
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F8F9FB] transition-colors"
                    onClick={() => toggleMonth(goal.month_number)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-blue-50 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-blue-600">
                          {goal.month_number}
                        </span>
                      </div>
                      <span className="text-[14px] font-bold text-[#2D3142]">
                        {monthLabel}
                      </span>
                      {goal.notes && (
                        <span className="hidden sm:block text-[12px] text-[#9EB1D4] truncate max-w-[200px]">
                          {goal.notes}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {goal.items.length > 0 && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                          {masteredItems}/{goal.items.length} ta
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-[#9EB1D4] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Month content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3">
                      {goal.notes && (
                        <p className="text-[12px] text-[#9EB1D4] italic mb-3">
                          {goal.notes}
                        </p>
                      )}

                      {goal.items.length === 0 ? (
                        <p className="text-[13px] text-[#9EB1D4] py-4 text-center">
                          Mashqlar yo'q
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-[12px]">
                            <thead>
                              <tr className="border-b border-gray-100">
                                <th className="text-left py-2 pr-4 font-semibold text-[#9EB1D4] whitespace-nowrap">
                                  Mashq
                                </th>
                                <th className="text-left py-2 pr-4 font-semibold text-[#9EB1D4] whitespace-nowrap">
                                  Bo'lim
                                </th>
                                <th className="text-center py-2 pr-4 font-semibold text-[#9EB1D4] whitespace-nowrap">
                                  Ball
                                </th>
                                <th className="text-center py-2 font-semibold text-[#9EB1D4] whitespace-nowrap">
                                  Bajarildi
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {goal.items.map((item: MonthlyGoalItem) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-gray-50 last:border-0 hover:bg-[#F8F9FB] transition-colors"
                                >
                                  <td className="py-2.5 pr-4 text-[#2D3142] font-medium">
                                    {item.exercise_name}
                                  </td>
                                  <td className="py-2.5 pr-4 text-[#9EB1D4]">
                                    {item.section_name}
                                  </td>
                                  <td className="py-2.5 pr-4 text-center">
                                    <span className="text-[#9EB1D4]">
                                      {item.current_score}
                                    </span>
                                    <span className="text-[#C8D5E8] mx-1">→</span>
                                    <span className="font-bold text-[#2D3142]">
                                      {item.target_score}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-center">
                                    <button
                                      onClick={() =>
                                        patchItemMutation.mutate({
                                          itemId: item.id,
                                          is_mastered: !item.is_mastered,
                                        })
                                      }
                                      disabled={patchItemMutation.isPending}
                                      className="inline-flex items-center justify-center transition-colors disabled:opacity-50"
                                      title={
                                        item.is_mastered
                                          ? "Bajarilgan deb belgilangan"
                                          : "Bajarilmagan"
                                      }
                                    >
                                      {item.is_mastered ? (
                                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                                      ) : (
                                        <Square className="w-5 h-5 text-[#C8D5E8] hover:text-blue-400" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Child Recommendations */}
      {plan.child_recommendations && plan.child_recommendations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[16px] font-bold text-[#2D3142]">
            Individual tavsiyalar
            <span className="ml-2 text-[13px] font-normal text-[#9EB1D4]">
              ({plan.child_recommendations.length} ta bola)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.child_recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 flex gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#2D3142] mb-1">
                    {rec.child_name}
                  </p>
                  {rec.ai_notes ? (
                    <p className="text-[12px] text-[#6B7A99] leading-relaxed">
                      {rec.ai_notes}
                    </p>
                  ) : (
                    <p className="text-[12px] text-[#9EB1D4] italic">
                      Tavsiya mavjud emas
                    </p>
                  )}
                  <p className="text-[11px] text-[#C8D5E8] mt-1.5">
                    {formatDate(rec.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
