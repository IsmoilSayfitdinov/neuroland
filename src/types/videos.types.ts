export interface VideoOut {
  id: number;
  age_group_id: number;
  section_id: number;
  exercise_id?: number | null;
  title: string;
  video_url: string;
  thumbnail_url?: string | null;
  duration?: string | null;
  equipments?: string | null;
}

export interface VideoCreateRequest {
  title: string;
  video_url: string;
  duration?: string | null;
  equipments?: string | null;
  age_group_id: number;
  section_id: number;
  exercise_id?: number | null;
}

export interface PatchedVideoUpdateRequest {
  title?: string;
  video_url?: string;
  duration?: string | null;
  equipments?: string | null;
  age_group_id?: number;
  section_id?: number;
  exercise_id?: number | null;
}

