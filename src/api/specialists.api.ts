import api from "./api";
import type {
  SpecialistTypeOut,
  SpecialistTypeCreateRequest,
  PatchedSpecialistTypeUpdateRequest,
  SpecialistOut,
  SpecialistUserCreateRequest,
  PatchedSpecialistUserUpdateRequest
} from "../types/specialists.types";

export class SpecialistsAPI {
  // --- Specialist Types (Roles) ---
  static async listSpecialistTypes(): Promise<SpecialistTypeOut[]> {
    const response = await api.get<SpecialistTypeOut[]>("/v1/specialists/types/");
    return response.data;
  }

  static async createSpecialistType(data: SpecialistTypeCreateRequest): Promise<SpecialistTypeOut> {
    const response = await api.post<SpecialistTypeOut>("/v1/specialists/types/", data);
    return response.data;
  }

  /**
   * Mutaxassis turini yangilash (PUT)
   */
  static async updateSpecialistType(id: number, data: PatchedSpecialistTypeUpdateRequest): Promise<SpecialistTypeOut> {
    const response = await api.put<SpecialistTypeOut>(`/v1/specialists/types/${id}/`, data);
    return response.data;
  }

  /**
   * Mutaxassis turini o'chirish
   */
  static async deleteSpecialistType(id: number): Promise<void> {
    await api.delete(`/v1/specialists/types/${id}/`);
  }

  // --- Specialists ---
  /**
   * Mutaxassislar ro'yxati
   */
  static async getSpecialistsList(): Promise<SpecialistOut[]> {
    const response = await api.get<SpecialistOut[]>("/v1/specialists/");
    return response.data;
  }

  /**
   * Mutaxassis ma'lumotlarini olish
   */
  static async getSpecialistDetail(id: number): Promise<SpecialistOut> {
    const response = await api.get<SpecialistOut>(`/v1/specialists/${id}/`);
    return response.data;
  }

  /**
   * Mutaxassis yaratish (POST)
   */
  static async createSpecialist(data: SpecialistUserCreateRequest): Promise<SpecialistOut> {
    const hasFile = data.photo instanceof File;

    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'work_days') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });
      const response = await api.post<SpecialistOut>("/v1/specialists/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await api.post<SpecialistOut>("/v1/specialists/", data);
    return response.data;
  }

  /**
   * Mutaxassisni yangilash - Swagger spec requires PUT not PATCH
   */
  static async updateSpecialist(id: number, data: PatchedSpecialistUserUpdateRequest): Promise<SpecialistOut> {
    // photo string URL bo'lsa olib tashlash — base64 qoldirish
    const cleaned = { ...data };
    if (typeof cleaned.photo === "string" && !cleaned.photo.startsWith("data:") && !cleaned.photo.startsWith("iVBOR")) {
      delete cleaned.photo;
    }

    const hasFile = cleaned.photo instanceof File;

    if (hasFile) {
      const formData = new FormData();
      Object.entries(cleaned).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'work_days' || (typeof value === 'object' && !(value instanceof File))) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });
      const response = await api.put<SpecialistOut>(`/v1/specialists/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await api.put<SpecialistOut>(`/v1/specialists/${id}/`, cleaned);
    return response.data;
  }

  static async deleteSpecialist(specialistId: number): Promise<void> {
    await api.delete(`/v1/specialists/${specialistId}/`);
  }
}
