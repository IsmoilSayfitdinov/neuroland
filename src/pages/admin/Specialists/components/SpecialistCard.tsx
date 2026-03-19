import { Link } from "@tanstack/react-router";
import type { SpecialistOut } from "@/types/specialists.types";

interface SpecialistCardProps {
  data: SpecialistOut;
}

export function SpecialistCard({ data }: SpecialistCardProps) {
  const initials = data?.fio
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

    console.log(data);
    

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        {data?.photo ? (
          <img 
            src={data?.photo} 
            alt={data?.fio} 
            className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-[52px] h-[52px] rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#4D89FF] font-bold text-[18px] shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold text-[#2D3142] mb-1.5 line-clamp-1">{data?.fio}</h3>
          <span className="px-3 py-1 bg-[#F8F9FB] rounded-[8px] text-[12.5px] font-medium text-[#6B7A99] inline-block">
            {data?.specialist_type_title}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 mb-6 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#9EB1D4]">Maksimal bolalar</span>
          <span className="text-[14px] font-bold text-[#2D3142]">
            {data?.max_patients} ta
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#9EB1D4]">Shift</span>
            <span className="text-[14px] font-bold text-[#2D3142]">{data?.shift}</span>
          </div>
          <div className="h-[6px] w-full bg-[#F0F5FF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <Link
        to={`/admin/specialists/${data?.id}`}
        className="w-full flex items-center justify-center py-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white text-[13px] font-medium rounded-[12px]"
      >
        Batafsil
      </Link>
    </div>
  );
}
