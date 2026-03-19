import { Star } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useGamification } from "@/hooks/admin/useGamification";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";

export default function AchievementsAdmin() {
  const { useBadgesList } = useGamification();
  const { data: badges, isLoading } = useBadgesList();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Yutuqlar boshqaruvi" />
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-8">
      <PageHeader title="Yutuqlar boshqaruvi" />

      {badges?.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Badgelar topilmadi"
          description="Hozircha tizimda badgelar mavjud emas."
        />
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Badge nomi</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Tavsif</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Shart</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Kerakli XP</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {badges?.map((badge) => (
                  <tr key={badge.id} className="hover:bg-[#F8F9FB] transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-[22px]">{badge.icon || "🏅"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-[#2D3142]">{badge.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] text-[#9EB1D4] font-medium leading-relaxed">
                        {badge.description || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] text-[#9EB1D4] font-medium">
                        {badge.unlock_condition || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-4 py-1.5 bg-[#2D3142] text-white rounded-full text-[12px] font-bold whitespace-nowrap">
                        {badge.required_xp ?? 0} XP
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                          badge.is_active !== false
                            ? "bg-[#E8FFF3] text-[#3DB87E]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {badge.is_active !== false ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
