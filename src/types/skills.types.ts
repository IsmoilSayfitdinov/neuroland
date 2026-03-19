export interface AgeGroupOut {
  id: number;
  name: string;
  sections: SectionOut[];
}

export interface SectionOut {
  id: number;
  age_group_id: number;
  name: string;
  percentage: number;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  exercises_count: number;
}

export interface ExerciseOut {
  id: number;
  section_id: number;
  name: string;
  video_url?: string | null;
  status: string;
  percentage: number;
}

// Request Types
export interface AgeGroupCreateRequest {
  name: string;
}

export interface SectionCreateRequest {
  name: string;
  percentage: number;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  age_group_id: number;
}

export interface PatchedSectionUpdateRequest {
  name?: string;
  percentage?: number;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
}

export interface ExerciseCreateRequest {
  name: string;
  video_url?: string | null;
  status: string;
  section_id: number;
}

export interface PatchedExerciseUpdateRequest {
  name?: string;
  video_url?: string | null;
  status?: string;
}

