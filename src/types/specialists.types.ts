// Flat structure matching API response exactly

export interface SpecialistTypeOut {
  id: number;
  title: string;
  task?: string | null;
}

/** Summary of a group assigned to a specialist (nested inside SpecialistOut) */
export interface SpecialistGroupOut {
  id: number;
  name: string;
  status: 'active' | 'new' | 'diagnostika' | 'completed' | 'archive';
  start_date: string;
  children_count: number;
}

/** Full specialist response from API - flat structure */
export interface SpecialistOut {
  id: number;
  user_id: number;
  specialist_type_id: number;
  shift?: string | null;
  work_days?: string | null;
  max_patients: number;
  max_groups: number;
  weekly_hour_limit: number;
  is_certified: boolean;
  fio: string;
  phone_number: string;
  email?: string | null;
  photo?: string | null;
  specialist_type_title: string;
  assigned_children_count: number;
  active_groups_count: number;
  average_progress: number;
  parent_rating: number;
  assigned_groups: SpecialistGroupOut[];
}

export interface SpecialistUserCreateRequest {
  fio: string;
  phone_number: string;
  password?: string;
  email?: string | null;
  photo?: string | File | null;
  specialist_type_id: number;
  shift: string;
  work_days: string;
  max_patients?: number;
  max_groups?: number;
  weekly_hour_limit?: number;
  is_certified?: boolean;
}

/** Used for PUT /api/v1/specialists/{id}/ - all fields required by the backend */
export interface SpecialistUserUpdateRequest {
  fio: string;
  phone_number: string;
  email?: string | null;
  photo?: string | File | null;
  specialist_type_id: number;
  shift: string;
  work_days: string;
  max_patients?: number;
  max_groups?: number;
  weekly_hour_limit?: number;
  is_certified?: boolean;
}

/** This alias keeps backward compat with hooks using the old name */
export type PatchedSpecialistUserUpdateRequest = Partial<SpecialistUserUpdateRequest>;

export interface SpecialistTypeCreateRequest {
  title: string;
  task?: string | null;
}

export interface PatchedSpecialistTypeUpdateRequest {
  title?: string;
  task?: string | null;
}
