import { Video, Edit2, Trash2 } from "lucide-react";
import type { ExerciseOut } from "@/types/skills.types";

interface DepartmentExerciseListProps {
  exercises: ExerciseOut[];
  ageGroupName: string;
  onEdit?: (exercise: ExerciseOut) => void;
  onDelete?: (id: number) => void;
}


export function DepartmentExerciseList({ exercises, ageGroupName, onEdit, onDelete }: DepartmentExerciseListProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Mashqlar ro'yxati</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-4 border-b border-gray-100 mb-2">
            <div className="text-[13px] font-bold text-[#9EB1D4]">Mashq nomi</div>
            <div className="text-[13px] font-bold text-[#9EB1D4]">Yosh toifasi</div>
            <div className="text-[13px] font-bold text-[#9EB1D4]">Video mavjud</div>
            <div className="text-[13px] font-bold text-[#9EB1D4]">Holati</div>
            <div className="text-[13px] font-bold text-[#9EB1D4] text-right">Amallar</div>
          </div>

          {/* Table Body */}
          <div>
            {exercises.map((item) => (
              <div key={item.id} className="grid grid-cols-5 gap-4 items-center py-4 border-b border-gray-50 last:border-none group">
                <div className="text-[14px] font-medium text-[#2D3142]">{item.name}</div>
                <div className="text-[14px] text-[#6B7A99]">{ageGroupName}</div>
                
                {/* Video Status Cell */}
                <div>
                  {item.video_url ? (
                    <div className="flex items-center gap-2 text-[#4D89FF]">
                      <Video className="w-4 h-4" />
                      <a href={item.video_url} target="_blank" rel="noreferrer" className="text-[13px] font-medium hover:underline">Video bor</a>
                    </div>
                  ) : (
                    <div className="text-[13px] text-[#9EB1D4]">Yo'q</div>
                  )}
                </div>

                {/* Operational Status Cell */}
                <div>
                  {item.status === "active" || item.status === "Faol" ? (
                    <span className="inline-flex items-center justify-center px-4 py-1.5 bg-[#E8FFF3] text-[#3DB87E] text-[12px] font-bold rounded-full">
                      Faol
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-4 py-1.5 bg-[#F8F9FB] text-[#9EB1D4] text-[12px] font-bold rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit?.(item)}
                    className="p-2 text-[#6B7A99] hover:text-[#4D89FF] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(item.id)}
                    className="p-2 text-[#6B7A99] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-[#9EB1D4]">Bu bo'limda hali mashqlar yo'q</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
