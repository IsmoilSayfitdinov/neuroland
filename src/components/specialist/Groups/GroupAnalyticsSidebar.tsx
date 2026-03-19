import { AlertTriangle, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import type { GroupOut } from "@/types/groups.types";

interface GroupAnalyticsSidebarProps {
  group?: GroupOut | null;
}

export default function GroupAnalyticsSidebar({ group }: GroupAnalyticsSidebarProps) {
  const childIds = group?.children?.map((c) => c.id) ?? [];

  // Fetch diagnostics for all children in the group
  const { data: allResults, isLoading } = useQuery({
    queryKey: ["diagnostics-results-group", group?.id],
    queryFn: async () => {
      const results = await Promise.all(
        childIds.map((id) =>
          DiagnosticsAPI.getResults({ child_id: id }).catch(() => [])
        )
      );
      return results.flat();
    },
    enabled: childIds.length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  // Compute skill averages from latest diagnostic per child
  const latestPerChild = new Map<number, typeof allResults>();
  allResults?.forEach((r) => {
    const existing = latestPerChild.get(r.child);
    if (!existing || new Date(r.date) > new Date((existing as any).date)) {
      latestPerChild.set(r.child, r);
    }
  });

  const sectionScores: Record<string, { total: number; count: number }> = {};
  const childScores: { childId: number; avg: number }[] = [];

  latestPerChild.forEach((result: any) => {
    let childTotal = 0;
    let childCount = 0;
    result.answers?.forEach((a: any) => {
      if (!sectionScores[a.section_name]) sectionScores[a.section_name] = { total: 0, count: 0 };
      sectionScores[a.section_name].total += a.score;
      sectionScores[a.section_name].count += 1;
      childTotal += a.score;
      childCount += 1;
    });
    if (childCount > 0) {
      childScores.push({ childId: result.child, avg: Math.round((childTotal / childCount) * 100) });
    }
  });

  const skills = Object.entries(sectionScores).map(([label, s]) => ({
    label,
    value: Math.round((s.total / s.count) * 100),
  }));

  const avgProgress = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.value, 0) / skills.length)
    : 0;

  const weakest = skills.length > 0 ? skills.reduce((a, b) => a.value < b.value ? a : b) : null;
  const strongest = skills.length > 0 ? skills.reduce((a, b) => a.value > b.value ? a : b) : null;
  const below80Count = childScores.filter((c) => c.avg < 80).length;
  const totalChildren = childScores.length;

  // Find sections below 80% with more than 30% children below threshold
  const warningSkills = skills.filter((s) => s.value < 80).map((s) => s.label);

  return (
    <div className="flex flex-col gap-4">
      {/* Haftalik progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-[11px] text-[#9EB1D4] font-bold uppercase tracking-wide mb-2">
          Guruh progressi
        </p>
        <p className="text-[36px] font-bold text-[#2D3142] leading-none mb-3">{avgProgress}%</p>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", avgProgress >= 70 ? "bg-[#2ECC71]" : avgProgress >= 40 ? "bg-orange-400" : "bg-red-500")}
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* Eng zaif / Eng kuchli */}
      {(weakest || strongest) && (
        <div className="grid grid-cols-2 gap-3">
          {weakest && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
              <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Eng zaif</p>
              <p className="font-bold text-red-600 text-[13px] uppercase">{weakest.label}</p>
              <p className="text-[12px] font-bold text-red-500 mt-0.5">{weakest.value}%</p>
            </div>
          )}
          {strongest && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4">
              <p className="text-[10px] text-emerald-500 font-bold uppercase mb-1">Eng kuchli</p>
              <p className="font-bold text-[#2ECC71] text-[13px] uppercase">{strongest.label}</p>
              <p className="text-[12px] font-bold text-[#2ECC71] mt-0.5">{strongest.value}%</p>
            </div>
          )}
        </div>
      )}

      {/* 80% dan past bolalar */}
      {totalChildren > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[12px] text-[#9EB1D4] font-bold mb-2">80% dan past bolalar</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold text-[#2D3142]">
              {below80Count} / {totalChildren}
            </span>
            <span className="text-[13px] text-[#9EB1D4] font-bold">
              ({totalChildren > 0 ? Math.round((below80Count / totalChildren) * 100) : 0}%)
            </span>
          </div>
        </div>
      )}

      {/* Ko'nikmalar bo'yicha */}
      {skills.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <p className="text-[12px] font-bold text-[#2D3142]">Ko'nikmalar bo'yicha</p>
          {skills.map((skill) => (
            <div key={skill.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#9EB1D4]">{skill.label}</span>
                <span className="text-[#2D3142]">{skill.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    skill.value >= 80 ? "bg-[#2ECC71]" : "bg-orange-400"
                  )}
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Ogohlantirish */}
      {warningSkills.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-red-100 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="font-bold text-red-600 text-[13px]">AI Ogohlantirish</p>
              <p className="text-[11px] text-red-400 leading-relaxed mt-1">
                {warningSkills.join(", ")} bo'yicha 80% dan past natijalar mavjud.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-red-500">
            <Zap size={13} fill="currentColor" />
            <span>Majburiy takrorlash tavsiya etiladi.</span>
          </div>
        </div>
      )}

      {/* No data state */}
      {skills.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-[13px] text-[#9EB1D4]">Diagnostika ma'lumotlari mavjud emas</p>
        </div>
      )}
    </div>
  );
}
