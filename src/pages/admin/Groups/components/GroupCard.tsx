import { Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { GroupOut } from "@/types/groups.types";

interface GroupCardProps {
  data: GroupOut;
}

export function GroupCard({ data }: GroupCardProps) {
  const { name, age_group_name, status, children_count, max_children, specialists } = data;
  const teacherName = specialists && specialists.length > 0 ? specialists[0].fio : "Tayinlanmagan";

  return (
    <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[17px] font-bold text-[#2D3142] mb-0.5">
            {name} <span className="text-[14px] font-normal text-[#9EB1D4]">({age_group_name})</span>
          </h3>
          <p className="text-[13px] text-[#9EB1D4]">{teacherName}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E8FFF3] rounded-full shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3DB87E]" />
          <span className="text-[11px] font-bold text-[#3DB87E] uppercase">{status}</span>
        </div>
      </div>

      <div className="my-[18px] border-t border-transparent" /> {/* Spacer */}

      {/* Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7A99]">
            <Users className="w-4 h-4 text-[#9EB1D4]" />
            <span className="text-[13px] font-medium">Bolalar</span>
          </div>
          <span className="text-[14px] font-bold text-[#2D3142]">
            {children_count}/{max_children}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link 
        to={`/admin/groups/${data.id}`}
        className="mt-auto w-full flex items-center justify-center py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white text-[13px] font-medium rounded-xl"
      >
        Guruhni ko'rish
      </Link>
    </div>
  );
}
