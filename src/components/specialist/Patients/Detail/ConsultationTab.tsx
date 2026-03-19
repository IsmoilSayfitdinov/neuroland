import { CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ChildDetailOut } from "@/types/children.types";

interface ConsultationTabProps {
  child: ChildDetailOut;
}

export default function ConsultationTab({ child }: ConsultationTabProps) {
  const c = child.consultation;

  if (!c) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-[#9EB1D4] font-medium">Konsultatsiya ma'lumotlari kiritilmagan</p>
      </div>
    );
  }

  const consultations = [
    {
      title: "Boshlang'ich konsultatsiya",
      date: formatDate(c.arrival_date),
      notes: c.preliminary_diagnosis || c.recommendations || "—",
    },
    c.final_diagnosis && {
      title: "Yakuniy tashxis",
      date: formatDate(c.group_acceptance_date),
      notes: c.final_diagnosis,
    },
    c.neuro_complex_name && {
      title: "Neyropsixologik baholash",
      date: formatDate(c.group_acceptance_date),
      notes: c.neuro_complex_name,
    },
  ].filter(Boolean) as { title: string; date: string; notes: string }[];

  return (
    <div className="space-y-4">
      {consultations.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-bold text-[#2D3142] text-[15px]">{item.title}</p>
              {item.date !== "—" && (
                <p className="text-[12px] text-[#9EB1D4] mt-0.5">{item.date}</p>
              )}
            </div>
            <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-[#E8FFF3] text-[#3DB87E] text-[11px] font-bold rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
            </span>
          </div>
          <p className="text-[13px] text-[#6B7A99] leading-relaxed">{item.notes}</p>
        </div>
      ))}

      {c.working_period && (
        <div className="bg-[#F0F5FF] rounded-2xl p-5 border border-blue-100">
          <p className="text-[12px] text-blue-600 font-bold mb-1">Ishlash davri</p>
          <p className="text-[14px] text-[#2D3142] font-medium">{c.working_period}</p>
        </div>
      )}

      {c.recommendations && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wide mb-2">Tavsiyalar</p>
          <p className="text-[13px] text-[#2D3142] leading-relaxed">{c.recommendations}</p>
        </div>
      )}
    </div>
  );
}
