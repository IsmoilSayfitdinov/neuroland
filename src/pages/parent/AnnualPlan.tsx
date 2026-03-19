import { useMemo } from "react";
import PlanSummaryCard from "@/components/parent/AnnualPlan/PlanSummaryCard";
import MonthCard from "@/components/parent/AnnualPlan/MonthCard";
import type { MonthStatus } from "@/components/parent/AnnualPlan/MonthCard";
import { useMyChild } from "@/hooks/parent/useMyChild";
import { usePlans } from "@/hooks/admin/usePlans";
import { Loader2 } from "lucide-react";

const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

export default function AnnualPlanPage() {
  const { data: child, isLoading: childLoading } = useMyChild();
  const { useYearlyPlansList, useMonthlyGoals } = usePlans();

  const { data: yearlyPlans, isLoading: plansLoading } = useYearlyPlansList();

  const groupPlan = useMemo(() => {
    if (!yearlyPlans || !child?.group_id) return null;
    return yearlyPlans.find((p) => p.group === child.group_id) || null;
  }, [yearlyPlans, child?.group_id]);

  const { data: monthlyGoals, isLoading: goalsLoading } = useMonthlyGoals(groupPlan?.id ?? 0);

  const currentMonth = new Date().getMonth() + 1;

  const planData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      const goal = monthlyGoals?.find((g) => g.month_number === monthNumber);

      let status: MonthStatus = "locked";
      let progress = 0;
      let skills: string[] = [];

      if (goal) {
        const totalItems = goal.items.length;
        const masteredItems = goal.items.filter((item) => item.is_mastered).length;
        progress = totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;
        skills = [...new Set(goal.items.map((item) => item.section_name))].slice(0, 3);

        if (monthNumber < currentMonth) {
          status = progress === 100 ? "completed" : "active";
        } else if (monthNumber === currentMonth) {
          status = "active";
        } else {
          status = "locked";
        }
      } else if (monthNumber === currentMonth) {
        status = "active";
      } else if (monthNumber < currentMonth) {
        status = "completed";
        progress = 100;
      }

      return { month: monthNumber, name: MONTH_NAMES[i], status, progress, skills };
    });
  }, [monthlyGoals, currentMonth]);

  const completedCount = planData.filter((m) => m.status === "completed").length;

  if (childLoading || plansLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6 px-2">Yillik reja</h1>

      <PlanSummaryCard
        completedMonths={completedCount}
        totalMonths={planData.length}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {planData.map((data) => (
          <MonthCard
            key={data.month}
            monthNumber={data.month}
            monthName={data.name}
            status={data.status}
            progress={data.progress}
            skills={data.skills}
          />
        ))}
      </div>
    </div>
  );
}
