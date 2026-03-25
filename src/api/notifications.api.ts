import api from "./api";
import type {
  Notification,
  NotificationRequest,
  PatchedNotificationRequest,
  UnreadCount,
  PaginatedNotificationList,
} from "../types/notifications.types";

export class NotificationsAPI {
  static async listNotifications(page?: number): Promise<Notification[]> {
    const response = await api.get<PaginatedNotificationList | Notification[]>(
      "/v1/notifications/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getNotification(id: number): Promise<Notification> {
    const response = await api.get<Notification>(`/v1/notifications/${id}/`);
    return response.data;
  }

  static async patchNotification(id: number, data: PatchedNotificationRequest): Promise<Notification> {
    const response = await api.patch<Notification>(`/v1/notifications/${id}/`, data);
    return response.data;
  }

  static async markAsRead(id: number): Promise<Notification> {
    const response = await api.patch<Notification>(`/v1/notifications/${id}/read/`);
    return response.data;
  }

  static async markAllAsRead(): Promise<void> {
    await api.post("/v1/notifications/mark-all-read/");
  }

  static async getUnreadCount(): Promise<UnreadCount> {
    const response = await api.get<UnreadCount>("/v1/notifications/unread-count/");
    return response.data;
  }

  static async createNotification(data: NotificationRequest): Promise<Notification> {
    const response = await api.post<Notification>("/v1/notifications/", data);
    return response.data;
  }

  static async updateNotification(id: number, data: NotificationRequest): Promise<Notification> {
    const response = await api.put<Notification>(`/v1/notifications/${id}/`, data);
    return response.data;
  }

  static async deleteNotification(id: number): Promise<void> {
    await api.delete(`/v1/notifications/${id}/`);
  }

}
