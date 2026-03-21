import api from "./api";
import type {
  ExamResult,
  ExamResultList,
  ExamResultRequest,
  ExamResultListRequest,
  PatchedExamResultListRequest,
  ExamSchedule,
  PaginatedExamResultList,
  PaginatedExamScheduleList,
} from "../types/exam.types";

export class ExamsAPI {
  // --- Results ---

  static async listResults(params?: {
    child_id?: number;
    exam_type?: "monthly" | "quarterly";
    page?: number;
  }): Promise<ExamResultList[]> {
    const response = await api.get<PaginatedExamResultList | ExamResultList[]>(
      "/v1/exams/results/",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createResult(data: ExamResultRequest): Promise<ExamResult> {
    const response = await api.post<ExamResult>("/v1/exams/results/", data);
    return response.data;
  }

  static async getResultById(id: number): Promise<ExamResult> {
    const response = await api.get<ExamResult>(`/v1/exams/results/${id}/`);
    return response.data;
  }

  static async updateResult(
    id: number,
    data: ExamResultListRequest
  ): Promise<ExamResultList> {
    const response = await api.put<ExamResultList>(
      `/v1/exams/results/${id}/`,
      data
    );
    return response.data;
  }

  static async patchResult(
    id: number,
    data: PatchedExamResultListRequest
  ): Promise<ExamResultList> {
    const response = await api.patch<ExamResultList>(
      `/v1/exams/results/${id}/`,
      data
    );
    return response.data;
  }

  static async deleteResult(id: number): Promise<void> {
    await api.delete(`/v1/exams/results/${id}/`);
  }

  static async generateComparison(
    id: number,
    data: ExamResultListRequest
  ): Promise<ExamResultList> {
    const response = await api.post<ExamResultList>(
      `/v1/exams/results/${id}/generate-comparison/`,
      data
    );
    return response.data;
  }

  static async getQuestions(params: {
    child_id: number;
    exam_type: "monthly" | "quarterly";
  }): Promise<any> {
    const response = await api.get("/v1/exams/results/questions/", { params });
    return response.data;
  }

  // --- Schedule ---

  static async listSchedules(page?: number): Promise<ExamSchedule[]> {
    const response = await api.get<PaginatedExamScheduleList | ExamSchedule[]>(
      "/v1/exams/schedule/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getScheduleById(id: number): Promise<ExamSchedule> {
    const response = await api.get<ExamSchedule>(`/v1/exams/schedule/${id}/`);
    return response.data;
  }
}
