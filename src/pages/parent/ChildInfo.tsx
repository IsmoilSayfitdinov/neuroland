import { useState } from "react";
import { Baby, ChevronDown, Activity, Brain, Loader2, AlertCircle, User } from "lucide-react";
import { cn, calculateAge, formatDate } from "@/lib/utils";
import { useMyChild } from "@/hooks/parent/useMyChild";
import type { ChildDetailOut } from "@/types/children.types";



function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value || "—"}</p>
    </div>
  );
}

function SectionCard({ title, icon, items }: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value?: string | number | boolean | null }[];
}) {
  const formatValue = (v: string | number | boolean | null | undefined): string => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "boolean") return v ? "Ha" : "Yo'q";
    if (typeof v === "number") return String(v);
    return v || "—";
  };

  return (
    <div className="p-6 rounded-[24px] bg-slate-50/30 border border-slate-100/80 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
          {icon}
        </div>
        <h4 className="font-bold text-slate-800 text-xs">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {items.map((item, i) => (
          <div key={i} className="space-y-0.5">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
            <p className="text-[11px] font-bold text-slate-800">{formatValue(item.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChildBasicTab({ child }: { child: ChildDetailOut }) {
  const age = calculateAge(child.birth_date);
  const consultation = child.consultation;
  const groupSpecialist = child.group_info?.name || "—";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
        <h3 className="font-bold text-[#1e293b]">Asosiy ma'lumotlar</h3>
        <ChevronDown className="w-5 h-5 text-slate-300" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-12">
        <div className="space-y-6 md:space-y-8">
          <InfoItem label="Kelgan sanas" value={formatDate(consultation?.arrival_date)} />
          <InfoItem label="Dastlabki diagnoz" value={consultation?.preliminary_diagnosis} />
          <InfoItem label="Tug'ilgan san" value={formatDate(child.birth_date)} />
          <InfoItem label="Yoshi" value={age} />
          <InfoItem label="Oilada nechanchi farzand" value={child.child_number_in_family ? `${child.child_number_in_family}-chi` : null} />
          <InfoItem label="Kim tavsiya qilga" value={child.recommended_by} />
          <InfoItem label="Konsultatsiya o'tkazgan mutaxassis" value={child.consultation?.accompanied_by} />
        </div>
        <div className="space-y-6 md:space-y-8">
          <InfoItem label="Otasining ismi" value={child.father_name} />
          <InfoItem label="Onasining ismi" value={child.mother_name} />
          <InfoItem label="Telefon 1" value={child.phone_number} />
          <InfoItem label="Telefon 2" value={child.phone_number_2} />
          <InfoItem label="Manzil" value={child.address} />
          <InfoItem label="Guruh mutaxassisi" value={groupSpecialist} />
          <InfoItem label="Guruhga qabul qilingan sana" value={formatDate(consultation?.group_acceptance_date)} />
        </div>
      </div>
    </div>
  );
}

function ChildHistoryTab({ child }: { child: ChildDetailOut }) {
  const a = child.anamnesis;

  if (!a) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Baby className="w-8 h-8 text-gray-300" />
        <p className="text-sm text-gray-400 font-medium">Rivojlanish tarixi kiritilmagan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
        <h3 className="font-bold text-[#1e293b]">Rivojlanish tarixi</h3>
        <ChevronDown className="w-5 h-5 text-slate-300" />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <SectionCard
          title="Homiladorlik davri"
          icon={<Baby className="w-3.5 h-3.5 text-blue-500" />}
          items={[
            { label: "1-trimestr", value: a.pregnancy_1_trimester },
            { label: "2-trimestr", value: a.pregnancy_2_trimester },
            { label: "3-trimestr", value: a.pregnancy_3_trimester },
            { label: "Tug'ruq jarayoni", value: a.birth_process },
          ]}
        />
        <SectionCard
          title="Ilk rivojlanish"
          icon={<Baby className="w-3.5 h-3.5 text-blue-500" />}
          items={[
            { label: "Tug'ilgandagi vazni", value: a.birth_weight },
            { label: "Birinchi 40 kunlik", value: a.first_40_days },
            { label: "1 yoshgacha davr", value: a.up_to_1_year },
            { label: "Necha yoshgacha emgan", value: a.breastfeeding_duration },
            { label: "Necha yoshda yurgan", value: a.walking_age ? `${a.walking_age} oy` : null },
          ]}
        />
        <SectionCard
          title="Muhit va odatlar"
          icon={<Activity className="w-3.5 h-3.5 text-blue-500" />}
          items={[
            { label: "Gadjetlarga qachon o'tirgan", value: a.gadget_usage_age ? `${a.gadget_usage_age} yoshdan` : null },
            { label: "Bog'chaga chiqqanmi (yoshi)", value: a.kindergarten_age ? a.kindergarten_age : "Yo'q" },
            { label: "Uxash vaqti va kim bilan", value: a.sleep_habits },
            { label: "Nimalar iste'mol qiladi", value: a.eating_habits },
            { label: "Ich qotadimi", value: a.has_constipation ? "Ha" : "Ba'zan" },
            { label: "Ich ketadimi", value: a.has_diarrhea ? "Ha" : "Yo'q" },
            { label: "Pampers taqadimi", value: a.wears_pampers ? "Ha" : "Yo'q" },
            { label: "Cho'milishni yaxshi ko'radimi", value: a.likes_bathing ? "Ha" : "Yo'q" },
          ]}
        />
        <SectionCard
          title="Nutq va kognitiv"
          icon={<Brain className="w-3.5 h-3.5 text-blue-500" />}
          items={[
            { label: "Ichki nutqi bormi", value: a.has_inner_speech ? "Ha" : "Cheklangan" },
            { label: "Birinchi so'zi qachon paydo bo'lgan", value: a.first_word_age ? `${a.first_word_age} yosh` : null },
            { label: "Hozirda nechta so'zi bor", value: a.current_vocabulary_count },
            { label: "Emlash holati", value: a.vaccination },
            { label: "Tashxis", value: child.diagnosis },
          ]}
        />
      </div>
    </div>
  );
}

export default function ParentChildInfo() {
  const [activeTab, setActiveTab] = useState<"basic" | "history">("basic");
  const { data: child, isLoading, isError } = useMyChild(true);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-[#9EB1D4] font-medium">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[#1e293b] font-bold">Ma'lumot topilmadi</p>
        <p className="text-[#9EB1D4] text-sm">Bola profili mavjud emas yoki yuklanmadi</p>
      </div>
    );
  }

  const age = calculateAge(child.birth_date);


  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl font-bold text-[#1e293b]">Bolam ma'lumotlari</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
            <div className="h-[44px] bg-[#3b82f6] px-6 flex items-center">
              <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Bemor profili</span>
            </div>
            <div className="px-8 pb-8 pt-6 flex flex-col md:flex-row gap-6">
              {child.photo ? (
                <img
                  src={import.meta.env.VITE_API_MEDIA_URL + child.photo}
                  alt={child.fio}
                  className="w-20 h-20 rounded-2xl object-cover border border-blue-50 shadow-inner"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#f8fafc] flex items-center justify-center shadow-inner border border-blue-50 shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              )}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#1e293b]">{child.fio}</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    {child.diagnosis && (
                      <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {child.diagnosis}
                      </div>
                    )}
                    {child.status && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-green-600 uppercase">{child.status}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-xs text-slate-400">
                  {child.alias && (
                    <p>
                      Taxallusi: <span className="text-slate-700 font-semibold">{child.alias}</span>
                    </p>
                  )}
                  {child.birth_date && (
                    <p>
                      Tug'ilgan sana: <span className="text-slate-700 font-semibold">{formatDate(child.birth_date)}</span>
                    </p>
                  )}
                  {child.birth_date && (
                    <p>
                      Yoshi: <span className="text-slate-700 font-semibold">{age}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Container */}
          <div className="flex overflow-x-auto pb-2 scrollbar-none lg:overflow-visible mb-4">
            <div className="inline-flex p-1 bg-[#f1f5f9] rounded-xl w-max whitespace-nowrap">
              <button
                onClick={() => setActiveTab("basic")}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                  activeTab === "basic" ? "bg-white text-slate-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Asosiy ma'lumotlar
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                  activeTab === "history" ? "bg-white text-slate-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Rivojlanish tarixi
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100">
            {activeTab === "basic" ? (
              <ChildBasicTab child={child} />
            ) : (
              <ChildHistoryTab child={child} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
