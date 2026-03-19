import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlansAPI } from "@/api/plans.api";
import { useNavigate } from "@tanstack/react-router";

export default function AIPlanProgress() {
  const navigate = useNavigate();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["yearly-plans"],
    queryFn: () => PlansAPI.listYearlyPlans(),
  });

  // Get first plan and calculate progress
  const firstPlan = plans?.[0];

  const { data: yearlyPlan } = useQuery({
    queryKey: ["yearly-plan", firstPlan?.id],
    queryFn: () => PlansAPI.getYearlyPlan(firstPlan!.id),
    enabled: !!firstPlan?.id,
  });

  let progressPercent = 0;
  if (yearlyPlan?.monthly_goals) {
    const currentMonth = new Date().getMonth() + 1;
    const currentGoal = yearlyPlan.monthly_goals.find((g) => g.month_number === currentMonth);
    if (currentGoal?.items.length) {
      const mastered = currentGoal.items.filter((i) => i.is_mastered).length;
      progressPercent = Math.round((mastered / currentGoal.items.length) * 100);
    }
  }

  const offset = 502.6 * (1 - progressPercent / 100);

  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6">AI Reja bo'yicha o'zlashtirish</h3>

      {isLoading ? (
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 my-12" />
      ) : (
        <>
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="#F1F5F9" strokeWidth="12" fill="none" />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#2ECC71"
                strokeWidth="12"
                fill="none"
                strokeDasharray="502.6"
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-800">{progressPercent}%</span>
              <span className="text-xs text-slate-500 font-medium">Bajarildi</span>
            </div>
          </div>

          <div className="bg-[#2ECC71]/14 rounded-2xl p-4 mb-6 w-full">
            <p className="text-xs text-emerald-800 leading-relaxed">
              {yearlyPlan
                ? `Joriy oy: ${yearlyPlan.monthly_goals.find((g) => g.month_number === new Date().getMonth() + 1)?.items.length ?? 0} ta maqsad`
                : "AI reja hali yaratilmagan"}
            </p>
          </div>

          <Button
            onClick={() => navigate({ to: "/specialist/ai-plan" })}
            className="w-full bg-[#2ECC71] hover:bg-emerald-600 h-12 rounded-xl text-white font-semibold"
          >
            To'liq hisobotni ko'rish
          </Button>
        </>
      )}
    </Card>
  );
}
