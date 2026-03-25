import { Edit2, CheckCircle2, Calendar as CalendarIcon, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { GroupOut } from "@/types/groups.types";

interface GroupInfoCardProps {
  group: GroupOut;
}

export function GroupInfoCard({
  group
}: GroupInfoCardProps) {
  const navigate = useNavigate();
  const teacher = group.specialists?.[0];
  const teacherName = teacher?.fio || "Tayinlanmagan";
  const teacherInitials = teacherName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm relative">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Guruh nomi */}
          <div>
            <p className="text-[12px] font-medium text-[#9EB1D4] mb-1">Guruh nomi</p>
            <h2 className="text-[20px] font-bold text-[#2D3142]">{group.name}</h2>
          </div>

           {/* Mutaxassis */}
          <div>
            <p className="text-[12px] font-medium text-[#9EB1D4] mb-1">Mutaxassis</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E0E7FF] text-[#4D89FF] flex items-center justify-center text-[10px] font-bold shrink-0">
                {teacherInitials}
              </div>
              <span className="text-[15px] font-medium text-[#2D3142]">{teacherName}</span>
            </div>
          </div>
          
          {/* Bolalar soni */}
          <div>
            <p className="text-[12px] font-medium text-[#9EB1D4] mb-1">Bolalar soni</p>
            <div className="flex items-center gap-2 text-[#2D3142]">
              <Users className="w-4 h-4 text-[#9EB1D4] shrink-0" />
              <span className="text-[15px] font-medium">{group.children_count} bola</span>
            </div>
          </div>

         

          {/* Boshlanish sanasi */}
          <div>
            <p className="text-[12px] font-medium text-[#9EB1D4] mb-1">Boshlanish sanasi</p>
            <div className="flex items-center gap-2 text-[#2D3142]">
              <CalendarIcon className="w-4 h-4 text-[#9EB1D4] shrink-0" />
              <span className="text-[15px] font-medium">{group.start_date || "-"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <button
            onClick={() => navigate({ to: "/admin/schedule" })}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white py-2.5 rounded-[10px] text-[13px] font-medium shadow-sm"
          >
            Guruh jadvalini ko'rish
          </button>
          <button 
            onClick={() => navigate({ to: `/admin/groups/${group.id}/edit` })}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] py-2.5 rounded-[10px] text-[13px] font-medium shadow-sm flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Tahrirlash
          </button>
        </div>
      </div>

      {/* Status Line */}
      <div className="mt-8">
        <p className="text-[12px] font-medium text-[#9EB1D4] mb-2">Holati</p>
        <div className="flex items-center gap-1.5 text-[#3DB87E]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[14px] font-bold uppercase">{group.status}</span>
        </div>
      </div>
    </div>
  );
}
