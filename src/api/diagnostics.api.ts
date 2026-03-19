import api from "./api";
import type {
  SectionGroupedExercise,
  DiagnosticResult,
  DiagnosticResultRequest
} from "@/types/diagnostics.types";

interface PaginatedDiagnosticResultList {
  count: number;
  next: string | null;
  previous: string | null;
  results: DiagnosticResult[];
}

export class DiagnosticsAPI {
  /**
   * Barcha diagnostika mashqlarini guruhlangan holda olish
   */
  static async getQuestions(): Promise<SectionGroupedExercise[]> {
    const response = await api.get<SectionGroupedExercise[]>("/v1/diagnostics/questions/");
    return response.data;
  }

  /**
   * Barcha test natijalari (Admin/Doctor)
   */
  static async getResults(params?: { child_id?: number; page?: number }): Promise<DiagnosticResult[]> {
    const response = await api.get<PaginatedDiagnosticResultList | DiagnosticResult[]>(
      "/v1/diagnostics/results/",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  /**
   * Yangi diagnostika natijasini saqlash
   */
  static async createResult(data: DiagnosticResultRequest): Promise<DiagnosticResult> {
    const response = await api.post<DiagnosticResult>("/v1/diagnostics/results/", data);
    return response.data;
  }

  /**
   * Bitta test natijasini to'liq ko'rish
   */
  static async getResultById(id: number): Promise<DiagnosticResult> {
    const response = await api.get<DiagnosticResult>(`/v1/diagnostics/results/${id}/`);
    return response.data;
  }

  /**
   * Diagnostika natijasini o'chirish (Faqat Admin)
   */
  static async deleteResult(id: number): Promise<void> {
    await api.delete(`/v1/diagnostics/results/${id}/`);
  }
}
