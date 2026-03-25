export type XpReasonEnum =
  | "task_submitted"
  | "task_approved"
  | "exam_passed"
  | "session_attended";

export type ConditionType =
  | "xp_threshold"
  | "tasks_completed"
  | "tasks_approved"
  | "events_attended"
  | "and"
  | "or";

export interface SimpleConditionRules {
  type: "xp_threshold" | "tasks_completed" | "tasks_approved" | "events_attended";
  value: number;
}

export interface CompoundConditionRules {
  type: "and" | "or";
  rules: ConditionRules[];
}

export type ConditionRules = SimpleConditionRules | CompoundConditionRules;

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  condition_rules: ConditionRules;
  is_active: boolean;
}

export interface BadgeRequest {
  name: string;
  icon: string;
  description: string;
  condition_rules: ConditionRules;
  is_active: boolean;
}

export interface PatchedBadgeRequest {
  name?: string;
  icon?: string;
  description?: string;
  condition_rules?: ConditionRules;
  is_active?: boolean;
}

export interface ChildBadge {
  id: number;
  badge: Badge;
  earned_at: string;
}

export interface ChildXP {
  id: number;
  child: number;
  points: number;
  reason: XpReasonEnum;
  earned_at: string;
}

export interface TotalXP {
  child_id: number;
  total_xp: number;
}

export interface PaginatedBadgeList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Badge[];
}
