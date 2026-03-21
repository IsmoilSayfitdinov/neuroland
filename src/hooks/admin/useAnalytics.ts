import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/analytics.api";

export const useAnalytics = () => {
  // --- Admin ---
  const useAdminDashboard = () => useQuery({
    queryKey: ["analytics", "admin", "dashboard"],
    queryFn: () => AnalyticsAPI.getAdminDashboard(),
  });

  const useAdminActivity = () => useQuery({
    queryKey: ["analytics", "admin", "activity"],
    queryFn: () => AnalyticsAPI.getAdminActivity(),
  });

  const useAdminFinance = () => useQuery({
    queryKey: ["analytics", "admin", "finance"],
    queryFn: () => AnalyticsAPI.getAdminFinance(),
  });

  const useAdminChildGrowth = (childId: number) => useQuery({
    queryKey: ["analytics", "admin", "child-growth", childId],
    queryFn: () => AnalyticsAPI.getAdminChildGrowth(childId),
    enabled: !!childId,
  });

  const useAdminGroupAnalytics = (groupId: number) => useQuery({
    queryKey: ["analytics", "admin", "group", groupId],
    queryFn: () => AnalyticsAPI.getAdminGroupAnalytics(groupId),
    enabled: !!groupId,
  });

  const useAdminGroupMonthlyPlan = (groupId: number, month: number) => useQuery({
    queryKey: ["analytics", "admin", "group-monthly", groupId, month],
    queryFn: () => AnalyticsAPI.getAdminGroupMonthlyPlan(groupId, month),
    enabled: !!groupId && !!month,
  });

  const useAdminSpecialists = () => useQuery({
    queryKey: ["analytics", "admin", "specialists"],
    queryFn: () => AnalyticsAPI.getAdminSpecialists(),
  });

  const useAdminSpecialistDetail = (specialistId: number) => useQuery({
    queryKey: ["analytics", "admin", "specialist", specialistId],
    queryFn: () => AnalyticsAPI.getAdminSpecialistDetail(specialistId),
    enabled: !!specialistId,
  });

  // --- Doctor ---
  const useDoctorDashboard = () => useQuery({
    queryKey: ["analytics", "doctor", "dashboard"],
    queryFn: () => AnalyticsAPI.getDoctorDashboard(),
  });

  const useDoctorGroups = () => useQuery({
    queryKey: ["analytics", "doctor", "groups"],
    queryFn: () => AnalyticsAPI.getDoctorGroups(),
  });

  const useDoctorGroupDetail = (groupId: number) => useQuery({
    queryKey: ["analytics", "doctor", "group", groupId],
    queryFn: () => AnalyticsAPI.getDoctorGroupDetail(groupId),
    enabled: !!groupId,
  });

  const useDoctorGroupYearlyPlan = (groupId: number) => useQuery({
    queryKey: ["analytics", "doctor", "group-yearly", groupId],
    queryFn: () => AnalyticsAPI.getDoctorGroupYearlyPlan(groupId),
    enabled: !!groupId,
  });

  const useDoctorPatients = () => useQuery({
    queryKey: ["analytics", "doctor", "patients"],
    queryFn: () => AnalyticsAPI.getDoctorPatients(),
  });

  const useDoctorPatientDiagnostics = (childId: number) => useQuery({
    queryKey: ["analytics", "doctor", "patient-diagnostics", childId],
    queryFn: () => AnalyticsAPI.getDoctorPatientDiagnostics(childId),
    enabled: !!childId,
  });

  // --- Parent ---
  const useParentDashboard = () => useQuery({
    queryKey: ["analytics", "parent", "dashboard"],
    queryFn: () => AnalyticsAPI.getParentDashboard(),
  });

  const useParentProgress = () => useQuery({
    queryKey: ["analytics", "parent", "progress"],
    queryFn: () => AnalyticsAPI.getParentProgress(),
  });

  const useParentSections = () => useQuery({
    queryKey: ["analytics", "parent", "sections"],
    queryFn: () => AnalyticsAPI.getParentSections(),
  });

  const useParentWeeklyActivity = () => useQuery({
    queryKey: ["analytics", "parent", "weekly-activity"],
    queryFn: () => AnalyticsAPI.getParentWeeklyActivity(),
  });

  return {
    // Admin
    useAdminDashboard,
    useAdminActivity,
    useAdminFinance,
    useAdminChildGrowth,
    useAdminGroupAnalytics,
    useAdminGroupMonthlyPlan,
    useAdminSpecialists,
    useAdminSpecialistDetail,
    // Doctor
    useDoctorDashboard,
    useDoctorGroups,
    useDoctorGroupDetail,
    useDoctorGroupYearlyPlan,
    useDoctorPatients,
    useDoctorPatientDiagnostics,
    // Parent
    useParentDashboard,
    useParentProgress,
    useParentSections,
    useParentWeeklyActivity,
  };
};
