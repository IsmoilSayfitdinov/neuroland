import { Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ChildOut } from "@/types/children.types";

const AVATAR_COLORS = [
  "bg-emerald-500", "bg-blue-500", "bg-violet-500",
  "bg-amber-500", "bg-pink-500", "bg-cyan-500",
];

const calcAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export default function PatientCard(data: ChildOut) {
  const { id, fio, birth_date, diagnosis, photo } = data;
  const age = calcAge(birth_date);
  const isNew = !diagnosis;
  const initials = fio.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarColor = AVATAR_COLORS[id % AVATAR_COLORS.length];

  // Placeholder until backend supports progress tracking
  const progress = 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {photo ? (
            <img src={photo} alt={fio} className="w-12 h-12 rounded-full object-cover shrink-0" />
          ) : (
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", avatarColor)}>
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[#2D3142] truncate text-[14px]">{fio}</p>
            <p className="text-[12px] text-[#9EB1D4]">{age} yosh</p>
          </div>
        </div>
        <Link to="/specialist/patients/$patientId" params={{ patientId: id.toString() }}>
          <Eye className="w-4 h-4 text-[#9EB1D4] hover:text-blue-500 transition-colors" />
        </Link>
      </div>

      {/* Diagnostika */}
      <div>
        <p className="text-[10px] font-medium text-[#9EB1D4] uppercase tracking-wider mb-1.5">
          Diagnostika
        </p>
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-[12px] font-bold",
          isNew ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
        )}>
          {diagnosis || "Belgilanmagan"}
        </span>
      </div>

      {/* Rivojlanish */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-medium text-[#9EB1D4] uppercase tracking-wider">Rivojlanish</p>
          <span className="text-[12px] font-bold text-[#2D3142]">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Test info */}
      <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-3">
        <div>
          <p className="text-[10px] text-[#9EB1D4] font-medium mb-0.5">Oxirgi test:</p>
          <p className="text-[12px] font-bold text-[#2D3142]">—</p>
        </div>
        <div>
          <p className="text-[10px] text-[#9EB1D4] font-medium mb-0.5">Keyingi test:</p>
          <p className="text-[12px] font-bold text-[#2D3142]">—</p>
        </div>
      </div>

      {/* Button */}
      <Link
        to="/specialist/patients/$patientId"
        params={{ patientId: id.toString() }}
        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center text-[13px] font-bold transition-colors"
      >
        Batafsil
      </Link>
    </div>
  );
}
