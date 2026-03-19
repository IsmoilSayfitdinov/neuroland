export type ExamType = "monthly" | "quarterly";

export type ScoreEnum = 0.0 | 0.5 | 1.0;

export interface ExamAnswer {
  id: number;
  exercise: number;
  exercise_name: string;
  section_name: string;
  age_group_name: string;
  score: ScoreEnum;
  answered_at: string;
}

export interface ExamAnswerRequest {
  exercise: number;
  score: ScoreEnum | string;
  answered_at: string;
}

export interface ExamResult {
  id: number;
  child: number;
  specialist: number | null;
  specialist_name: string;
  exam_type: ExamType;
  date: string;
  comment: string | null;
  ai_comparison: string | null;
  answers: ExamAnswer[];
}

export interface ExamResultList {
  id: number;
  child: number;
  specialist: number | null;
  specialist_name: string;
  exam_type: ExamType;
  date: string;
  comment: string | null;
}

export interface ExamResultRequest {
  child: number;
  exam_type: ExamType;
  month_number?: number;
  comment?: string | null;
  answers: ExamAnswerRequest[];
}

export interface ExamResultListRequest {
  child: number;
  specialist?: number | null;
  exam_type: ExamType;
  comment?: string | null;
}

export interface PatchedExamResultListRequest {
  child?: number;
  specialist?: number | null;
  exam_type?: ExamType;
  comment?: string | null;
}

export interface ExamSchedule {
  id: number;
  child: number;
  diagnostics_start: string;
  monthly_exam_date: string;
  quarterly_exam_date: string;
  next_monthly_exam: string | null;
  next_quarterly_exam: string | null;
}

export interface PaginatedExamResultList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExamResultList[];
}

export interface PaginatedExamScheduleList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExamSchedule[];
}
