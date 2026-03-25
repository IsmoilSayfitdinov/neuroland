import { useMemo } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useGroups } from "@/hooks/admin/useGroups";
import { useTopics } from "@/hooks/admin/useTopics";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";

export const useGroupDetailAdminPage = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { useGroupDetail } = useGroups();
  const { useTopicsList } = useTopics();
  const { useResultsList } = useDiagnostics();

  const { data: group, isLoading: isLoadingGroup } = useGroupDetail(Number(id));
  const { data: topics, isLoading: isLoadingTopics } = useTopicsList(Number(id));
  const { data: diagnosticResults } = useResultsList();

  const isLoading = isLoadingGroup || isLoadingTopics;

  // Build weekly plan from topics assigned to this group
  const weeklyPlan = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    return topics.slice(0, 8).map((t, i) => ({
      week: `Hafta ${i + 1}`,
      topic: t.title || (t as any).name || `Mavzu #${t.id}`,
    }));
  }, [topics]);

  // Calculate stats from diagnostics for children in this group
  const groupStats = useMemo(() => {
    if (!group || !diagnosticResults) {
      return { avgGrowth: 0, mentalAgeGrowth: "—", lowPerformers: 0 };
    }

    const childIds = new Set((group.children || []).map((c) => c.id));
    const groupResults = diagnosticResults.filter((r) => childIds.has(r.child));

    if (groupResults.length === 0) {
      return { avgGrowth: 0, mentalAgeGrowth: "—", lowPerformers: 0 };
    }

    // Average growth
    const totalAvg = groupResults.reduce((acc, r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      return acc + avg;
    }, 0);
    const avgGrowth = Math.round((totalAvg / groupResults.length) * 100);

    // Mental age growth - compare first vs last per child
    const byChild = new Map<number, { first: number; last: number }>();
    groupResults.forEach((r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      const existing = byChild.get(r.child);
      if (!existing) {
        byChild.set(r.child, { first: avg, last: avg });
      } else {
        existing.last = avg;
      }
    });

    let growthSum = 0;
    let growthCount = 0;
    let lowPerformers = 0;
    byChild.forEach(({ first, last }) => {
      growthSum += (last - first) * 12;
      growthCount++;
      if (last < 0.4) lowPerformers++;
    });

    const mentalAgeGrowth = growthCount > 0
      ? `+${(growthSum / growthCount).toFixed(1)} oy`
      : "—";

    return { avgGrowth, mentalAgeGrowth, lowPerformers };
  }, [group, diagnosticResults]);

  const goBack = () => navigate({ to: "/admin/groups" });

  return { group, isLoading, id, goBack, weeklyPlan, groupStats };
};
