import { useMemo } from "react";
import { TrendingUp, Users, AlertTriangle, CalendarDays, ChevronLeft, Edit2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatCard } from "@/components/admin/ui/StatCard";
import { GroupInfoCard } from "./components/GroupInfoCard";
import { ChildrenTable } from "./components/ChildrenTable";
import { MonthlyPlanList } from "./components/MonthlyPlanList";
import { useGroupDetailAdminPage } from "@/hooks/admin/useGroupDetailAdminPage";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import { useTopics } from "@/hooks/admin/useTopics";

export default function GroupDetailAdmin() {
  const { group, isLoading, id, goBack } = useGroupDetailAdminPage();
  const { useResultsList } = useDiagnostics();
  const { data: allDiagResults } = useResultsList();
  const { useTopicsList } = useTopics();
  const { data: topics } = useTopicsList(Number(id));

  // Calculate group-specific diagnostic stats
  const groupChildIds = useMemo(() => {
    if (!group?.children) return new Set<number>();
    return new Set(group.children.map((c) => c.id));
  }, [group]);

  const groupDiagResults = useMemo(() => {
    if (!allDiagResults || groupChildIds.size === 0) return [];
    return allDiagResults.filter((r) => groupChildIds.has(r.child));
  }, [allDiagResults, groupChildIds]);

  const avgGrowth = useMemo(() => {
    if (groupDiagResults.length === 0) return 0;
    const total = groupDiagResults.reduce((acc, r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      return acc + avg;
    }, 0);
    return Math.round((total / groupDiagResults.length) * 100);
  }, [groupDiagResults]);

  const mentalAgeGrowth = useMemo(() => {
    if (groupDiagResults.length < 2) return "—";
    const byChild = new Map<number, { first: number; last: number }>();
    groupDiagResults.forEach((r) => {
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
    let totalGrowth = 0;
    let count = 0;
    byChild.forEach(({ first, last }) => {
      if (first !== last) {
        totalGrowth += (last - first) * 12;
        count++;
      }
    });
    if (count === 0) return "0 oy";
    return `+${(totalGrowth / count).toFixed(1)} oy`;
  }, [groupDiagResults]);

  const lowPerformers = useMemo(() => {
    if (groupDiagResults.length === 0) return 0;
    const childScores = new Map<number, number>();
    groupDiagResults.forEach((r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      childScores.set(r.child, avg);
    });
    return Array.from(childScores.values()).filter((s) => s < 0.5).length;
  }, [groupDiagResults]);

  // Build monthly plan from topics assigned to this group
  const monthlyPlan = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    return topics.slice(0, 4).map((t, i) => ({
      week: `Hafta ${i + 1}`,
      topic: t.title,
    }));
  }, [topics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[#9EB1D4]">Guruh topilmadi</p>
        <button onClick={goBack} className="mt-4 text-blue-500 hover:underline">
          Ortga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
          </button>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#2D3142]">{group.name} ma'lumotlari</h1>
        </div>

        <Link
          to="/admin/groups/$id/edit"
          params={{ id: String(id) }}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
        >
          <Edit2 className="w-[18px] h-[18px]" />
          Tahrirlash
        </Link>
      </div>

      <GroupInfoCard group={group} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="O'rtacha rivojlanish" value={`${avgGrowth}%`} subtitle="" icon={TrendingUp} />
        <StatCard
          title="O'rtacha aqliy yosh o'sishi"
          value={mentalAgeGrowth}
          subtitle=""
          icon={CalendarDays}
          iconBg="bg-[#E8FFF3]"
          iconColor="text-[#3DB87E]"
        />
        <StatCard
          title="Faol bolalar"
          value={String(group.children_count)}
          subtitle=""
          icon={Users}
          iconBg="bg-[#F4ECFF]"
          iconColor="text-[#A855F7]"
        />
        <StatCard
          title="Past natija ko'rsatayotganlar"
          value={String(lowPerformers)}
          subtitle=""
          icon={AlertTriangle}
          iconBg="bg-[#FFF4E5]"
          iconColor="text-[#F59E0B]"
        />
      </div>

      <ChildrenTable childrenList={group.children || []} />

      {monthlyPlan.length > 0 ? (
        <MonthlyPlanList plan={monthlyPlan} />
      ) : (
        <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-dashed border-gray-200 text-center">
          <p className="text-[#9EB1D4] font-medium">Bu guruh uchun hali mavzu biriktirilmagan</p>
        </div>
      )}
    </div>
  );
}
