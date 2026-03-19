import { ChevronUp, Activity, User, Home, MessageSquare } from "lucide-react";
import type { Anamnesis } from "@/types/children.types";

interface DevelopmentHistoryTabProps {
  anamnesis: Anamnesis | null | undefined;
}

export default function DevelopmentHistoryTab({ anamnesis }: DevelopmentHistoryTabProps) {
  if (!anamnesis) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-400">Rivojlanish tarixi hali kiritilmagan</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Homiladorlik davri",
      icon: Activity,
      fields: [
        { label: "1-trimestr", value: anamnesis.pregnancy_1_trimester || "-" },
        { label: "2-trimestr", value: anamnesis.pregnancy_2_trimester || "-" },
        { label: "3-trimestr", value: anamnesis.pregnancy_3_trimester || "-" },
        { label: "Tug'ruq jarayoni", value: anamnesis.birth_process || "-" },
      ]
    },
    {
      title: "Ilk rivojlanish",
      icon: User,
      fields: [
        { label: "Tug'ilgandagi vazni", value: anamnesis.birth_weight || "-" },
        { label: "Birinchi 40 kunlik", value: anamnesis.first_40_days || "-" },
        { label: "1 yoshgacha davr", value: anamnesis.up_to_1_year || "-" },
        { label: "Necha yoshgacha emgan", value: anamnesis.breastfeeding_duration || "-" },
        { label: "So'rg'ichdan foydalanish davr", value: anamnesis.pacifier_usage_period || "-" },
        { label: "Necha yoshda yurgan", value: anamnesis.walking_age || "-" },
      ]
    },
    {
      title: "Muhit va odatlar",
      icon: Home,
      fields: [
        { label: "Gadjetlarga qachon o'tirgan", value: anamnesis.gadget_usage_age || "-" },
        { label: "Bog'chaga chiqqanmi (yoshi)", value: anamnesis.kindergarten_age || "-" },
        { label: "Uxlash vaqti va odatlari", value: anamnesis.sleep_habits || "-" },
        { label: "Nimalar iste'mol qiladi", value: anamnesis.eating_habits || "-" },
        { label: "Ich qotishi", value: anamnesis.has_constipation ? "Ha" : "Yo'q" },
        { label: "Ich ketishi", value: anamnesis.has_diarrhea ? "Ha" : "Yo'q" },
        { label: "Pampers taqadimi", value: anamnesis.wears_pampers ? "Ha" : "Yo'q" },
        { label: "Cho'milishni yaxshi ko'radimi", value: anamnesis.likes_bathing ? "Ha" : "Yo'q" },
      ]
    },
    {
      title: "Nutq va kognitiv",
      icon: MessageSquare,
      fields: [
        { label: "Ichki nutqi bormi", value: anamnesis.has_inner_speech ? "Ha" : "Yo'q" },
        { label: "Birinchi so'zi qachon paydo bo'lgan", value: anamnesis.first_word_age || "-" },
        { label: "Hozirda nechta so'zi bor", value: anamnesis.current_vocabulary_count || "-" },
        { label: "Emlash holati", value: anamnesis.vaccination || "-" },
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
