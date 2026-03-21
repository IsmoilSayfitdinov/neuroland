import api from "./api";
import type {
  AdminDashboard,
  AdminActivity,
  AdminFinance,
  AdminGroupAnalytics,
  AdminGroupMonthlyPlan,
  AdminSpecialist,
  AdminSpecialistsResponse,
  AdminSpecialistDetail,
  AdminChildGrowth,
  DoctorDashboard,
  DoctorGroup,
  DoctorGroupsResponse,
  DoctorGroupDetail,
  DoctorGroupYearlyPlan,
  DoctorPatient,
  DoctorPatientsResponse,
  DoctorPatientDiagnostics,
  ParentDashboard,
  ParentProgress,
  ParentSection,
  ParentWeeklyActivity,
} from "../types/analytics.types";

export class AnalyticsAPI {
  // --- Admin ---

  static async getAdminDashboard(): Promise<AdminDashboard> {
    const response = await api.get<AdminDashboard>("/v1/analytics/admin/dashboard/");
    return response.data;
  }

  static async getAdminActivity(): Promise<AdminActivity> {
    const response = await api.get<AdminActivity>("/v1/analytics/admin/activity/");
    return response.data;
  }

  static async getAdminFinance(): Promise<AdminFinance> {
    const response = await api.get<AdminFinance>("/v1/analytics/admin/finance/");
    return response.data;
  }

  static async getAdminChildGrowth(childId: number): Promise<AdminChildGrowth> {
    const response = await api.get<AdminChildGrowth>(
      `/v1/analytics/admin/children/${childId}/growth/`
    );
    return response.data;
  }

  static async getAdminGroupAnalytics(groupId: number): Promise<AdminGroupAnalytics> {
    const response = await api.get<AdminGroupAnalytics>(
      `/v1/analytics/admin/groups/${groupId}/`
    );
    return response.data;
  }

  static async getAdminGroupMonthlyPlan(
    groupId: number,
    month: number
  ): Promise<AdminGroupMonthlyPlan> {
    const response = await api.get<AdminGroupMonthlyPlan>(
      `/v1/analytics/admin/groups/${groupId}/monthly-plan/${month}/`
    );
    return response.data;
  }

  static async getAdminSpecialists(): Promise<AdminSpecialist[]> {
    const response = await api.get<AdminSpecialistsResponse>("/v1/analytics/admin/specialists/");
    return response.data.specialists;
  }

  static async getAdminSpecialistDetail(specialistId: number): Promise<AdminSpecialistDetail> {
    const response = await api.get<AdminSpecialistDetail>(
      `/v1/analytics/admin/specialists/${specialistId}/`
    );
    return response.data;
  }

  // --- Doctor ---

  static async getDoctorDashboard(): Promise<DoctorDashboard> {
    const response = await api.get<DoctorDashboard>("/v1/analytics/doctor/dashboard/");
    return response.data;
  }

  static async getDoctorGroups(): Promise<DoctorGroup[]> {
    const response = await api.get<DoctorGroupsResponse>("/v1/analytics/doctor/groups/");
    return response.data.groups;
  }

  static async getDoctorGroupDetail(groupId: number): Promise<DoctorGroupDetail> {
    const response = await api.get<DoctorGroupDetail>(
      `/v1/analytics/doctor/groups/${groupId}/`
    );
    return response.data;
  }

  static async getDoctorGroupYearlyPlan(groupId: number): Promise<DoctorGroupYearlyPlan> {
    const response = await api.get<DoctorGroupYearlyPlan>(
      `/v1/analytics/doctor/groups/${groupId}/yearly-plan/`
    );
    return response.data;
  }

  static async getDoctorPatients(): Promise<DoctorPatient[]> {
    const response = await api.get<DoctorPatientsResponse>("/v1/analytics/doctor/patients/");
    return response.data.patients;
  }

  static async getDoctorPatientDiagnostics(childId: number): Promise<DoctorPatientDiagnostics> {
    const response = await api.get<DoctorPatientDiagnostics>(
      `/v1/analytics/doctor/patients/${childId}/diagnostics/`
    );
    return response.data;
  }

  // --- Parent ---

  static async getParentDashboard(): Promise<ParentDashboard> {
    const response = await api.get<ParentDashboard>("/v1/analytics/parent/dashboard/");
    return response.data;
  }

  static async getParentProgress(): Promise<ParentProgress> {
    const response = await api.get<ParentProgress>("/v1/analytics/parent/progress/");
    return response.data;
  }

  static async getParentSections(): Promise<ParentSection[]> {
    const response = await api.get<{ sections: ParentSection[] }>("/v1/analytics/parent/sections/");
    return response.data.sections;
  }

  static async getParentWeeklyActivity(): Promise<ParentWeeklyActivity> {
    const response = await api.get<ParentWeeklyActivity>("/v1/analytics/parent/weekly-activity/");
    return response.data;
  }
}
