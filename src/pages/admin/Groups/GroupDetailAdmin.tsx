import { TrendingUp, Users, AlertTriangle, CalendarDays, ChevronLeft, Edit2, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatCard } from "@/components/admin/ui/StatCard";
import { GroupInfoCard } from "./components/GroupInfoCard";
import { ChildrenTable } from "./components/ChildrenTable";
import { MonthlyPlanList } from "./components/MonthlyPlanList";
import { useGroupDetailAdminPage } from "@/hooks/admin/useGroupDetailAdminPage";
import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { useTopics } from "@/hooks/admin/useTopics";

export default function GroupDetailAdmin() {
  const { group, isLoading, id, goBack } = useGroupDetailAdminPage();
  const { useAdminGroupAnalytics } = useAnalytics();
  const { data: analytics, isLoading: isLoadingAnalytics } = useAdminGroupAnalytics(Number(id));
  const { useTopicsList } = useTopics();
  const { data: topics } = useTopicsList(Number(id));

  if (isLoading || isLoadingAnalytics) {
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

  const stats = analytics?.stats;

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

        <div className="flex items-center gap-3">
          <Link
            to="/admin/groups/$id/homework"
            params={{ id: String(id) }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors text-amber-700 px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <BookOpen className="w-[18px] h-[18px]" />
            Uy vazifa berish
          </Link>
          <Link
            to="/admin/groups/$id/edit"
            params={{ id: String(id) }}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Edit2 className="w-[18px] h-[18px]" />
            Tahrirlash
          </Link>
        </div>
      </div>

      <GroupInfoCard group={group} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="O'rtacha rivojlanish"
          value={`${stats?.avg_progress ?? 0}%`}
          subtitle=""
          icon={TrendingUp}
        />
        <StatCard
          title="O'rtacha aqliy yosh o'sishi"
          value={stats?.avg_mental_age_growth ? `+${stats.avg_mental_age_growth} oy` : "—"}
          subtitle=""
          icon={CalendarDays}
          iconBg="bg-[#E8FFF3]"
          iconColor="text-[#3DB87E]"
        />
        <StatCard
          title="Faol bolalar"
          value={String(stats?.active_children ?? group.children_count)}
          subtitle=""
          icon={Users}
          iconBg="bg-[#F4ECFF]"
          iconColor="text-[#A855F7]"
        />
        <StatCard
          title="Past natija ko'rsatayotganlar"
          value={String(stats?.low_performers ?? 0)}
          subtitle=""
          icon={AlertTriangle}
          iconBg="bg-[#FFF4E5]"
          iconColor="text-[#F59E0B]"
        />
      </div>

      <ChildrenTable childrenList={analytics?.children?.length ? analytics.children : (group.children || [])} />

      {(topics?.length ?? 0) > 0 ? (
        <MonthlyPlanList plan={topics} />
      ) : (
        <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-dashed border-gray-200 text-center">
          <p className="text-[#9EB1D4] font-medium">Bu guruh uchun hali mavzu biriktirilmagan</p>
        </div>
      )}
    </div>
  );
}
