export interface Anamnesis {
  id?: number;
  child_id?: number;
  pregnancy_1_trimester?: string | null;
  pregnancy_2_trimester?: string | null;
  pregnancy_3_trimester?: string | null;
  birth_process?: string | null;
  birth_weight?: string | null;
  first_40_days?: string | null;
  up_to_1_year?: string | null;
  breastfeeding_duration?: string | null;
  pacifier_usage_period?: string | null;
  walking_age?: number | null;
  gadget_usage_age?: number | null;
  kindergarten_age?: number | null;
  sleep_habits?: string | null;
  eating_habits?: string | null;
  has_constipation?: boolean;
  has_diarrhea?: boolean;
  wears_pampers?: boolean;
  likes_bathing?: boolean;
  has_inner_speech?: boolean;
  first_word_age?: number | null;
  vaccination?: string | null;
  current_vocabulary_count?: string | null;
}

export interface Consultation {
  id?: number;
  arrival_date?: string | null;
  preliminary_diagnosis?: string | null;
  final_diagnosis?: string | null;
  neuro_complex?: number | null;
  neuro_complex_name?: string | null;
  working_period?: string | null;
  recommendations?: string | null;
  group_acceptance_date?: string | null;
  accompanied_by?: string | null;
  assigned_specialists?: number[];
}

/** SubscriptionStub — inside ChildOut.subscription */
export interface SubscriptionStub {
  id: number;
  plan: number;
  balance: string;
  next_payment_date: string;
}

export interface DiagnosticResultAnswer {
  section_name: string;
  exercise_name: string;
  age_group_name: string;
  score: number;
}

export interface DiagnosticResult {
  id: number;
  date: string;
  specialist_name: string;
  comment: string;
  answers: DiagnosticResultAnswer[];
}

/** PaymentStub — inside ChildDetailOut.payments */
export interface PaymentStub {
  id: number;
  amount: string;
  payment_date: string;
  method: string;
  status?: string;
}

export interface GroupInfo {
  id: number;
  name: string;
  shift: string;
}

export interface SpecialistAssignment {
  specialist_id: number;
  user_id: number;
  fio: string;
  role: string;
}

export interface ChildOut {
  id: number;
  user_id: number;
  fio: string;
  phone_number: string;
  photo?: string | null;
  alias?: string | null;
  status: string;
  group_id: number | null;
  birth_date: string;
  father_name?: string | null;
  mother_name?: string | null;
  phone_number_2?: string | null;
  address?: string | null;
  child_number_in_family?: number | null;
  recommended_by?: string | null;
  diagnosis?: string | null;
  treatment_complex?: number | null;
  subscription?: SubscriptionStub | null;
  specialist_assignments?: SpecialistAssignment[];
}

export interface ChildDetailOut extends ChildOut {
  anamnesis?: Anamnesis | null;
  consultation?: Consultation | null;
  diagnostic_results?: DiagnosticResult[];
  payments?: PaymentStub[];
  group_info?: GroupInfo | null;
}

export interface GroupTransferRequest {
  new_group_id: number;
  reason?: string;
}

export interface GroupTransferHistory {
  id: number;
  child_id: number;
  child_name: string;
  from_group_id: number | null;
  from_group_name: string;
  to_group_id: number | null;
  to_group_name: string;
  reason?: string | null;
  transferred_by_id: number | null;
  transferred_by_name: string;
  transferred_at: string;
}

/**
 * POST /api/v1/children/ - create child + user account exactly as Swagger specifies
 */
export interface ChildUserCreateRequest {
  fio: string;
  phone_number: string;
  password?: string;
  photo?: File | string | null;
  alias?: string | null;
  birth_date: string;
  father_name?: string | null;
  mother_name?: string | null;
  phone_number_2?: string | null;
  address?: string | null;
  child_number_in_family?: number | null;
  recommended_by?: string | null;
  /** { "Logoped": 5, "Neyropsixolog": 3, ... } */
  specialist_assignments?: Record<string, number | null> | null;
}

/**
 * PATCH /api/v1/children/{id}/ - partial update
 */
export interface PatchedChildUserUpdateRequest {
  fio?: string;
  phone_number?: string;
  photo?: File | string | null;
  alias?: string | null;
  birth_date?: string;
  father_name?: string | null;
  mother_name?: string | null;
  phone_number_2?: string | null;
  address?: string | null;
  child_number_in_family?: number | null;
  recommended_by?: string | null;
  diagnosis?: string | null;
  group_id?: number | null;
  status?: string | null;
  anamnesis?: Omit<Anamnesis, "id" | "child_id"> | null;
  consultation?: Omit<Consultation, "id"> | null;
  /** { "logoped": 5, "neyropsixolog": 3 } — same format as create */
  specialist_assignments?: Record<string, number | null> | null;
}
