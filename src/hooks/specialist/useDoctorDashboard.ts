import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";

export const useDoctorDashboard = () => {
  const { useDoctorDashboard: useDashboardQuery } = useAnalytics();
  const { data: dashboard, isLoading: isLoadingDashboard } = useDashboardQuery();

  const queryClient = useQueryClient();

  const { data: todaySessions = [], isLoading: isLoadingSessions, refetch: refetchToday } = useQuery({
    queryKey: ["sessions-today"],
    queryFn: () => SessionsAPI.getToday(),
  });

  const invalidateToday = () => {
    queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
  };

  return {
    isLoading: isLoadingDashboard,
    isLoadingSessions,
    dashboard,
    dynamics: dashboard?.development_dynamics ?? null,
    aiPlan: dashboard?.ai_plan ?? null,
    homework: dashboard?.homework_stats ?? null,
    effectiveness: dashboard?.effectiveness ?? null,
    globalRadar: dashboard?.global_radar ?? [],
    todaySchedule: todaySessions,
    attentionNeeded: dashboard?.attention_needed ?? [],
    refetchToday,
    invalidateToday,
  };
};
