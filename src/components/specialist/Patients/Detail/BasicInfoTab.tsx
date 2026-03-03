import { ChevronUp } from "lucide-react";

export default function BasicInfoTab() {
  const infoGroups = [
    {
      title: "Asosiy ma'lumotlar",
      fields: [
        { label: "Kelgan sanas", value: "15.01.2025" },
        { label: "Otasining ismi", value: "Dankovskiy Alexey" },
        { label: "Dastlabki diagno", value: "RAS (Autizm spektri buzilishi)" },
        { label: "Onasining ismi", value: "Dankovskaya Mariya" },
        { label: "Tug'ilgan san", value: "12.03.2020" },
        { label: "Telefon 1", value: "+998 90 123 45 67" },
        { label: "Yoshi", value: "4 yil 11 oy" },
        { label: "Telefon 2", value: "+998 91 987 65 43" },
        { label: "Oilada nechanchi farzan", value: "2-chi" },
        { label: "Manzil", value: "Toshkent sh., Chilonzor tumani" },
        { label: "Kim tavsiya qilga", value: "Dr. Karimov (Nevrolog)" },
        { label: "Guruh mutaxassisi", value: "Malika Rustamova" },
        { label: "Konsultatsiya o'tkazgan mutaxassi", value: "Shaxlo Abdullayev" },
        { label: "Guruhga qabul qilingan sana", value: "20.01.2025" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {infoGroups.map((group, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/20">
            <h3 className="font-bold text-slate-800">{group.title}</h3>
            <ChevronUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="p-8 grid grid-cols-2 gap-x-12 gap-y-10">
            {group.fields.map((field, fIdx) => (
              <div key={fIdx} className="space-y-2">
                <p className="text-xs font-medium text-slate-400 tracking-wide">{field.label}</p>
                <p className="text-sm font-bold text-slate-800">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
