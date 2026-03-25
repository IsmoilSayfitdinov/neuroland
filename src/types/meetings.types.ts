export type EventTypeEnum = "weekly_session" | "monthly_training";

export interface MeetingGoalReview {
  id: number;
  meeting: number;
  monthly_goal_item: number;
  exercise_name: string;
  is_completed?: boolean;
  new_target_score?: number | null;
}

export interface MeetingGoalReviewRequest {
  monthly_goal_item: number;
  is_completed?: boolean;
  new_target_score?: number | null;
}

export interface MonthlyMeeting {
  id: number;
  child: number;
  child_name: string;
  specialists?: number[];
  scheduled_date: string;
  is_completed?: boolean;
  notes?: string | null;
  created_at: string;
  goal_reviews: MeetingGoalReview[];
}

export interface MonthlyMeetingRequest {
  child: number;
  specialists?: number[];
  scheduled_date: string;
  is_completed?: boolean;
  notes?: string | null;
}

export interface PatchedMonthlyMeetingRequest {
  child?: number;
  specialists?: number[];
  scheduled_date?: string;
  is_completed?: boolean;
  notes?: string | null;
}

export interface MothersEventParticipant {
  id: number;
  event: number;
  child: number;
  child_name: string;
  is_present?: boolean;
}

export interface MothersEventParticipantRequest {
  child: number;
  is_present?: boolean;
}

export interface MothersEvent {
  id: number;
  title: string;
  description?: string | null;
  event_type: EventTypeEnum;
  scheduled_date: string;
  scheduled_time?: string | null;
  created_by: number | null;
  groups?: number[];
  all_children?: boolean;
  is_completed?: boolean;
  created_at: string;
  participants: MothersEventParticipant[];
}

export interface MothersEventRequest {
  title: string;
  description?: string | null;
  event_type: EventTypeEnum;
  scheduled_date: string;
  scheduled_time?: string | null;
  groups?: number[];
  all_children?: boolean;
  is_completed?: boolean;
}

export interface PatchedMothersEventRequest {
  title?: string;
  description?: string | null;
  event_type?: EventTypeEnum;
  scheduled_date?: string;
  scheduled_time?: string | null;
  groups?: number[];
  all_children?: boolean;
  is_completed?: boolean;
}

export interface PaginatedMonthlyMeetingList {
  count: number;
  next: string | null;
  previous: string | null;
  results: MonthlyMeeting[];
}

export interface PaginatedMothersEventList {
  count: number;
  next: string | null;
  previous: string | null;
  results: MothersEvent[];
}
