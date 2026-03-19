import { useMemo } from "react";
import { Heart, Lock, Trophy, BarChart2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { TopFamiliesList } from "./components/TopFamiliesList";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { useSessions } from "@/hooks/admin/useSessions";
import { useChildren } from "@/hooks/admin/useChildren";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";

const days = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
const times = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "00:00"];

export default function ActivityAdmin() {
  const { useSessionsList } = useSessions();
  const { useChildrenList } = useChildren();
  const { useResultsList } = useDiagnostics();

  const { data: sessions, isLoading: isLoadingSessions } = useSessionsList();
  const { data: children, isLoading: isLoadingChildren } = useChildrenList();
  const { data: diagnosticResults, isLoading: isLoadingDiagnostics } = useResultsList();

  const isLoading = isLoadingSessions || isLoadingChildren || isLoadingDiagnostics;

  // Calculate task completion rate from sessions
  const taskCompletionRate = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const completed = sessions.filter((s) => s.ended_at).length;
    return Math.round((completed / sessions.length) * 100);
  }, [sessions]);

  // Build top families from children + diagnostic results
  const families = useMemo(() => {
    if (!children || !diagnosticResults) return [];

    const childScores = new Map<number, { name: string; totalScore: number; count: number }>();
    diagnosticResults.forEach((r) => {
      const child = children.find((c) => c.id === r.child);
      if (!child) return;
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      const existing = childScores.get(r.child);
      if (existing) {
        existing.totalScore += avg;
        existing.count++;
      } else {
        childScores.set(r.child, { name: child.fio, totalScore: avg, count: 1 });
      }
    });

    return Array.from(childScores.entries())
      .map(([_, val]) => ({
        name: val.name,
        progress: Math.round((val.totalScore / val.count) * 100),
        tasks: `${val.count}/${val.count}`,
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5)
      .map((f, i) => ({ ...f, rank: i + 1 }));
  }, [children, diagnosticResults]);

  // Build heatmap from sessions by weekday and time slot
  const heatmapData = useMemo(() => {
    const grid = Array.from({ length: 7 }, () => Array(7).fill(0));
    if (!sessions) return grid;

    const timeSlots = [6, 9, 12, 15, 18, 21, 0];

    sessions.forEach((s) => {
      const date = new Date(s.date);
      const dayIdx = (date.getDay() + 6) % 7; // Monday=0
      if (s.start_time) {
        const hour = parseInt(s.start_time.split(":")[0], 10);
        let slotIdx = 0;
        for (let i = timeSlots.length - 1; i >= 0; i--) {
          if (hour >= timeSlots[i]) { slotIdx = i; break; }
        }
        grid[dayIdx][slotIdx]++;
      }
    });

    // Normalize to 0-4 scale
    const maxVal = Math.max(1, ...grid.flat());
    return grid.map((row) => row.map((v) => Math.round((v / maxVal) * 4)));
  }, [sessions]);

  // Knowledge level from diagnostics
  const knowledgeLevel = useMemo(() => {
    if (!diagnosticResults || diagnosticResults.length === 0) return 0;
    const total = diagnosticResults.reduce((acc, r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      return acc + avg;
    }, 0);
    return Math.round((total / diagnosticResults.length) * 100);
  }, [diagnosticResults]);

  // Active children count (those with sessions)
  const activeChildrenCount = useMemo(() => {
    if (!sessions) return 0;
    const uniqueChildren = new Set(sessions.filter((s) => s.child).map((s) => s.child));
    return uniqueChildren.size;
  }, [sessions]);

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="Faollik" />
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto pb-10 space-y-6">
      <PageHeader title="Faollik" />

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Vazifa bajarilishi"
          value={`${taskCompletionRate}%`}
          subtitle="Seanslar asosida"
          icon={Heart}
        />

        <StatCard
          title="Faol bolalar"
          value={String(activeChildrenCount)}
          subtitle={`${children?.length || 0} dan`}
          subtitleColor="text-[#9EB1D4]"
          icon={Lock}
        />

        <StatCard
          title="Eng faol oilalar"
          value={`Top ${families.length}`}
          subtitle="Diagnostika asosida"
          icon={Trophy}
        />

        <StatCard
          title="Bilim darajasi"
          value={`${knowledgeLevel}%`}
          subtitle={knowledgeLevel > 70 ? "Yaxshi" : "O'rtacha"}
          subtitleColor="text-[#9EB1D4]"
          icon={BarChart2}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <TopFamiliesList families={families} />
        <ActivityHeatmap days={days} times={times} data={heatmapData} />
      </div>
    </div>
  );
}
