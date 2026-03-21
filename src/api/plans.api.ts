import api from "./api";
import type {
  TreatmentComplex,
  TreatmentComplexRequest,
  PatchedTreatmentComplexRequest,
  YearlyPlan,
  YearlyPlanList,
  YearlyPlanListRequest,
  PatchedYearlyPlanListRequest,
  MonthlyGoal,
  MonthlyGoalItem,
  PatchedMonthlyGoalItemRequest,
  PaginatedTreatmentComplexList,
  PaginatedYearlyPlanList,
} from "../types/plans.types";

export class PlansAPI {
  // --- Treatment Complexes ---
  static async listTreatmentComplexes(page?: number): Promise<TreatmentComplex[]> {
    const response = await api.get<PaginatedTreatmentComplexList | TreatmentComplex[]>(
      "/v1/plans/treatment-complexes/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createTreatmentComplex(data: TreatmentComplexRequest): Promise<TreatmentComplex> {
    const response = await api.post<TreatmentComplex>("/v1/plans/treatment-complexes/", data);
    return response.data;
  }

  static async getTreatmentComplex(id: number): Promise<TreatmentComplex> {
    const response = await api.get<TreatmentComplex>(`/v1/plans/treatment-complexes/${id}/`);
    return response.data;
  }

  static async updateTreatmentComplex(id: number, data: TreatmentComplexRequest): Promise<TreatmentComplex> {
    const response = await api.put<TreatmentComplex>(`/v1/plans/treatment-complexes/${id}/`, data);
    return response.data;
  }

  static async patchTreatmentComplex(id: number, data: PatchedTreatmentComplexRequest): Promise<TreatmentComplex> {
    const response = await api.patch<TreatmentComplex>(`/v1/plans/treatment-complexes/${id}/`, data);
    return response.data;
  }

  static async deleteTreatmentComplex(id: number): Promise<void> {
    await api.delete(`/v1/plans/treatment-complexes/${id}/`);
  }

  // --- Yearly Plans ---
  static async listYearlyPlans(params?: { group_id?: number; page?: number }): Promise<YearlyPlanList[]> {
    const response = await api.get<PaginatedYearlyPlanList | YearlyPlanList[]>(
      "/v1/plans/yearly/",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createYearlyPlan(data: YearlyPlanListRequest): Promise<YearlyPlanList> {
    const response = await api.post<YearlyPlanList>("/v1/plans/yearly/", data);
    return response.data;
  }

  static async getYearlyPlan(id: number): Promise<YearlyPlan> {
    const response = await api.get<YearlyPlan>(`/v1/plans/yearly/${id}/`);
    return response.data;
  }

  static async updateYearlyPlan(id: number, data: YearlyPlanListRequest): Promise<YearlyPlanList> {
    const response = await api.put<YearlyPlanList>(`/v1/plans/yearly/${id}/`, data);
    return response.data;
  }

  static async patchYearlyPlan(id: number, data: PatchedYearlyPlanListRequest): Promise<YearlyPlanList> {
    const response = await api.patch<YearlyPlanList>(`/v1/plans/yearly/${id}/`, data);
    return response.data;
  }

  static async deleteYearlyPlan(id: number): Promise<void> {
    await api.delete(`/v1/plans/yearly/${id}/`);
  }

  static async generateAiPlan(id: number, data?: { group: number; start_date: string }): Promise<YearlyPlan> {
    const response = await api.post<YearlyPlan>(`/v1/plans/yearly/${id}/generate-ai/`, data ?? {});
    return response.data;
  }

  static async getMonthlyGoals(id: number): Promise<MonthlyGoal[]> {
    const response = await api.get<MonthlyGoal[]>(`/v1/plans/yearly/${id}/monthly-goals/`);
    return response.data;
  }

  // --- Monthly Goal Items ---
  static async patchMonthlyGoalItem(id: number, data: PatchedMonthlyGoalItemRequest): Promise<MonthlyGoalItem> {
    const response = await api.patch<MonthlyGoalItem>(
      `/v1/plans/monthly-goal-items/${id}/`,
      data
    );
    return response.data;
  }
}
