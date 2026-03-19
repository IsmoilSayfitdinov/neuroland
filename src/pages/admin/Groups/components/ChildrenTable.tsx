import { Eye, TrendingUp, FileText } from "lucide-react";
import type { ChildOut } from "@/types/children.types";

interface ChildrenTableProps {
  childrenList: ChildOut[];
}

export function ChildrenTable({ childrenList }: ChildrenTableProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <h3 className="text-[18px] font-bold text-[#2D3142] mb-6">Guruhdagi bolalar</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr_1.5fr_100px] gap-4 pb-4 border-b border-gray-100 mb-2">
            <div className="text-[13px] font-bold text-[#2D3142]">Bola ismi</div>
            <div className="text-[13px] font-bold text-[#2D3142]">Yoshi</div>
            <div className="text-[13px] font-bold text-[#2D3142]">Aqliy yosh</div>
            <div className="text-[13px] font-bold text-[#2D3142]">Oxirgi test natijasi</div>
            <div className="text-[13px] font-bold text-[#2D3142]">Davomat</div>
            <div className="text-[13px] font-bold text-[#2D3142]">Holati</div>
            <div className="text-[13px] font-bold text-[#2D3142] text-right">Amallar</div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-hidden">
            {childrenList.map((child) => {
              const initials = child.fio.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              const age = new Date().getFullYear() - new Date(child.birth_date).getFullYear();
              
              return (
                <div key={child.id} className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr_1.5fr_100px] gap-4 items-center py-4 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-[12px]">
                  
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-[11px] font-bold shrink-0">
                      {initials}
                    </div>
                    <span className="text-[14px] font-bold text-[#2D3142]">{child.fio}</span>
                  </div>

                  {/* Yoshi */}
                  <div className="text-[14px] font-medium text-[#6B7A99]">{age} yosh</div>
                  
                  {/* Aqliy Yosh */}
                  <div className="text-[14px] font-medium text-[#6B7A99]">-</div>
                  
                  {/* Oxirgi test natijasi */}
                  <div className="text-[14px] font-bold text-[#2D3142]">-</div>
                  
                  {/* Davomat */}
                  <div className="text-[14px] font-medium text-[#6B7A99]">-</div>
                  
                  {/* Holat */}
                  <div>
                    <span className="inline-flex items-center justify-center px-4 py-1 text-[11px] font-bold rounded-[8px] text-[#3DB87E] bg-[#E8FFF3]">
                      {child.diagnosis || "Diagnostika"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 text-[#9EB1D4]">
                    <button className="hover:text-[#4D89FF] transition-colors"><Eye className="w-[18px] h-[18px]" /></button>
                    <button className="hover:text-[#4D89FF] transition-colors"><TrendingUp className="w-[18px] h-[18px]" /></button>
                    <button className="hover:text-[#4D89FF] transition-colors"><FileText className="w-[18px] h-[18px]" /></button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
