import { useMemo } from "react";
import { useAnalytics } from "./useAnalytics";

export const useActivityAdminPage = () => {
  const { useAdminActivity } = useAnalytics();
  const { data: activity, isLoading } = useAdminActivity();

  const families = useMemo(() => {
    if (!activity?.top_families) return [];
    return activity.top_families.map((f, i) => ({
      rank: i + 1,
      name: f.child_name,
      progress: Math.round(f.activity_score),
      tasks: "",
    }));
  }, [activity]);

  const days = useMemo(() => {
    if (!activity?.heatmap) return ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
    return activity.heatmap.map((d) => d.day);
  }, [activity]);

  const times = useMemo(() => {
    if (!activity?.heatmap || activity.heatmap.length === 0) return [];
    return activity.heatmap[0].hours.map((h) => `${String(h.hour).padStart(2, "0")}:00`);
  }, [activity]);

  const heatmapData = useMemo(() => {
    if (!activity?.heatmap) return Array.from({ length: 7 }, () => Array(18).fill(0));
    return activity.heatmap.map((dayData) => dayData.hours.map((h) => h.intensity));
  }, [activity]);

  const taskCompletion = activity?.task_completion?.percent ?? 0;
  const taskGrowth = activity?.task_completion?.growth ?? 0;
  const lockedFamilies = activity?.locked_families?.families_count ?? 0;
  const lockedMonths = activity?.locked_families?.months ?? 0;
  const knowledgeLevel = activity?.knowledge_level ?? 0;

  return {
    isLoading,
    families,
    days,
    times,
    heatmapData,
    taskCompletion,
    taskGrowth,
    lockedFamilies,
    lockedMonths,
    knowledgeLevel,
  };
};
