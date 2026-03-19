import { useQuery } from "@tanstack/react-query";
import { BillingAPI } from "@/api/billing.api";
import type { Subscription } from "@/types/billing.types";

export function useMySubscription() {
  return useQuery<Subscription | null>({
    queryKey: ["parent", "subscription", "me"],
    queryFn: () => BillingAPI.getMySubscription(),
    retry: 1,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["parent", "payments"],
    queryFn: () => BillingAPI.listPayments(),
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ["parent", "plans"],
    queryFn: () => BillingAPI.listPlans(),
  });
}
