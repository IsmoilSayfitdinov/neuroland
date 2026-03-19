import { useQuery } from "@tanstack/react-query";
import { GamificationAPI } from "@/api/gamification.api";

export const useGamification = () => {
  const useBadgesList = () =>
    useQuery({
      queryKey: ["badges"],
      queryFn: () => GamificationAPI.listBadges(),
    });

  const useChildBadges = (childId: number) =>
    useQuery({
      queryKey: ["badges", "child", childId],
      queryFn: () => GamificationAPI.getChildBadges(childId),
      enabled: !!childId,
    });

  const useChildTotalXp = (childId: number) =>
    useQuery({
      queryKey: ["xp", "total", childId],
      queryFn: () => GamificationAPI.getChildTotalXp(childId),
      enabled: !!childId,
    });

  return { useBadgesList, useChildBadges, useChildTotalXp };
};
