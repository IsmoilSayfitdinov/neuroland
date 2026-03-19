import api from "./api";
import type {
  Payment,
  PaymentRequest,
  PatchedPaymentRequest,
  Plan,
  PlanRequest,
  PatchedPlanRequest,
  Subscription,
  SubscriptionRequest,
  PatchedSubscriptionRequest,
  PaginatedPaymentList,
  PaginatedPlanList,
  PaginatedSubscriptionList,
} from "../types/billing.types";

export class BillingAPI {
  // --- Payments ---
  static async listPayments(page?: number): Promise<Payment[]> {
    const response = await api.get<PaginatedPaymentList | Payment[]>(
      "/v1/billing/payments/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createPayment(data: PaymentRequest): Promise<Payment> {
    const response = await api.post<Payment>("/v1/billing/payments/", data);
    return response.data;
  }

  static async getPayment(id: number): Promise<Payment> {
    const response = await api.get<Payment>(`/v1/billing/payments/${id}/`);
    return response.data;
  }

  static async updatePayment(id: number, data: PaymentRequest): Promise<Payment> {
    const response = await api.put<Payment>(`/v1/billing/payments/${id}/`, data);
    return response.data;
  }

  static async patchPayment(id: number, data: PatchedPaymentRequest): Promise<Payment> {
    const response = await api.patch<Payment>(`/v1/billing/payments/${id}/`, data);
    return response.data;
  }

  static async deletePayment(id: number): Promise<void> {
    await api.delete(`/v1/billing/payments/${id}/`);
  }

  // --- Plans ---
  static async listPlans(page?: number): Promise<Plan[]> {
    const response = await api.get<PaginatedPlanList | Plan[]>(
      "/v1/billing/plans/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createPlan(data: PlanRequest): Promise<Plan> {
    const response = await api.post<Plan>("/v1/billing/plans/", data);
    return response.data;
  }

  static async getPlan(id: number): Promise<Plan> {
    const response = await api.get<Plan>(`/v1/billing/plans/${id}/`);
    return response.data;
  }

  static async updatePlan(id: number, data: PlanRequest): Promise<Plan> {
    const response = await api.put<Plan>(`/v1/billing/plans/${id}/`, data);
    return response.data;
  }

  static async patchPlan(id: number, data: PatchedPlanRequest): Promise<Plan> {
    const response = await api.patch<Plan>(`/v1/billing/plans/${id}/`, data);
    return response.data;
  }

  static async deletePlan(id: number): Promise<void> {
    await api.delete(`/v1/billing/plans/${id}/`);
  }

  // --- Subscriptions ---
  static async listSubscriptions(page?: number): Promise<Subscription[]> {
    const response = await api.get<PaginatedSubscriptionList | Subscription[]>(
      "/v1/billing/subscriptions/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createSubscription(data: SubscriptionRequest): Promise<Subscription> {
    const response = await api.post<Subscription>("/v1/billing/subscriptions/", data);
    return response.data;
  }

  static async getSubscription(id: number): Promise<Subscription> {
    const response = await api.get<Subscription>(`/v1/billing/subscriptions/${id}/`);
    return response.data;
  }

  static async updateSubscription(id: number, data: SubscriptionRequest): Promise<Subscription> {
    const response = await api.put<Subscription>(`/v1/billing/subscriptions/${id}/`, data);
    return response.data;
  }

  static async patchSubscription(id: number, data: PatchedSubscriptionRequest): Promise<Subscription> {
    const response = await api.patch<Subscription>(`/v1/billing/subscriptions/${id}/`, data);
    return response.data;
  }

  static async deleteSubscription(id: number): Promise<void> {
    await api.delete(`/v1/billing/subscriptions/${id}/`);
  }

  static async deductFromBalance(
    id: number,
    data?: { amount?: string; description?: string }
  ): Promise<{ message: string; balance: string; last_payment_date: string; next_payment_date: string }> {
    const response = await api.put(`/v1/billing/subscriptions/${id}/deduct/`, data);
    return response.data;
  }

  static async getMySubscription(): Promise<Subscription> {
    const response = await api.get<Subscription>("/v1/billing/subscriptions/me/");
    return response.data;
  }
}
