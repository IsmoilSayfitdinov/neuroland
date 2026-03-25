import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingAPI } from "@/api/billing.api";
import type {
  PaymentRequest,
  PlanRequest,
  PatchedPlanRequest,
  PatchedPaymentRequest,
  SubscriptionRequest,
  PatchedSubscriptionRequest,
} from "@/types/billing.types";
import { toast } from "sonner";

export const useBilling = () => {
  const queryClient = useQueryClient();

  // --- Payments ---
  const usePaymentsList = () => useQuery({
    queryKey: ["payments"],
    queryFn: () => BillingAPI.listPayments(),
  });

  const useCreatePayment = () => useMutation({
    mutationFn: (data: PaymentRequest) => BillingAPI.createPayment(data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["payments"] });
      queryClient.removeQueries({ queryKey: ["child"] });
      queryClient.removeQueries({ queryKey: ["children"] });
      queryClient.refetchQueries({ queryKey: ["payments"] });
      queryClient.refetchQueries({ queryKey: ["child"] });
      queryClient.refetchQueries({ queryKey: ["children"] });
      toast.success("To'lov muvaffaqiyatli saqlandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "To'lovni saqlashda xatolik");
    },
  });

  const useUpdatePayment = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchedPaymentRequest }) =>
      BillingAPI.patchPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["child"] });
      toast.success("To'lov yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "To'lovni yangilashda xatolik");
    },
  });

  const useDeletePayment = () => useMutation({
    mutationFn: (id: number) => BillingAPI.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("To'lov o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "To'lovni o'chirishda xatolik");
    },
  });

  // --- Plans ---
  const usePlansList = () => useQuery({
    queryKey: ["plans"],
    queryFn: () => BillingAPI.listPlans(),
  });

  const useCreatePlan = () => useMutation({
    mutationFn: (data: PlanRequest) => BillingAPI.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Tarif yaratildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Tarif yaratishda xatolik");
    },
  });

  const useUpdatePlan = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedPlanRequest }) =>
      BillingAPI.patchPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Tarif yangilandi");
    },
    onError: () => toast.error("Tarif yangilashda xatolik"),
  });

  const useDeletePlan = () => useMutation({
    mutationFn: (id: number) => BillingAPI.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Tarif o'chirildi");
    },
    onError: () => toast.error("Tarif o'chirishda xatolik"),
  });

  // --- Subscriptions ---
  const useSubscriptionsList = () => useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => BillingAPI.listSubscriptions(),
  });

  const useCreateSubscription = () => useMutation({
    mutationFn: (data: SubscriptionRequest) => BillingAPI.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Tarif muvaffaqiyatli biriktirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Tarif biriktirishda xatolik");
    },
  });

  const useUpdateSubscription = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchedSubscriptionRequest }) =>
      BillingAPI.patchSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Obuna yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Obunani yangilashda xatolik");
    },
  });

  const useMySubscription = () => useQuery({
    queryKey: ["my-subscription"],
    queryFn: () => BillingAPI.getMySubscription(),
  });

  return {
    // Payments
    usePaymentsList,
    useCreatePayment,
    useUpdatePayment,
    useDeletePayment,
    // Plans
    usePlansList,
    useCreatePlan,
    useUpdatePlan,
    useDeletePlan,
    // Subscriptions
    useSubscriptionsList,
    useCreateSubscription,
    useUpdateSubscription,
    useMySubscription,
  };
};
