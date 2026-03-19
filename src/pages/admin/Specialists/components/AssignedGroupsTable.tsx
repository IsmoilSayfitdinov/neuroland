import { Eye } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { SpecialistGroupOut } from "@/types/specialists.types";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  active: "Faol",
  new: "Yangi",
  diagnostika: "Diagnostika",
  completed: "Tugatilgan",
  archive: "Arxiv",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[#E8FFF3] text-[#3DB87E]",
  new: "bg-[#EEF4FF] text-[#4D89FF]",
  diagnostika: "bg-[#FFF4E5] text-[#FFB020]",
  completed: "bg-gray-100 text-gray-500",
  archive: "bg-gray-100 text-gray-400",
};

interface AssignedGroupsTableProps {
  groups: SpecialistGroupOut[];
}

export function AssignedGroupsTable({ groups }: AssignedGroupsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white mt-[24px] p-6 lg:p-10 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[18px] font-bold text-[#2D3142] mb-8">Biriktirilgan guruhlar</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-5 gap-4 pb-5 border-b border-gray-100 mb-6">
            <div className="text-[14px] font-bold text-[#2D3142]">Guruh nomi</div>
            <div className="text-[14px] font-bold text-[#2D3142]">Bolalar soni</div>
            <div className="text-[14px] font-bold text-[#2D3142]">Boshlanish sanasi</div>
            <div className="text-[14px] font-bold text-[#2D3142]">Holati</div>
            <div className="text-[14px] font-bold text-[#2D3142]">Amallar</div>
          </div>

          {groups.length === 0 ? (
            <div className="py-12 text-center text-[#9EB1D4]">Biriktirilgan guruhlar topilmadi</div>
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <div key={group.id} className="grid grid-cols-5 gap-4 items-center">
                  <div className="text-[14px] font-bold text-[#2D3142]">{group.name}</div>
                  <div className="text-[14px] text-[#2D3142] font-medium opacity-60">{group.children_count} bola</div>
                  <div className="text-[14px] text-[#2D3142] font-medium opacity-60">{group.start_date}</div>
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center justify-center px-4 py-1.5 text-[12px] font-bold rounded-full",
                        STATUS_STYLES[group.status] || "bg-gray-100 text-gray-500"
                      )}
                    >
                      {STATUS_LABELS[group.status] || group.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate({ to: `/admin/groups/${group.id}` })}
                      className="flex items-center gap-2 text-[#4D89FF] text-[13px] font-bold hover:text-[#2563EB] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Guruhni ko'rish
                    </button>
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
