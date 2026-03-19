import { ChevronUp } from "lucide-react";
import { calculateAge, formatDate } from "@/lib/utils";
import type { ChildDetailOut } from "@/types/children.types";

interface BasicInfoTabProps {
  child: ChildDetailOut;
}

export default function BasicInfoTab({ child }: BasicInfoTabProps) {
  const c = child.consultation;

  const fields = [
    { label: "Kelgan sanasi", value: formatDate(c?.arrival_date) },
    { label: "Otasining ismi", value: child.father_name || "—" },
    { label: "Dastlabki diagnoz", value: c?.preliminary_diagnosis || "—" },
    { label: "Onasining ismi", value: child.mother_name || "—" },
    { label: "Tug'ilgan sana", value: formatDate(child.birth_date) },
    { label: "Telefon 1", value: child.phone_number },
    { label: "Yoshi", value: calculateAge(child.birth_date) },
    { label: "Telefon 2", value: child.phone_number_2 || "—" },
    { label: "Oilada nechanchi farzand", value: child.child_number_in_family ? `${child.child_number_in_family}-chi` : "—" },
    { label: "Manzil", value: child.address || "—" },
    { label: "Kim tavsiya qilga", value: child.recommended_by || "—" },
    { label: "Guruh mutaxassisi", value: child.group_info?.name || "—" },
    { label: "Konsultatsiya o'tkazgan mutaxassis", value: c?.accompanied_by || "—" },
    { label: "Guruhga qabul qilingan sana", value: formatDate(c?.group_acceptance_date) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/40">
        <h3 className="font-bold text-[#2D3142]">Asosiy ma'lumotlar</h3>
        <ChevronUp className="w-5 h-5 text-[#9EB1D4]" />
      </div>
      <div className="p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-[11px] font-medium text-[#9EB1D4] uppercase tracking-wide mb-1">{field.label}</p>
            <p className="text-[14px] font-bold text-[#2D3142]">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
