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
  const initials = fio.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarColor = AVATAR_COLORS[id % AVATAR_COLORS.length];

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    new: { label: "Yangi", bg: "bg-amber-50", text: "text-amber-600" },
    diagnostika: { label: "Diagnostika", bg: "bg-blue-50", text: "text-blue-600" },
    active: { label: "Faol", bg: "bg-emerald-50", text: "text-emerald-600" },
    completed: { label: "Tugallangan", bg: "bg-gray-50", text: "text-gray-600" },
    archive: { label: "Arxiv", bg: "bg-slate-50", text: "text-slate-500" },
  };
  const st = statusConfig[data.status] || statusConfig.new;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {photo ? (
            <img src={import.meta.env.VITE_API_MEDIA_URL + photo} alt={fio} className="w-12 h-12 rounded-full object-cover shrink-0" />
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
        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", st.bg, st.text)}>
          {st.label}
        </span>
      </div>

      {/* Diagnostika */}
      <div>
        <p className="text-[10px] font-medium text-[#9EB1D4] uppercase tracking-wider mb-1.5">
          Tashxis
        </p>
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-[12px] font-bold",
          diagnosis ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-[#9EB1D4]"
        )}>
          {diagnosis || "Belgilanmagan"}
        </span>
      </div>

      {/* Button */}
      <Link
        to="/specialist/patients/$patientId"
        params={{ patientId: id.toString() }}
        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center text-[13px] font-bold transition-colors mt-auto"
      >
        Batafsil
      </Link>
    </div>
  );
}
