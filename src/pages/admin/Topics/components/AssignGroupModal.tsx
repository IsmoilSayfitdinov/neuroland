import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GroupsAPI } from "@/api/groups.api";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { cn } from "@/lib/utils";

interface AssignGroupModalProps {
  topicId: number;
  onClose: () => void;
  onSave: (data: { topicId: number; data: { group: number; week_start: string } }) => void;
  isPending: boolean;
}

export function AssignGroupModal({ topicId, onClose, onSave, isPending }: AssignGroupModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [weekStart, setWeekStart] = useState("");

  const { data: groups } = useQuery({ queryKey: ["groups"], queryFn: () => GroupsAPI.listGroups() });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[420px] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Guruhga biriktirish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {groups?.map((g) => (
              <div key={g.id} onClick={() => setSelectedGroupId(g.id)}
                className={cn("p-3 rounded-xl cursor-pointer border-2 transition-all",
                  selectedGroupId === g.id ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200")}>
                <p className="text-[14px] font-bold text-[#2D3142]">{g.name}</p>
                {g.age_group_name && <p className="text-[12px] text-[#9EB1D4]">{g.age_group_name}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Hafta boshlanishi</label>
            <CustomDatePicker value={weekStart} onChange={setWeekStart} placeholder="2 haftalik davr boshlanishi" className="bg-[#F8F9FB] border-none rounded-[10px]" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={() => selectedGroupId && onSave({ topicId, data: { group: selectedGroupId, week_start: weekStart } })}
            disabled={!selectedGroupId || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Biriktirish"}
          </button>
        </div>
      </div>
    </div>
  );
}
