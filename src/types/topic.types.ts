export interface TopicExercise {
  id: number;
  topic: number;
  exercise: number | null;
  exercise_name: string;
  title: string;
  video: number | null;
  video_url: string | null;
  video_title?: string | null;
  instruction?: string | null;
  order?: number;
  notes: string | null;
  added_by: number | null;
  added_by_name: string;
  created_at: string;
}

export interface TopicExerciseRequest {
  exercise?: number | null;
  video?: number | null;
  order?: number;
  instruction?: string | null;
}

export interface TopicGroupAssignment {
  id: number;
  topic: number;
  group: number;
  group_name: string;
  week_start: string;
  is_active: boolean;
  assigned_by: number | null;
}

export interface TopicList {
  id: number;
  title: string;
  category: number | null;
  start_date: string;
  end_date: string;
  active_groups: string[];
}

export interface TopicListRequest {
  title: string;
  description?: string | null;
  category?: number | null;
  start_date?: string;
  end_date?: string;
}

export interface PatchedTopicListRequest {
  title?: string;
  category?: number | null;
  start_date?: string;
  end_date?: string;
}

export interface Topic {
  id: number;
  title: string;
  category: number | null;
  start_date: string;
  end_date: string;
  created_by: number | null;
  created_by_name: string;
  created_at: string;
  exercises: TopicExercise[];
  group_assignments: TopicGroupAssignment[];
}

export interface PaginatedTopicList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TopicList[];
}

export interface PaginatedTopicExerciseList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TopicExercise[];
}

export interface TopicExerciseProgress {
  id: number;
  topic_exercise: number;
  user: number;
  started_at: string;
  ended_at: string | null;
}
