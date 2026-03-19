import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlansAPI } from "@/api/plans.api";
import type { YearlyPlanListRequest } from "@/types/plans.types";
import { toast } from "sonner";

export const usePlans = () => {
  const queryClient = useQueryClient();

  const useYearlyPlansList = () =>
    useQuery({
      queryKey: ["yearly-plans"],
      queryFn: () => PlansAPI.listYearlyPlans(),
    });

  const useYearlyPlanDetail = (id: number) =>
    useQuery({
      queryKey: ["yearly-plans", id],
      queryFn: () => PlansAPI.getYearlyPlan(id),
      enabled: !!id,
    });

  const useMonthlyGoals = (planId: number) =>
    useQuery({
      queryKey: ["yearly-plans", planId, "monthly-goals"],
      queryFn: () => PlansAPI.getMonthlyGoals(planId),
      enabled: !!planId,
    });

  const useCreateYearlyPlan = () =>
    useMutation({
      mutationFn: (data: YearlyPlanListRequest) => PlansAPI.createYearlyPlan(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
        toast.success("Yillik reja yaratildi");
      },
      onError: () => toast.error("Yillik reja yaratishda xatolik"),
    });

  const useGenerateAiPlan = () =>
    useMutation({
      mutationFn: ({ id, group, start_date }: { id: number; group: number; start_date: string }) =>
        PlansAPI.generateAiPlan(id, { group, start_date }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
        toast.success("AI reja yaratildi");
      },
      onError: () => toast.error("AI reja yaratishda xatolik"),
    });

  return { useYearlyPlansList, useYearlyPlanDetail, useMonthlyGoals, useCreateYearlyPlan, useGenerateAiPlan };
};
