import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GroupsAPI } from "@/api/groups.api";
import { GROUP_SHIFTS } from "@/constants/groups";

export default function AIPlanList() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupsAPI.listGroups(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-[22px] font-bold text-[#2D3142]">AI reja</h1>

      {!groups?.length ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-[#9EB1D4] font-medium">Guruhlar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#2D3142] text-[15px]">{group.name}</h3>
                  <p className="text-[12px] text-[#9EB1D4] mt-0.5">{group.age_group_name}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Faol
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[12px] text-[#5A6484]">
                  <div className="flex items-center gap-2">
                    <Users size={13} className="text-blue-400" />
                    <span>Bolalar</span>
                  </div>
                  <span className="font-bold text-[#2D3142]">
                    {group.children_count}/{group.max_children}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#5A6484]">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={13} className="text-amber-400" />
                    <span>Smenasi</span>
                  </div>
                  <span className="font-bold text-[#2D3142]">{GROUP_SHIFTS.find((s) => s.value === group.shift)?.label || group.shift}</span>
                </div>
              </div>

              {/* Button */}
              <Link
                to="/specialist/ai-plan/$groupId"
                params={{ groupId: String(group.id) }}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl flex items-center justify-center transition-colors"
              >
                Rejani ko'rish
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
