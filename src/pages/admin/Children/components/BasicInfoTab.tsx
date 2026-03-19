import type { ChildDetailOut } from "@/types/children.types";
import { calculateAge, formatDate } from "@/lib/utils";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useGamification } from "@/hooks/admin/useGamification";
import { useMemo } from "react";
import { User, Trophy, Star } from "lucide-react";

interface BasicInfoTabProps {
  child: ChildDetailOut;
}

export function BasicInfoTab({ child }: BasicInfoTabProps) {
  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();
  const { useChildTotalXp, useChildBadges } = useGamification();
  const { data: totalXp } = useChildTotalXp(child.id);
  const { data: childBadges } = useChildBadges(child.id);

  const assignedSpecialists = useMemo(() => {
    if (!specialists || !child.specialist_assignments?.length) return [];

    return (child.specialist_assignments ?? [])
      .filter((a) => a.specialist_id != null)
      .map((assignment) => specialists.find((s) => s.id === assignment.specialist_id))
      .filter((s): s is NonNullable<typeof s> => !!s);
  }, [specialists, child.specialist_assignments]);



  const leftFields = [
    { label: "Kelgan sanasi",              value: formatDate(child.consultation?.arrival_date) || "—" },
    { label: "Dastlabki tashxis",          value: child.diagnosis || "—" },
    { label: "Tug'ilgan sana",             value: formatDate(child.birth_date) || "—" },
    { label: "Yoshi",                      value: calculateAge(child.birth_date) || "—" },
    { label: "Oilada nechanchi farzand",   value: child.child_number_in_family ? `${child.child_number_in_family}-chi` : "—" },
    { label: "Kim tavsiya qilgan",         value: child.recommended_by || "—" },
  ];

  const rightFields = [
    { label: "Otasining ismi",   value: child.father_name || "—" },
    { label: "Onasining ismi",   value: child.mother_name || "—" },
    { label: "Telefon 1",        value: child.phone_number || "—" },
    { label: "Telefon 2",        value: child.phone_number_2 || "—" },
    { label: "Manzil",           value: child.address || "—" },
    { label: "Guruh mutaxassisi",value: child.group_info?.name || "—" },
  ];

  return (
    <div className="space-y-4">
      {/* Main info + assigned specialists — always 50/50 */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Info card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-[15px] font-bold text-[#2D3142] mb-6">Asosiy ma'lumotlar</h3>
          <div className="space-y-5">
            {leftFields.map((lf, i) => (
              <div key={i} className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[11px] text-[#9EB1D4] font-medium">{lf.label}</p>
                  <p className="text-[14px] text-[#2D3142] font-bold">{lf.value}</p>
                </div>
                {rightFields[i] && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-[#9EB1D4] font-medium">{rightFields[i].label}</p>
                    <p className="text-[14px] text-[#2D3142] font-bold">{rightFields[i].value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Biriktirilgan mutaxassislar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-[15px] font-bold text-[#2D3142] mb-6">Biriktirilgan mutaxassislar</h3>
          {assignedSpecialists.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-[12px] text-[#9EB1D4]">Biriktirilmagan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {assignedSpecialists.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-[#2D3142] font-medium">{s.fio}</span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-gray-100 text-gray-500">
                    {s.specialist_type_title ?? "Mutaxassis"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* XP va Yutuqlar */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* XP */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-[15px] font-bold text-[#2D3142]">Tajriba bali (XP)</h3>
          </div>
          <div className="text-center py-4">
            <p className="text-[36px] font-bold text-[#2D3142]">{totalXp?.total_xp ?? 0}</p>
            <p className="text-[12px] text-[#9EB1D4] font-medium mt-1">Jami XP</p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-[15px] font-bold text-[#2D3142]">Yutuqlar ({childBadges?.length ?? 0})</h3>
          </div>
          {!childBadges?.length ? (
            <div className="text-center py-6">
              <p className="text-[12px] text-[#9EB1D4]">Hali yutuqlar yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {childBadges.map((cb) => (
                <div key={cb.id} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl">
                  <span className="text-[20px]">{cb.badge.icon || "🏅"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#2D3142] truncate">{cb.badge.name}</p>
                    <p className="text-[11px] text-[#9EB1D4]">{cb.badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
