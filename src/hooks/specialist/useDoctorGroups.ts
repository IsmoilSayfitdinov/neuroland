import { useAnalytics } from "@/hooks/admin/useAnalytics";

export const useDoctorGroups = () => {
  const {
    useDoctorGroups: useGroupsQuery,
    useDoctorGroupDetail: useGroupDetailQuery,
    useDoctorGroupYearlyPlan: useYearlyPlanQuery,
  } = useAnalytics();

  const useGroupsList = () => useGroupsQuery();
  const useGroupDetail = (groupId: number) => useGroupDetailQuery(groupId);
  const useGroupYearlyPlan = (groupId: number) => useYearlyPlanQuery(groupId);

  return { useGroupsList, useGroupDetail, useGroupYearlyPlan };
};
