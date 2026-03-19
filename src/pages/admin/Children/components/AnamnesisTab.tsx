import type { ChildDetailOut } from "@/types/children.types";
import { ChevronDown, Baby, Clock, User, MessageCircle, Edit3 } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AnamnesisTabProps {
  child: ChildDetailOut;
}

export function AnamnesisTab({ child }: AnamnesisTabProps) {
  const anamnesis = child.anamnesis;

  const sections = [
    {
      title: "Homiladorlik davri",
      icon: Baby,
      items: [
        { label: "1-trimestr", value: anamnesis?.pregnancy_1_trimester || "—" },
        { label: "2-trimestr", value: anamnesis?.pregnancy_2_trimester || "—" },
        { label: "3-trimestr", value: anamnesis?.pregnancy_3_trimester || "—" },
        { label: "Tug'ruq jarayoni", value: anamnesis?.birth_process || "—" },
      ]
    },
    {
      title: "Ilk rivojlanish",
      icon: Clock,
      items: [
        { label: "Tug'ilgandagi vazni", value: anamnesis?.birth_weight ? `${anamnesis.birth_weight} g` : "—" },
        { label: "Birinchi 40 kunlik", value: anamnesis?.first_40_days || "—" },
        { label: "1 yoshgacha davr", value: anamnesis?.up_to_1_year || "—" },
        { label: "Necha yoshgacha emgan", value: anamnesis?.breastfeeding_duration || "—" },
        { label: "So'rg'ichdan foydalanish davri", value: anamnesis?.pacifier_usage_period || "—" },
        { label: "Necha yoshda yurgan", value: anamnesis?.walking_age ? `${anamnesis.walking_age} oy` : "—" },
      ]
    },
    {
      title: "Muhit va odatlar",
      icon: User,
      items: [
        { label: "Gadjetlarga qachon o'tirgan", value: anamnesis?.gadget_usage_age ? `${anamnesis.gadget_usage_age} oy` : "—" },
        { label: "Bog'chaga chiqqanmi (yoshi)", value: anamnesis?.kindergarten_age ? `${anamnesis.kindergarten_age} oy` : "—" },
        { label: "Uxlash vaqti va kim bilan", value: anamnesis?.sleep_habits || "—" },
        { label: "Ovqatlar (nimalar edi)", value: anamnesis?.eating_habits || "—" },
        { label: "Ich qotadimi", value: anamnesis?.has_constipation != null ? (anamnesis.has_constipation ? "Ha" : "Yo'q") : "—" },
        { label: "Ich ketadimi", value: anamnesis?.has_diarrhea != null ? (anamnesis.has_diarrhea ? "Ha" : "Yo'q") : "—" },
        { label: "Pampers taqadimi", value: anamnesis?.wears_pampers != null ? (anamnesis.wears_pampers ? "Ha" : "Yo'q") : "—" },
        { label: "Cho'milishni yaxshi ko'radimi", value: anamnesis?.likes_bathing != null ? (anamnesis.likes_bathing ? "Ha" : "Yo'q") : "—" },
      ]
    },
    {
      title: "Nutq va kognitiv",
      icon: MessageCircle,
      items: [
        { label: "Ichki nutqi bormi", value: anamnesis?.has_inner_speech != null ? (anamnesis.has_inner_speech ? "Ha" : "Yo'q") : "—" },
        { label: "Birinchi so'zi qachon paydo bo'lgan", value: anamnesis?.first_word_age ? `${anamnesis.first_word_age} oy` : "—" },
        { label: "Hozirda nechta so'zi bor", value: anamnesis?.current_vocabulary_count || "—" },
        { label: "Emlash holati", value: anamnesis?.vaccination || "—" },
        { label: "Tashxis", value: child.diagnosis || "—" },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[18px] font-bold text-[#2D3142]">Rivojlanish tarixi</h2>
        <Link
          to="/admin/child/$id/anamnesis"
          params={{ id: String(child.id) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-[10px] transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Anamnez to'ldirish
        </Link>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="border border-gray-50 rounded-[20px] p-6 bg-white transition-all hover:border-gray-100 hover:shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <section.icon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-[15px] font-bold text-[#2D3142]">{section.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="space-y-1">
                  <p className="text-[11px] text-[#9EB1D4] font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-[14px] text-[#2D3142] font-bold">{item.value || "Kiritilmagan"}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
