import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, TrendingUp, Brain } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GroupsAPI } from "@/api/groups.api";
import { PlansAPI } from "@/api/plans.api";
import { GROUP_SHIFTS, GROUP_STATUS_LABELS } from "@/constants/groups";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { cn } from "@/lib/utils";

export default function AIPlanListAdmin() {
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupsAPI.listGroups(),
  });

  const { data: yearlyPlans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["yearly-plans"],
    queryFn: () => PlansAPI.listYearlyPlans(),
  });

  const isLoading = isLoadingGroups || isLoadingPlans;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="AI Rejalashtiruvchi" />
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader title="AI Rejalashtiruvchi" />

      {!groups?.length ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <Brain className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Guruhlar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {groups.map((group) => {
            const hasPlan = yearlyPlans?.some((p) => p.group === group.id);
            const statusCfg = GROUP_STATUS_LABELS[group.status] ?? GROUP_STATUS_LABELS.active;
            const shiftLabel = GROUP_SHIFTS.find((s) => s.value === group.shift)?.label || group.shift;

            return (
              <div key={group.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#2D3142] text-[15px]">{group.name}</h3>
                    <p className="text-[12px] text-[#9EB1D4] mt-0.5">{group.age_group_name}</p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border", statusCfg.cls)}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[12px] text-[#5A6484]">
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-blue-400" />
                      <span>Bolalar</span>
                    </div>
                    <span className="font-bold text-[#2D3142]">{group.children_count}/{group.max_children}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-[#5A6484]">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={13} className="text-amber-400" />
                      <span>Smena</span>
                    </div>
                    <span className="font-bold text-[#2D3142] text-[11px]">{shiftLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-[#5A6484]">
                    <div className="flex items-center gap-2">
                      <Brain size={13} className="text-purple-400" />
                      <span>AI reja</span>
                    </div>
                    <span className={cn("font-bold text-[11px]", hasPlan ? "text-emerald-600" : "text-[#9EB1D4]")}>
                      {hasPlan ? "Mavjud" : "Yaratilmagan"}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Link
                  to="/admin/ai-plan/$groupId"
                  params={{ groupId: String(group.id) }}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl flex items-center justify-center transition-colors mt-auto"
                >
                  {hasPlan ? "Rejani ko'rish" : "Reja yaratish"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
