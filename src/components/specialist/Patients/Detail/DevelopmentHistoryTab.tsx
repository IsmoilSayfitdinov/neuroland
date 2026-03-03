import { ChevronUp, Activity, User, Home, MessageSquare } from "lucide-react";

export default function DevelopmentHistoryTab() {
  const sections = [
    {
      title: "Homiladorlik davri",
      icon: Activity,
      fields: [
        { label: "1-trimestr", value: "Norma, toksikoz kuzatilgan" },
        { label: "2-trimestr", value: "Norma" },
        { label: "3-trimestr", value: "Norma, kam harakatlanish" },
        { label: "Tug'ruq jarayoni", value: "Tabiiy, 38-hafta" },
      ]
    },
    {
      title: "Ilk rivojlanish",
      icon: User,
      fields: [
        { label: "Tug'ilgandagi vazni", value: "3200 g" },
        { label: "Birinchi 40 kunlik", value: "Tinch, yaxshi ovqatlanilgan" },
        { label: "1 yoshgacha davr", value: "O'tirish – 6 oy, emaklanish – 8 oy" },
        { label: "Necha yoshgacha emgan", value: "1.5 yosh" },
        { label: "So'rg'ichdan foydalanish davr", value: "3 yoshgacha" },
        { label: "Necha yoshda yurgan", value: "13 oy" },
      ]
    },
    {
      title: "Muhit va odatlar",
      icon: Home,
      fields: [
        { label: "Gadjetlarga qachon o'tirga", value: "1 yoshdan" },
        { label: "Bog'chaga chiqqanmi (yoshi)", value: "Yo'q" },
        { label: "Uxlash vaqti va kim bila", value: "21:00, onasi bilan" },
        { label: "Nimalar iste'mol qilad", value: "Suyuq ovqat, makaron" },
        { label: "Ich qotishim", value: "Ba'zan" },
        { label: "Ich ketidim", value: "Yo'q" },
        { label: "Pampers taqadim", value: "Ha" },
        { label: "Cho'milishni yaxshi ko'radim", value: "Ha" },
      ]
    },
    {
      title: "Nutq va kognitiv",
      icon: MessageSquare,
      fields: [
        { label: "Ichki nutqi borm", value: "Cheklangan" },
        { label: "Birinchi so'zi qachon paydo bo'lga", value: "2 yosh" },
        { label: "Hozirda nechta so'zi bo", value: "~15-20 ta" },
        { label: "Emlash holat", value: "To'liq" },
        { label: "Tashxis", value: "F84.0 – Autizm" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/20">
          <h3 className="font-bold text-slate-800">Rivojlanish tarixi</h3>
          <ChevronUp className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="p-6 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <section.icon className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx} className="space-y-1.5">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{field.label}</p>
                    <p className="text-sm font-bold text-slate-700">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
