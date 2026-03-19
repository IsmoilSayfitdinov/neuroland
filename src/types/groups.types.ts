import type { SpecialistOut } from "./specialists.types";
import type { ChildOut } from "./children.types";

export type GroupShift = "morning" | "afternoon" | "evening";
export type GroupStatus = "active" | "new" | "diagnostika" | "completed" | "archive";

export interface GroupOut {
  id: number;
  name: string;
  shift: GroupShift;
  age_group_id: number;
  age_group_name: string;
  status: GroupStatus;
  start_date?: string | null;
  max_children: number;
  created_at: string;
  children_count: number;
  children: ChildOut[];
  specialists: SpecialistOut[];
}

export interface GroupCreateRequest {
  name: string;
  shift: GroupShift;
  age_group_id: number;
  status?: GroupStatus;
  start_date?: string | null;
  max_children?: number;
  specialist_ids: number[];
  child_ids: number[];
}

export interface GroupUpdateRequest {
  name?: string;
  shift?: GroupShift;
  age_group_id?: number;
  status?: GroupStatus;
  start_date?: string | null;
  max_children?: number;
  specialist_ids?: number[];
  child_ids?: number[];
}
