import { useState, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, ArrowLeft, Loader2, Sparkles, ChevronLeft, ChevronRight, User, Trash2 } from "lucide-react";
import { PlansAPI } from "@/api/plans.api";
import { GroupsAPI } from "@/api/groups.api";
import MonthlyPlanCard from "@/components/specialist/AIPlan/MonthlyPlanCard";
import CategoryPlanCard from "@/components/specialist/AIPlan/CategoryPlanCard";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { toast } from "sonner";

const MONTH_NAMES = [
  "", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function calcProgress(items: { current_score: number; target_score: number }[]): number {
  if (!items.length) return 0;
  const sum = items.reduce(
    (acc, it) => acc + (it.target_score > 0 ? (it.current_score / it.target_score) * 100 : 0),
    0
  );
  return Math.round(sum / items.length);
}

function statusFromProgress(p: number): "good" | "average" | "poor" {
  if (p >= 70) return "good";
  if (p >= 40) return "average";
  return "poor";
}

export default function AIPlanDetailAdmin() {
  const { groupId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const gId = Number(groupId);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: group } = useQuery({
    queryKey: ["group", gId],
    queryFn: () => GroupsAPI.getGroupById(gId),
    enabled: !!gId,
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["yearly-plans"],
    queryFn: () => PlansAPI.listYearlyPlans(),
  });

  const plan = plans?.find((p) => p.group === gId);

  const { data: yearlyPlan, isLoading: detailLoading } = useQuery({
    queryKey: ["yearly-plan", plan?.id],
    queryFn: () => PlansAPI.getYearlyPlan(plan!.id),
    enabled: !!plan?.id,
  });

  const { mutate: generatePlan, isPending: generating } = useMutation({
    mutationFn: () => {
      const startDate = new Date().toISOString().slice(0, 10);
      if (plan?.id) return PlansAPI.generateAiPlan(plan.id, { group: gId, start_date: startDate });
      return PlansAPI.createYearlyPlan({ group: gId, start_date: startDate })
        .then((p) => PlansAPI.generateAiPlan(p.id, { group: gId, start_date: startDate }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
      queryClient.invalidateQueries({ queryKey: ["yearly-plan"] });
      toast.success("AI reja muvaffaqiyatli yaratildi!");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const { mutate: deletePlan, isPending: deleting } = useMutation({
    mutationFn: () => PlansAPI.deleteYearlyPlan(plan!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
      queryClient.invalidateQueries({ queryKey: ["yearly-plan"] });
      setDeleteModalOpen(false);
      toast.success("Reja o'chirildi");
      navigate({ to: "/admin/ai-plan" });
    },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  const isLoading = plansLoading || detailLoading;
  const currentMonthNum = new Date().getMonth() + 1;
  const selectedGoal = yearlyPlan?.monthly_goals?.find((g) => g.month_number === selectedMonth);

  const sectionMap = useMemo(() => {
    const map = new Map<string, { id: number; exercise_name: string; current_score: number; target_score: number; is_mastered?: boolean }[]>();
    if (selectedGoal) {
      for (const item of selectedGoal.items) {
        if (!map.has(item.section_name)) map.set(item.section_name, []);
        map.get(item.section_name)!.push(item);
      }
    }
    return map;
  }, [selectedGoal]);

  const overallProgress = useMemo(() => {
    if (!yearlyPlan?.monthly_goals?.length) return 0;
    const allItems = yearlyPlan.monthly_goals.flatMap((g) => g.items);
    if (!allItems.length) return 0;
    const mastered = allItems.filter((i) => i.is_mastered).length;
    return Math.round((mastered / allItems.length) * 100);
  }, [yearlyPlan]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate({ to: "/admin/ai-plan" })}
            className="flex items-center gap-1.5 text-[#9EB1D4] hover:text-[#2D3142] transition-colors text-[13px] font-medium mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Orqaga
          </button>
          <h1 className="text-[22px] font-bold text-[#2D3142]">
            AI Rejalashtiruvchi — {group?.name ?? "Guruh"}
          </h1>
          <p className="text-[12px] text-[#9EB1D4] mt-1">12 oylik rivojlanish dasturi</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => generatePlan()}
            disabled={generating}
            className="flex items-center gap-2 h-10 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {generating ? "Generatsiya..." : "AI generatsiya"}
          </button>
          {plan && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-white border border-red-100 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Group info + AI summary */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm">
              {group?.name?.slice(0, 2).toUpperCase() ?? "G"}
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#2D3142]">{group?.name}</span>
              <p className="text-[11px] text-[#9EB1D4]">{group?.age_group_name} · {group?.children_count} bola</p>
            </div>
          </div>
          {yearlyPlan && (
            <div className="flex items-center gap-4 text-[12px] text-[#9EB1D4]">
              <span>Boshlanish: <span className="font-bold text-[#2D3142]">{yearlyPlan.start_date}</span></span>
              <span>Progress: <span className="font-bold text-[#2D3142]">{overallProgress}%</span></span>
            </div>
          )}
        </div>
        {yearlyPlan?.ai_summary && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-[11px] font-bold text-blue-600 mb-1">AI Xulosa</p>
            <p className="text-[13px] text-[#2D3142] leading-relaxed">{yearlyPlan.ai_summary}</p>
          </div>
        )}
      </div>

      {/* No plan */}
      {!yearlyPlan && !generating && (
        <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="font-bold text-[#2D3142] text-[15px]">AI reja hali yaratilmagan</p>
            <p className="text-[13px] text-[#9EB1D4] mt-1">Guruh diagnostika natijalari asosida AI reja generatsiya qiling</p>
          </div>
          <button onClick={() => generatePlan()}
            className="flex items-center gap-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors">
            <Sparkles className="w-4 h-4" />
            AI reja yaratish
          </button>
        </div>
      )}

      {/* 12-Month Grid */}
      {yearlyPlan && yearlyPlan.monthly_goals?.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {yearlyPlan.monthly_goals.map((goal) => {
              const progress = calcProgress(goal.items);
              return (
                <MonthlyPlanCard
                  key={goal.id}
                  month={MONTH_NAMES[goal.month_number] ?? `Oy ${goal.month_number}`}
                  status={statusFromProgress(progress)}
                  category={goal.items[0]?.section_name ?? "—"}
                  progress={progress}
                  tasks={goal.items.slice(0, 3).map((i) => i.exercise_name)}
                  isActive={goal.month_number === selectedMonth}
                  onClick={() => setSelectedMonth(goal.month_number)}
                />
              );
            })}
          </div>

          {/* Selected month detail */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="text-[18px] font-bold text-[#2D3142]">
                {MONTH_NAMES[selectedMonth]} oylik reja
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedMonth((m) => Math.max(1, m - 1))} disabled={selectedMonth <= 1}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[13px] font-bold text-[#2D3142] min-w-[50px] text-center">{selectedMonth}/12</span>
                <button onClick={() => setSelectedMonth((m) => Math.min(12, m + 1))} disabled={selectedMonth >= 12}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
                {selectedMonth !== currentMonthNum && (
                  <button onClick={() => setSelectedMonth(currentMonthNum)}
                    className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                    Joriy oy
                  </button>
                )}
              </div>
            </div>

            {selectedGoal?.notes && (
              <p className="text-[12px] text-[#9EB1D4] mb-4 italic">{selectedGoal.notes}</p>
            )}

            {sectionMap.size === 0 ? (
              <p className="text-[#9EB1D4] text-[13px] text-center py-8">Bu oy uchun reja mavjud emas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {Array.from(sectionMap.entries()).map(([section, items]) => (
                  <CategoryPlanCard
                    key={section}
                    category={section}
                    progress={calcProgress(items)}
                    recommendations={items.map((i) => i.exercise_name)}
                    items={items}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Child Recommendations */}
          {yearlyPlan.child_recommendations?.length > 0 && (
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
              <h3 className="text-[16px] font-bold text-[#2D3142] mb-4">
                Individual tavsiyalar ({yearlyPlan.child_recommendations.length} ta bola)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {yearlyPlan.child_recommendations.map((rec) => (
                  <div key={rec.id} className="bg-[#F8F9FB] rounded-[16px] p-4 flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#2D3142] mb-1">{rec.child_name}</p>
                      <p className="text-[12px] text-[#6B7A99] leading-relaxed">{rec.ai_notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deletePlan()}
        title="Yillik rejani o'chirish"
        description="Bu amal qaytarib bo'lmaydi. Barcha oylik maqsadlar va tavsiyalar o'chiriladi."
        isLoading={deleting}
      />
    </div>
  );
}
