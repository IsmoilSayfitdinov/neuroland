import { Users, Pencil, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupsAPI } from "@/api/groups.api";
import { toast } from "sonner";
import type { GroupOut } from "@/types/groups.types";

interface GroupCardProps {
  data: GroupOut;
}

export function GroupCard({ data }: GroupCardProps) {
  const { name, age_group_name, status, children_count, max_children, specialists } = data;
  const teacherName = specialists && specialists.length > 0 ? specialists[0].fio : "Tayinlanmagan";
  const queryClient = useQueryClient();

  const { mutate: deleteGroup, isPending: deleting } = useMutation({
    mutationFn: () => GroupsAPI.deleteGroup(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Guruh o'chirildi");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "O'chirishda xatolik"),
  });

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

      <div className="my-[18px] border-t border-transparent" />

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

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <Link
          to={`/admin/groups/${data.id}`}
          className="flex-1 flex items-center justify-center py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white text-[13px] font-medium rounded-xl"
        >
          Ko'rish
        </Link>
        <Link
          to={`/admin/groups/${data.id}/edit`}
          className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors border border-blue-100"
        >
          <Pencil className="w-4 h-4" />
        </Link>
        <button
          onClick={() => {
            if (confirm(`"${name}" guruhini o'chirishni tasdiqlaysizmi?`)) deleteGroup();
          }}
          disabled={deleting}
          className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors border border-red-100 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
