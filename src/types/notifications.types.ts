export type NotificationTypeEnum =
  | "task_assigned"
  | "task_approved"
  | "task_rejected"
  | "payment_due"
  | "meeting_scheduled"
  | "badge_earned"
  | "session_reminder"
  | "exam_coming"
  | "monthly_training"
  | "topic_changed";

export interface Notification {
  id: number;
  recipient: number;
  type: NotificationTypeEnum;
  title: string;
  body: string;
  is_read?: boolean;
  related_object_id?: number | null;
  created_at: string;
}

export interface NotificationRequest {
  type: NotificationTypeEnum;
  title: string;
  body: string;
  is_read?: boolean;
  related_object_id?: number | null;
}

export interface PatchedNotificationRequest {
  type?: NotificationTypeEnum;
  title?: string;
  body?: string;
  is_read?: boolean;
  related_object_id?: number | null;
}

export interface UnreadCount {
  unread_count: number;
}

export interface PaginatedNotificationList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}
