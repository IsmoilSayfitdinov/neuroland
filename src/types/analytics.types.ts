// --- Admin Analytics ---

export interface AdminDashboard {
  active_children: {
    count: number;
    growth_percent: number;
  };
  new_this_month: {
    count: number;
    prev_month_count: number;
  };
  completed_this_year: number;
  overall_avg_percent: number;
  mental_age_growth_avg: number;
  debtors_count: number;
  parent_activity_percent: number;
}

export interface ActiveFamily {
  child_id: number;
  child_name: string;
  activity_score: number;
}

export interface HeatmapHour {
  hour: number;
  count: number;
  intensity: number;
}

export interface HeatmapDay {
  day: string;
  hours: HeatmapHour[];
}

export interface AdminActivity {
  task_completion: {
    percent: number;
    growth: number;
  };
  locked_families: {
    months: number;
    families_count: number;
  };
  top_families: ActiveFamily[];
  knowledge_level: number;
  heatmap: HeatmapDay[];
}

export interface TariffCard {
  id: number;
  name: string;
  price: number;
  sessions_per_week: number;
  subscribers_count: number;
}

export interface TariffTrend {
  month: string;
  year: number;
  plans: Record<string, number>;
}

export interface PaymentJournalEntry {
  id: number;
  child_name: string;
  parent_name: string;
  plan_name: string;
  amount: number;
  payment_date: string;
  status: string;
  method: string;
}

export interface AdminFinance {
  monthly_revenue: number;
  revenue_growth_percent: number;
  forecast: number;
  tariff_count: number;
  health_percent: number;
  tariff_cards: TariffCard[];
  tariff_trend: TariffTrend[];
  payment_journal: PaymentJournalEntry[];
}

export interface AdminGroupAnalytics {
  group: {
    id: number;
    name: string;
    age_group: string;
    specialist_name: string;
    start_date: string;
    status: string;
    children_count: number;
    max_children: number;
  };
  stats: {
    avg_progress: number;
    avg_mental_age_growth: number;
    active_children: number;
    low_performers: number;
  };
  children: any[];
}

export interface AdminGroupMonthlyPlan {
  month: number | null;
  sections: {
    section_name: string;
    progress: number;
    exercises: any[];
  }[];
}

export interface AdminSpecialist {
  id: number;
  name: string;
  specialist_type: string;
  photo: string | null;
  children_count: number;
  max_patients: number;
  workload_percent: number;
}

export interface AdminSpecialistsResponse {
  specialists: AdminSpecialist[];
}

export interface AdminSpecialistDetail {
  specialist: {
    id: number;
    name: string;
    specialist_type: string;
    phone: string;
    email: string;
    photo: string | null;
  };
  stats: {
    children_count: number;
    active_groups: number;
    avg_progress: number;
  };
  progress_breakdown: {
    good_count: number;
    moderate_count: number;
    avg_progress: number;
    growth_percent: number;
  };
  monthly_sessions: {
    data: {
      month: string;
      year: number;
      count: number;
    }[];
    total: number;
  };
}

export interface AdminChildGrowth {
  diagnostics: any[];
  radar_metrics: any[];
  monitoring: any[];
}

// --- Doctor Analytics ---

export interface DoctorMonthlyTrend {
  month: string;
  year: number;
  percentage: number;
}

export interface DoctorDashboard {
  development_dynamics: {
    current_percentage: number;
    growth: number;
    monthly_trend: DoctorMonthlyTrend[];
  };
  ai_plan: {
    completion_percent: number;
    ai_accuracy: number;
    total_items: number;
    mastered_items: number;
  };
  homework_stats: {
    total: number;
    done_percent: number;
    late_percent: number;
    not_done_percent: number;
    average_score: number;
  };
  effectiveness: {
    success_percent: number;
    partial_percent: number;
    redo_percent: number;
  };
  global_radar: any[];
  today_schedule: any[];
  attention_needed: any[];
}

export interface DoctorGroup {
  id: number;
  name: string;
  age_group: string;
  shift: string;
  status: string;
  children_count: number;
  max_children: number;
  avg_progress: number;
  specialists: string[];
}

export interface DoctorGroupsResponse {
  groups: DoctorGroup[];
}

export interface DoctorWeeklyScheduleSlot {
  weekday: number;
  day_name: string;
  start_time: string;
  duration_min: number;
  specialist_name: string;
  session_type: string;
}

export interface DoctorGroupDetail {
  group: {
    id: number;
    name: string;
    age_group: string;
    children_count: number;
    max_children: number;
  };
  today_attendance: any[];
  weekly_schedule: DoctorWeeklyScheduleSlot[];
  avg_progress: number;
  section_scores: any[];
  weakest_section: string | null;
  strongest_section: string | null;
  below_80_percent: {
    count: number;
    total: number;
    percentage: number;
    children: any[];
  };
  children_progress: any[];
  ai_warnings: any[];
}

export interface DoctorGroupYearlyPlan {
  yearly_plan: {
    id: number;
    ai_summary: string;
    start_date: string;
  };
  months: any[];
}

export interface DoctorPatient {
  id: number;
  name: string;
  progress: any;
}

export interface DoctorPatientsResponse {
  patients: DoctorPatient[];
}

export interface DoctorPatientDiagnostics {
  mental_age: number;
  scores: any[];
  radar_chart: any[];
}

// --- Parent Analytics ---

export interface ParentDashboard {
  child: {
    id: number;
    name: string;
    age_text: string;
    age_months: number;
    status: string;
    photo: string | null;
  };
  overall_percentage: number;
  monthly_growth: number;
  today_tasks: {
    total: number;
    completed: number;
    tasks: any[];
  };
}

export interface ParentProgress {
  current: any[];
  previous: any[];
  overall_current: number;
  overall_previous: number;
  details: any[];
}

export interface ParentSection {
  section_id: number;
  section_name: string;
  percentage: number;
  status: string;
}

export interface ParentSectionsResponse {
  sections: ParentSection[];
}

export interface ParentWeeklyActivityDay {
  day: string;
  date: string;
  attended: boolean;
}

export interface ParentWeeklyActivity {
  days: ParentWeeklyActivityDay[];
  current_week_count: number;
  previous_week_count: number;
  growth_percent: number;
}
