import api from "./api";
import type {
  MonthlyMeeting,
  MonthlyMeetingRequest,
  PatchedMonthlyMeetingRequest,
  MeetingGoalReview,
  MeetingGoalReviewRequest,
  MothersEvent,
  MothersEventRequest,
  PatchedMothersEventRequest,
  PaginatedMonthlyMeetingList,
  PaginatedMothersEventList,
} from "../types/meetings.types";

export class MeetingsAPI {
  // --- Monthly Meetings ---
  static async listMonthlyMeetings(page?: number): Promise<MonthlyMeeting[]> {
    const response = await api.get<PaginatedMonthlyMeetingList | MonthlyMeeting[]>(
      "/v1/meetings/monthly/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createMonthlyMeeting(data: MonthlyMeetingRequest): Promise<MonthlyMeeting> {
    const response = await api.post<MonthlyMeeting>("/v1/meetings/monthly/", data);
    return response.data;
  }

  static async getMonthlyMeeting(id: number): Promise<MonthlyMeeting> {
    const response = await api.get<MonthlyMeeting>(`/v1/meetings/monthly/${id}/`);
    return response.data;
  }

  static async updateMonthlyMeeting(id: number, data: MonthlyMeetingRequest): Promise<MonthlyMeeting> {
    const response = await api.put<MonthlyMeeting>(`/v1/meetings/monthly/${id}/`, data);
    return response.data;
  }

  static async patchMonthlyMeeting(id: number, data: PatchedMonthlyMeetingRequest): Promise<MonthlyMeeting> {
    const response = await api.patch<MonthlyMeeting>(`/v1/meetings/monthly/${id}/`, data);
    return response.data;
  }

  static async deleteMonthlyMeeting(id: number): Promise<void> {
    await api.delete(`/v1/meetings/monthly/${id}/`);
  }

  static async addGoalReview(id: number, data: MeetingGoalReviewRequest): Promise<MeetingGoalReview> {
    const response = await api.post<MeetingGoalReview>(
      `/v1/meetings/monthly/${id}/goal-reviews/`,
      data
    );
    return response.data;
  }

  static async addGoalReviews(id: number, reviews: { monthly_goal_item: number; comment: string }[]): Promise<any> {
    const response = await api.post(
      `/v1/meetings/monthly/${id}/goal-reviews/`,
      reviews
    );
    return response.data;
  }

  // --- Mothers Events ---
  static async listMothersEvents(page?: number): Promise<MothersEvent[]> {
    const response = await api.get<PaginatedMothersEventList | MothersEvent[]>(
      "/v1/meetings/mothers-events/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createMothersEvent(data: MothersEventRequest): Promise<MothersEvent> {
    const response = await api.post<MothersEvent>("/v1/meetings/mothers-events/", data);
    return response.data;
  }

  static async getMothersEvent(id: number): Promise<MothersEvent> {
    const response = await api.get<MothersEvent>(`/v1/meetings/mothers-events/${id}/`);
    return response.data;
  }

  static async updateMothersEvent(id: number, data: MothersEventRequest): Promise<MothersEvent> {
    const response = await api.put<MothersEvent>(`/v1/meetings/mothers-events/${id}/`, data);
    return response.data;
  }

  static async patchMothersEvent(id: number, data: PatchedMothersEventRequest): Promise<MothersEvent> {
    const response = await api.patch<MothersEvent>(`/v1/meetings/mothers-events/${id}/`, data);
    return response.data;
  }

  static async deleteMothersEvent(id: number): Promise<void> {
    await api.delete(`/v1/meetings/mothers-events/${id}/`);
  }

  static async markMothersEventComplete(id: number): Promise<MothersEvent> {
    const response = await api.post<MothersEvent>(
      `/v1/meetings/mothers-events/${id}/mark-complete/`
    );
    return response.data;
  }
}
