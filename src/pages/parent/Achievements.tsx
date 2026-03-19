import { Trophy, Star, Loader2, Medal, Zap } from "lucide-react";
import { useMyChild } from "@/hooks/parent/useMyChild";
import { useGamification } from "@/hooks/admin/useGamification";

export default function AchievementsPage() {
  const { data: child, isLoading: childLoading } = useMyChild(false);
  const childId = child?.id;

  const { useChildBadges, useChildTotalXp } = useGamification();
  const { data: childBadges, isLoading: badgesLoading } = useChildBadges(childId!);
  const { data: totalXp, isLoading: xpLoading } = useChildTotalXp(childId!);

  const isLoading = childLoading || badgesLoading || xpLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const xp = totalXp?.total_xp ?? 0;
  const badges = childBadges ?? [];

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6">Yutuqlar</h1>

      {/* XP Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[24px] p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-[13px] font-medium mb-1">Jami tajriba ballari</p>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-300" />
              <span className="text-[36px] font-bold">{xp}</span>
              <span className="text-blue-200 text-[16px] font-medium">XP</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-[13px] font-medium mb-1">Olingan badge'lar</p>
            <div className="flex items-center gap-2 justify-end">
              <Medal className="w-6 h-6 text-yellow-300" />
              <span className="text-[28px] font-bold">{badges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">Badge'lar</h2>

      {badges.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-bold text-[15px]">Hali badge'lar yo'q</p>
          <p className="text-[#9EB1D4] text-[13px] mt-1">Vazifalarni bajaring va XP to'plang!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((cb) => (
            <div
              key={cb.id}
              className="bg-white rounded-[20px] border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-yellow-50 flex items-center justify-center">
                {cb.badge.icon ? (
                  <img src={cb.badge.icon} alt={cb.badge.name} className="w-8 h-8" />
                ) : (
                  <Star className="w-7 h-7 text-yellow-500" />
                )}
              </div>
              <h3 className="font-bold text-[#1E293B] text-[14px] mb-1">{cb.badge.name}</h3>
              <p className="text-[11px] text-[#9EB1D4] leading-tight mb-2">{cb.badge.description}</p>
              <p className="text-[10px] text-blue-500 font-medium">
                {new Date(cb.earned_at).toLocaleDateString("uz-UZ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
