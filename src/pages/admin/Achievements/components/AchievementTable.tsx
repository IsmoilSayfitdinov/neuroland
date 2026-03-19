import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  requirement: string;
  rewardType: string;
  rewardValue: number;
  status: boolean;
}

interface AchievementTableProps {
  achievements: Achievement[];
  onToggleStatus: (id: string) => void;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

export function AchievementTable({ achievements, onToggleStatus, onEdit, onDelete }: AchievementTableProps) {
  return (
    <div className="w-full bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Icon</th>
              <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Badge nomi</th>
              <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Tavsif</th>
              <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Shart</th>
              <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Mukofot</th>
              <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Status</th>
              <th className="px-8 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {achievements.map((item) => (
              <tr key={item.id} className="group hover:bg-[#F8F9FB] transition-colors">
                <td className="px-8 py-5">
                  <span className="text-[22px]">{item.icon}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[14px] font-bold text-[#2D3142]">{item.name}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[14px] text-[#9EB1D4] font-medium leading-relaxed">{item.description}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[14px] text-[#9EB1D4] font-medium">{item.requirement}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="px-4 py-1.5 bg-[#2D3142] text-white rounded-full text-[12px] font-bold whitespace-nowrap">
                    {item.rewardType} • {item.rewardValue} XP
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <button 
                      onClick={() => onToggleStatus(item.id)}
                      className="w-[44px] h-[22px] rounded-full relative transition-all duration-200 focus:outline-none cursor-pointer"
                      style={{ backgroundColor: item.status ? "#2563EB" : "#E1E5EE" }}
                    >
                      <div className={cn(
                        "absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 shadow-sm",
                        item.status ? "translate-x-[24px]" : "translate-x-[2px]"
                      )} />
                    </button>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 text-[#2D3142] hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Edit2 className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-[#FF4D4F] hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
