import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GamificationAPI } from "@/api/gamification.api";
import { toast } from "sonner";
import type { BadgeRequest, PatchedBadgeRequest } from "@/types/gamification.types";

export const useGamification = () => {
  const queryClient = useQueryClient();

  // --- Badges ---
  const useBadgesList = () =>
    useQuery({
      queryKey: ["badges"],
      queryFn: () => GamificationAPI.listBadges(),
    });

  const useCreateBadge = () =>
    useMutation({
      mutationFn: (data: BadgeRequest) => GamificationAPI.createBadge(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["badges"] });
        toast.success("Badge qo'shildi");
      },
      onError: () => toast.error("Badge qo'shishda xatolik"),
    });

  const useUpdateBadge = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: BadgeRequest }) =>
        GamificationAPI.updateBadge(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["badges"] });
        toast.success("Badge yangilandi");
      },
      onError: () => toast.error("Badge yangilashda xatolik"),
    });

  const usePatchBadge = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: PatchedBadgeRequest }) =>
        GamificationAPI.patchBadge(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["badges"] });
        toast.success("Badge yangilandi");
      },
      onError: () => toast.error("Badge yangilashda xatolik"),
    });

  const useDeleteBadge = () =>
    useMutation({
      mutationFn: (id: number) => GamificationAPI.deleteBadge(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["badges"] });
        toast.success("Badge o'chirildi");
      },
      onError: () => toast.error("Badge o'chirishda xatolik"),
    });

  // --- Child ---
  const useChildBadges = (childId: number) =>
    useQuery({
      queryKey: ["badges", "child", childId],
      queryFn: () => GamificationAPI.getChildBadges(childId),
      enabled: !!childId,
    });

  const useChildXpHistory = (childId: number) =>
    useQuery({
      queryKey: ["xp", "history", childId],
      queryFn: () => GamificationAPI.getChildXpHistory(childId),
      enabled: !!childId,
    });

  const useChildTotalXp = (childId: number) =>
    useQuery({
      queryKey: ["xp", "total", childId],
      queryFn: () => GamificationAPI.getChildTotalXp(childId),
      enabled: !!childId,
    });

  return {
    useBadgesList,
    useCreateBadge,
    useUpdateBadge,
    usePatchBadge,
    useDeleteBadge,
    useChildBadges,
    useChildXpHistory,
    useChildTotalXp,
  };
};
