import { useAnalytics } from "@/hooks/admin/useAnalytics";

export const useDoctorDashboard = () => {
  const { useDoctorDashboard: useDashboardQuery } = useAnalytics();
  const { data: dashboard, isLoading } = useDashboardQuery();

  return {
    isLoading,
    dashboard,
    dynamics: dashboard?.development_dynamics ?? null,
    aiPlan: dashboard?.ai_plan ?? null,
    homework: dashboard?.homework_stats ?? null,
    effectiveness: dashboard?.effectiveness ?? null,
    globalRadar: dashboard?.global_radar ?? [],
    todaySchedule: dashboard?.today_schedule ?? [],
    attentionNeeded: dashboard?.attention_needed ?? [],
  };
};
