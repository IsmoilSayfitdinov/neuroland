import type { SpecialistOut } from "@/types/specialists.types";

interface SpecialistProfileCardProps {
  spec: SpecialistOut;
}

export function SpecialistProfileCard({ spec }: SpecialistProfileCardProps) {
  const initials = (spec?.fio || "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);




  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 lg:gap-10">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center shrink-0">
          {spec?.photo ? (
            <img
              src={import.meta.env.VITE_API_MEDIA_URL + spec.photo}
              alt={spec.fio}
              className="w-[90px] h-[90px] rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-[90px] h-[90px] rounded-full bg-[#4D89FF] flex items-center justify-center text-white font-bold text-[32px] shadow-sm select-none">
              {initials}
            </div>
          )}
          <p className="text-[15px] font-bold text-[#2D3142] mt-3 text-center max-w-[120px]">
            {spec?.fio}
          </p>
        </div>

        {/* Info */}
        <div className="flex-1">
          {/* Badge */}
          <div className="mb-5">
            <span className="px-4 py-1.5 bg-[#F0F5FF] text-[#4D89FF] rounded-full text-[12px] font-bold">
              {spec?.specialist_type_title || "—"}
            </span>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
            <div>
              <p className="text-[12px] text-[#9EB1D4] mb-1 font-medium">Mutaxassis ID</p>
              <p className="text-[15px] font-bold text-[#2D3142]">{spec.id}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9EB1D4] mb-1 font-medium">Telefon</p>
              <p className="text-[15px] font-bold text-[#2D3142]">{spec.phone_number || "—"}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9EB1D4] mb-1 font-medium">Email</p>
              <p className="text-[15px] font-bold text-[#2D3142] italic line-clamp-1">
                {spec.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#9EB1D4] mb-1 font-medium">Ish boshlagan sana</p>
              <p className="text-[15px] font-bold text-[#2D3142]">
                {(spec as any).created_at
                  ? new Date((spec as any).created_at).toLocaleDateString("uz-UZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
