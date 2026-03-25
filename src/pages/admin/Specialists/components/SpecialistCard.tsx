import { Link } from "@tanstack/react-router";
import { Users, Layers, Clock, Star, TrendingUp, ChevronRight } from "lucide-react";
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

  const progressPercent = Math.min(data?.average_progress || 0, 100);

  return (
    <Link
      to={`/admin/specialists/${data?.id}`}
      className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group overflow-hidden"
    >
      {/* Top colored bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5">
          {data?.photo ? (
            <img
              src={import.meta.env.VITE_API_MEDIA_URL + data?.photo}
              alt={data?.fio}
              className="w-[52px] h-[52px] rounded-[16px] object-cover shrink-0 ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[18px] shrink-0 shadow-sm">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-[#2D3142] mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {data?.fio}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-semibold">
              {data?.specialist_type_title}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FB] rounded-[12px]">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <div>
              <p className="text-[11px] text-[#9EB1D4] leading-none">Bolalar</p>
              <p className="text-[14px] font-bold text-[#2D3142]">{data?.assigned_children_count || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FB] rounded-[12px]">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <div>
              <p className="text-[11px] text-[#9EB1D4] leading-none">Guruhlar</p>
              <p className="text-[14px] font-bold text-[#2D3142]">{data?.active_groups_count || 0}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-[#9EB1D4] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> O'rtacha progress
            </span>
            <span className="text-[12px] font-bold text-[#2D3142]">{progressPercent}%</span>
          </div>
          <div className="h-[5px] w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9EB1D4]">
            <Clock className="w-3 h-3" />
            <span>{data?.shift?.replace(/\(.*\)/, "").trim()}</span>
          </div>
          {data?.parent_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[12px] font-semibold text-[#2D3142]">{data?.parent_rating?.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Groups tags */}
        {data?.assigned_groups && data.assigned_groups.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {data.assigned_groups.slice(0, 3).map((group) => (
              <span
                key={group.id}
                className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-600 rounded-full"
              >
                {group.name}
              </span>
            ))}
            {data.assigned_groups.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full">
                +{data.assigned_groups.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
