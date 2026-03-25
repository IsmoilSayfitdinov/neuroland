import { User, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientDetailHeaderProps {
  name: string;
  alias?: string;
  birthDate: string;
  age: string;
  diagnosis: string;
  photo?: string | null;
}

export default function PatientDetailHeader({
  name, alias, birthDate, age, diagnosis, photo,
}: PatientDetailHeaderProps) {
  const isActive = true;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Blue label bar */}
      <div className="bg-blue-600 px-6 py-2">
        <span className="text-white text-xs font-bold tracking-wide">Bemor profili</span>
      </div>

      <div className="p-5 sm:p-7 flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
          {photo ? (
            <img src={import.meta.env.VITE_API_MEDIA_URL + photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-blue-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#2D3142]">{name}</h1>
            <span className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide",
              "bg-blue-50 text-blue-600 border-blue-100"
            )}>
              <Activity size={11} /> {diagnosis}
            </span>
            <span className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border",
              isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-gray-400")} />
              {isActive ? "Active" : "Nofaol"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#9EB1D4]">
            {alias && (
              <span>Taxallusi: <span className="text-[#2D3142] font-medium">{alias}</span></span>
            )}
            <span>Tug'ilgan sana: <span className="text-[#2D3142] font-medium">{birthDate}</span></span>
            <span>Yoshi: <span className="text-[#2D3142] font-medium">{age}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
