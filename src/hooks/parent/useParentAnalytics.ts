import { useAnalytics } from "@/hooks/admin/useAnalytics";

export const useParentAnalytics = () => {
  const {
    useParentDashboard: useDashboardQuery,
    useParentProgress: useProgressQuery,
    useParentSections: useSectionsQuery,
    useParentWeeklyActivity: useWeeklyQuery,
  } = useAnalytics();

  const useParentDashboard = () => useDashboardQuery();
  const useParentProgress = () => useProgressQuery();
  const useParentSections = () => useSectionsQuery();
  const useParentWeeklyActivity = () => useWeeklyQuery();

  return {
    useParentDashboard,
    useParentProgress,
    useParentSections,
    useParentWeeklyActivity,
  };
};
