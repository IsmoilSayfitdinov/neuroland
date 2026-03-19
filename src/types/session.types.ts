export type SessionType = "group" | "mini_group" | "individual";
export type WeekdayEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type HomeTaskStatus = "pending" | "submitted" | "approved" | "rejected";

// --- Session ---

export interface Session {
  id: number;
  schedule_slot: number | null;
  specialist: number | null;
  specialist_name: string;
  group: number | null;
  group_name: string;
  child: number | null;
  topic: number | null;
  topic_title: string;
  date: string;
  start_time: string;
  is_started: boolean;
  started_at: string | null;
  ended_at: string | null;
}

export interface SessionRequest {
  schedule_slot?: number | null;
  specialist?: number | null;
  group?: number | null;
  child?: number | null;
  topic?: number | null;
  date: string;
  start_time: string;
}

export interface PatchedSessionRequest {
  schedule_slot?: number | null;
  specialist?: number | null;
  group?: number | null;
  child?: number | null;
  topic?: number | null;
  date?: string;
  start_time?: string;
}

export interface PaginatedSessionList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Session[];
}

// --- Schedule Slot ---

export interface ScheduleSlot {
  id: number;
  specialist: number;
  specialist_name: string;
  group: number | null;
  group_name: string;
  child: number | null;
  session_type: SessionType;
  weekday: WeekdayEnum;
  start_time: string;
  duration_min: number;
  is_active: boolean;
}

export interface ScheduleSlotRequest {
  specialist: number;
  group?: number | null;
  child?: number | null;
  session_type: SessionType;
  weekday: WeekdayEnum;
  start_time: string;
  duration_min?: number;
  is_active?: boolean;
}

export interface PatchedScheduleSlotRequest {
  specialist?: number;
  group?: number | null;
  child?: number | null;
  session_type?: SessionType;
  weekday?: WeekdayEnum;
  start_time?: string;
  duration_min?: number;
  is_active?: boolean;
}

export interface PaginatedScheduleSlotList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ScheduleSlot[];
}

// --- Home Task ---

export interface HomeTaskItem {
  id: number;
  topic_exercise: number | null;
  exercise: number | null;
  title: string;
  score_target: number;
  xp_reward: number;
}

export interface HomeTaskItemRequest {
  topic_exercise?: number | null;
  exercise?: number | null;
  title: string;
  score_target?: number;
  xp_reward?: number;
}

export interface HomeTask {
  id: number;
  child: number;
  child_name: string;
  session: number | null;
  specialist: number | null;
  specialist_name: string;
  due_date: string;
  late_due_date: string | null;
  status: HomeTaskStatus;
  evidence_file: string | null;
  submitted_at: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  items: HomeTaskItem[];
}

export interface HomeTaskRequest {
  child: number;
  session?: number | null;
  specialist?: number | null;
  due_date: string;
  late_due_date?: string | null;
  evidence_file?: File | null;
  rejection_reason?: string | null;
  items?: HomeTaskItemRequest[];
}

export interface PatchedHomeTaskRequest {
  child?: number;
  session?: number | null;
  specialist?: number | null;
  due_date?: string;
  late_due_date?: string | null;
  evidence_file?: File | null;
  rejection_reason?: string | null;
  items?: HomeTaskItemRequest[];
}

export interface PaginatedHomeTaskList {
  count: number;
  next: string | null;
  previous: string | null;
  results: HomeTask[];
}

// --- Attendance ---

export interface AttendanceEntry {
  child: number;
  is_present: boolean;
  note?: string;
}

export interface AttendanceResult {
  id: number;
  session: number;
  child: number;
  child_name: string;
  is_present: boolean;
  note: string;
}

// --- Session Report ---

export interface SessionReport {
  id: number;
  session: number;
  specialist: number;
  game_name: string;
  notes: string;
  created_at: string;
  media: SessionReportMedia[];
}

export interface SessionReportRequest {
  game_name: string;
  notes: string;
}

export interface SessionReportMedia {
  id: number;
  report: number;
  file: string;
  media_type: "image" | "video";
  uploaded_at: string;
}

// --- Home Task Actions ---

export interface HomeTaskReviewRequest {
  decision: "approved" | "rejected";
  rejection_reason?: string;
}
