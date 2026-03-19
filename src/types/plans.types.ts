export type ComplexNumber = 1 | 2 | 3 | 4;

export interface TreatmentComplex {
  id: number;
  number: ComplexNumber;
  name: string;
  age_min_year: number;
  age_max_year: number;
  description?: string | null;
}

export interface TreatmentComplexRequest {
  number: ComplexNumber;
  name: string;
  age_min_year: number;
  age_max_year: number;
  description?: string | null;
}

export interface PatchedTreatmentComplexRequest {
  number?: ComplexNumber;
  name?: string;
  age_min_year?: number;
  age_max_year?: number;
  description?: string | null;
}

export interface MonthlyGoalItem {
  id: number;
  exercise: number;
  exercise_name: string;
  section_name: string;
  current_score: number;
  target_score: number;
  is_mastered?: boolean;
  topic?: number | null;
}

export interface PatchedMonthlyGoalItemRequest {
  exercise?: number;
  is_mastered?: boolean;
  topic?: number | null;
}

export interface MonthlyGoal {
  id: number;
  month_number: number;
  notes?: string | null;
  items: MonthlyGoalItem[];
}

export interface ChildRecommendation {
  id: number;
  child: number;
  child_name: string;
  ai_notes: string;
  created_at: string;
}

export interface YearlyPlan {
  id: number;
  group: number;
  group_name: string;
  ai_summary: string;
  start_date: string;
  monthly_goals: MonthlyGoal[];
  child_recommendations: ChildRecommendation[];
  created_at: string;
}

export interface YearlyPlanList {
  id: number;
  group: number;
  group_name: string;
  start_date: string;
  created_at: string;
}

export interface YearlyPlanListRequest {
  group: number;
  start_date: string;
}

export interface PatchedYearlyPlanListRequest {
  group?: number;
  start_date?: string;
}

export interface PaginatedTreatmentComplexList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TreatmentComplex[];
}

export interface PaginatedYearlyPlanList {
  count: number;
  next: string | null;
  previous: string | null;
  results: YearlyPlanList[];
}
