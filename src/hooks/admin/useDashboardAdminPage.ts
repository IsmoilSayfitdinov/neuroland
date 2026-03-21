import { useState, useMemo } from "react";
import { useGroups } from "./useGroups";
import { usePlans } from "./usePlans";
import { useAnalytics } from "./useAnalytics";
import type { MonthData, MonthStatus, Category } from "@/pages/admin/Dashboard/constantsData";

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

function progressToStatus(p: number): MonthStatus {
  if (p >= 65) return "Yaxshi";
  if (p >= 35) return "O'rta";
  return "Past";
}

export const useDashboardAdminPage = () => {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [activeTab, setActiveTab] = useState<"Yillik reja" | "Oylik reja">("Yillik reja");

  const { useAdminDashboard } = useAnalytics();
  const { useGroupsList } = useGroups();
  const { useYearlyPlansList, useYearlyPlanDetail, useCreateYearlyPlan, useGenerateAiPlan } = usePlans();

  const { data: dashboard, isLoading: isLoadingDashboard } = useAdminDashboard();
  const { data: groups, isLoading: isLoadingGroups } = useGroupsList();
  const { data: yearlyPlans, isLoading: isLoadingPlans } = useYearlyPlansList();
  const createPlan = useCreateYearlyPlan();
  const generateAi = useGenerateAiPlan();

  const isLoading = isLoadingDashboard || isLoadingGroups;

  const groupOptions = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => ({ label: g.name, value: g.id.toString() }));
  }, [groups]);

  const activePlanListItem = useMemo(() => {
    if (!yearlyPlans || !selectedGroupId) return null;
    return yearlyPlans.find((p) => p.group.toString() === selectedGroupId) || null;
  }, [yearlyPlans, selectedGroupId]);

  const { data: yearlyPlan, isLoading: isLoadingDetail } = useYearlyPlanDetail(activePlanListItem?.id ?? 0);

  const currentMonthNum = new Date().getMonth() + 1;

  const monthCardsFromAPI: MonthData[] = useMemo(() => {
    if (!yearlyPlan?.monthly_goals) return [];
    return yearlyPlan.monthly_goals.map((goal) => {
      const progress = calcProgress(goal.items);
      const primarySection = goal.items[0]?.section_name ?? "Diqqat";
      return {
        month: MONTH_NAMES[goal.month_number] ?? `Oy ${goal.month_number}`,
        status: progressToStatus(progress),
        category: primarySection as Category,
        progress,
        tasks: goal.items.slice(0, 3).map((i) => i.exercise_name),
        isActive: goal.month_number === currentMonthNum,
      };
    });
  }, [yearlyPlan, currentMonthNum]);

  const currentMonthGoal = yearlyPlan?.monthly_goals?.find(
    (g) => g.month_number === currentMonthNum
  );

  // Stats from API
  const activeChildren = dashboard?.active_children;
  const newThisMonth = dashboard?.new_this_month;
  const avgPercent = dashboard?.overall_avg_percent ?? 0;
  const mentalAge = dashboard?.mental_age_growth_avg ?? 0;
  const parentActivity = dashboard?.parent_activity_percent ?? 0;

  return {
    isLoading,
    isLoadingPlans,
    isLoadingDetail,
    dashboard,
    activeChildren,
    newThisMonth,
    avgPercent,
    mentalAge,
    parentActivity,
    groups,
    groupOptions,
    selectedGroupId,
    setSelectedGroupId,
    activeTab,
    setActiveTab,
    activePlanListItem,
    yearlyPlan,
    monthCardsFromAPI,
    currentMonthGoal,
    currentMonthNum,
    createPlan,
    generateAi,
    MONTH_NAMES,
  };
};
