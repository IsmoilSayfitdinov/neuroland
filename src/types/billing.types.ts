/* ── Enums ── */
export type PaymentStatus = "paid" | "pending" | "failed";
export type PaymentMethod = "payme" | "click" | "cash" | "card";

/* ── Payment ── */
export interface Payment {
  id: number;
  child: number;
  amount: string;
  plan?: number | null;
  plan_name?: string;
  method: PaymentMethod;
  payment_date: string;
  note?: string | null;
  status?: PaymentStatus;
}

export interface PaymentRequest {
  child: number;
  amount: string;
  plan?: number | null;
  method?: PaymentMethod;
  status?: PaymentStatus;
}

export interface PatchedPaymentRequest {
  child?: number;
  amount?: string;
  plan?: number | null;
  method?: PaymentMethod;
  status?: PaymentStatus;
}

/* ── PaymentStub (inside ChildDetailOut.payments) ── */
export interface PaymentStub {
  id: number;
  amount: string;
  payment_date: string;
  method: string;
}

/* ── Plan ── */
export interface Plan {
  id: number;
  name: string;
  price: string;
  sessions_per_week?: number;
  description?: string | null;
  is_active?: boolean;
}

export interface PlanRequest {
  name: string;
  price: string;
  sessions_per_week?: number;
  description?: string | null;
  is_active?: boolean;
}

export interface PatchedPlanRequest {
  name?: string;
  price?: string;
  sessions_per_week?: number;
  description?: string | null;
  is_active?: boolean;
}

/* ── Subscription ── */
export interface Subscription {
  id: number;
  child: number;
  child_fio: string;
  plan: number;
  plan_name?: string;
  balance: string;
  last_payment_date?: string | null;
  next_payment_date?: string | null;
  is_active: boolean;
  remaining_days: number;
}

export interface SubscriptionRequest {
  child: number;
  plan: number;
  balance?: string;
  last_payment_date?: string | null;
  next_payment_date?: string | null;
  is_active?: boolean;
}

export interface PatchedSubscriptionRequest {
  child?: number;
  plan?: number;
  balance?: string;
  last_payment_date?: string | null;
  next_payment_date?: string | null;
  is_active?: boolean;
}

/* ── SubscriptionStub (inside ChildOut.subscription) ── */
export interface SubscriptionStub {
  id: number;
  plan: number;
  balance: string;
  next_payment_date: string;
}

/* ── Paginated ── */
export interface PaginatedPaymentList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

export interface PaginatedPlanList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Plan[];
}

export interface PaginatedSubscriptionList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Subscription[];
}
