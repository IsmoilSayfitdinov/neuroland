import api from "./api";
import type {
  ChildOut,
  ChildDetailOut,
  ChildUserCreateRequest,
  PatchedChildUserUpdateRequest
} from "../types/children.types";

export class ChildrenAPI {
  /**
   * Yangi bola va uning profilini yaratish (Doctor/Admin)
   */
  static async create(data: ChildUserCreateRequest): Promise<ChildOut> {
    const hasFile = data.photo instanceof File;
    
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "specialist_assignments" && typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      });
      const response = await api.post<ChildOut>("/v1/children/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await api.post<ChildOut>("/v1/children/", data);
    return response.data;
  }

  /**
   * Bolalar ro'yxati (Admin: hammasi, Doctor: o'ziga biriktirilganlar)
   */
  static async getList(skip: number = 0, limit: number = 50): Promise<ChildOut[]> {
    const response = await api.get<ChildOut[]>("/v1/children/", {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Mening profilim - Bola o'z ma'lumotlarini olishi
   */
  static async getMe(includeAnamnesis: boolean = false): Promise<ChildDetailOut> {
    const response = await api.get<ChildDetailOut>("/v1/children/me/", {
      params: { include_anamnesis: includeAnamnesis }
    });
    return response.data;
  }

  /**
   * Bitta bola ma'lumoti
   */
  static async getById(childId: number, includeAnamnesis: boolean = false): Promise<ChildDetailOut> {
    const response = await api.get<ChildDetailOut>(`/v1/children/${childId}/`, {
      params: { include_anamnesis: includeAnamnesis }
    });
    return response.data;
  }

  /**
   * Bola ma'lumotlarini yangilash (Doctor/Admin)
   */
  static async update(childId: number, data: PatchedChildUserUpdateRequest): Promise<ChildOut> {
    // photo string URL bo'lsa olib tashlash — base64 qoldirish
    if (typeof data.photo === "string" && !data.photo.startsWith("data:") && !data.photo.startsWith("iVBOR")) {
      delete data.photo;
    }
    const hasFile = data.photo instanceof File;

    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });
      const response = await api.patch<ChildOut>(`/v1/children/${childId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await api.patch<ChildOut>(`/v1/children/${childId}/`, data);
    return response.data;
  }

  /**
   * Bolani o'chirish (Admin only)
   */
  static async delete(childId: number): Promise<void> {
    await api.delete(`/v1/children/${childId}/`);
  }

  /**
   * Bolani boshqa guruhga o'tkazish
   */
  static async transfer(childId: number, data: { new_group_id: number; reason?: string }): Promise<ChildOut> {
    const response = await api.post<ChildOut>(`/v1/children/${childId}/transfer/`, data);
    return response.data;
  }

  /**
   * Bolaning guruh o'tkazish tarixi
   */
  static async getTransferHistory(childId: number): Promise<any[]> {
    const response = await api.get(`/v1/children/${childId}/transfer_history/`);
    return response.data;
  }
}
