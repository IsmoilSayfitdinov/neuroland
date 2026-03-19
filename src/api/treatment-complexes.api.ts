import api from "./api";
import type {
  TreatmentComplex,
  TreatmentComplexRequest,
  PatchedTreatmentComplexRequest,
  PaginatedTreatmentComplexList,
} from "../types/treatment-complex.types";

export class TreatmentComplexesAPI {
  static async list(page?: number): Promise<TreatmentComplex[]> {
    const response = await api.get<PaginatedTreatmentComplexList | TreatmentComplex[]>(
      "/v1/plans/treatment-complexes/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async create(data: TreatmentComplexRequest): Promise<TreatmentComplex> {
    const response = await api.post<TreatmentComplex>("/v1/plans/treatment-complexes/", data);
    return response.data;
  }

  static async getById(id: number): Promise<TreatmentComplex> {
    const response = await api.get<TreatmentComplex>(`/v1/plans/treatment-complexes/${id}/`);
    return response.data;
  }

  static async update(id: number, data: TreatmentComplexRequest): Promise<TreatmentComplex> {
    const response = await api.put<TreatmentComplex>(`/v1/plans/treatment-complexes/${id}/`, data);
    return response.data;
  }

  static async patch(id: number, data: PatchedTreatmentComplexRequest): Promise<TreatmentComplex> {
    const response = await api.patch<TreatmentComplex>(`/v1/plans/treatment-complexes/${id}/`, data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/v1/plans/treatment-complexes/${id}/`);
  }
}
