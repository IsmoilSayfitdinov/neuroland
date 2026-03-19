import { useGroupDetailPage } from "@/hooks/specialist/useGroupDetailPage";
import GroupStudentCard from "@/components/specialist/Groups/GroupStudentCard";
import WeeklySchedule from "@/components/specialist/Groups/WeeklySchedule";
import GroupAnalyticsSidebar from "@/components/specialist/Groups/GroupAnalyticsSidebar";
import { Loader2 } from "lucide-react";

export default function GroupDetail() {
  const { group, isLoading, groupId } = useGroupDetailPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!group) {
    return <div className="py-20 text-center text-[#9EB1D4]">Guruh topilmadi</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[22px] font-bold text-[#2D3142]">{group.name}</h1>
        <button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors">
          Baqlash
        </button>
      </div>

      {/* Student cards — full width */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {group.children?.map((child) => (
          <GroupStudentCard key={child.id} child={child} />
        ))}
      </div>

      {/* Schedules + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Schedules */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <WeeklySchedule groupId={groupId} label="1-hafta jadval" />
          <WeeklySchedule groupId={groupId} label="2-hafta jadval" />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <GroupAnalyticsSidebar group={group} />
        </div>
      </div>
    </div>
  );
}
