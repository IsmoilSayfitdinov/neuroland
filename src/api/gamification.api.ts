import api from "./api";
import type {
  Badge,
  ChildBadge,
  ChildXP,
  TotalXP,
  PaginatedBadgeList,
} from "../types/gamification.types";

export class GamificationAPI {
  // --- Badges ---
  static async listBadges(page?: number): Promise<Badge[]> {
    const response = await api.get<PaginatedBadgeList | Badge[]>(
      "/v1/gamification/badges/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getBadge(id: number): Promise<Badge> {
    const response = await api.get<Badge>(`/v1/gamification/badges/${id}/`);
    return response.data;
  }

  // --- Child Badges ---
  static async getChildBadges(childId: number): Promise<ChildBadge[]> {
    const response = await api.get<ChildBadge[]>(
      `/v1/gamification/child/${childId}/badges/`
    );
    return response.data;
  }

  // --- Child XP ---
  static async getChildXpHistory(childId: number): Promise<ChildXP[]> {
    const response = await api.get<ChildXP[]>(
      `/v1/gamification/child/${childId}/xp/`
    );
    return response.data;
  }

  static async getChildTotalXp(childId: number): Promise<TotalXP> {
    const response = await api.get<TotalXP>(
      `/v1/gamification/child/${childId}/total-xp/`
    );
    return response.data;
  }
}
