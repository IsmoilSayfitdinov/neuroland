import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { cn } from "@/lib/utils";
import { serializeSleepHabits, deserializeSleepHabits } from "@/lib/anamnesis";
import { toast } from "sonner";
import type { ChildDetailOut } from "@/types/children.types";

/* ─── Toggle ─── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-[26px] w-[50px] shrink-0 rounded-full border-2 border-transparent transition-colors duration-200",
        value ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow transition duration-200",
          value ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─── Field ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-semibold text-[#2D3142]">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-[48px] bg-[#F8F9FB] rounded-[10px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";
const textareaCls =
  "w-full bg-[#F8F9FB] rounded-[10px] px-4 py-3 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4] resize-none";

const STEPS = [
  { label: "Homiladorlik" },
  { label: "Rivojlanish" },
  { label: "Kunlik odatlar" },
  { label: "Nutq" },
  { label: "Konsultatsiya" },
];

interface AnamnesisFormProps {
  child: ChildDetailOut;
  onSave: (data: any) => Promise<void>;
  isPending: boolean;
  onBack: () => void;
  onComplete: () => void;
}

export default function AnamnesisForm({ child, onSave, isPending, onBack, onComplete }: AnamnesisFormProps) {
  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const [form, setForm] = useState(() => {
    const a = child.anamnesis;
    const c = child.consultation;
    return {
      // Anamnez
      pregnancy_1_trimester: a?.pregnancy_1_trimester || "",
      pregnancy_2_trimester: a?.pregnancy_2_trimester || "",
      pregnancy_3_trimester: a?.pregnancy_3_trimester || "",
      birth_process: a?.birth_process || "",
      birth_weight: a?.birth_weight || "",
      first_40_days: a?.first_40_days || "",
      up_to_1_year: a?.up_to_1_year || "",
      breastfeeding_duration: a?.breastfeeding_duration || "",
      pacifier_usage_period: a?.pacifier_usage_period || "",
      walking_age: a?.walking_age?.toString() || "",
      gadget_usage_age: a?.gadget_usage_age?.toString() || "",
      kindergarten_age: a?.kindergarten_age?.toString() || "",
      sleep_time: deserializeSleepHabits(a?.sleep_habits).time,
      sleep_with_who: deserializeSleepHabits(a?.sleep_habits).companion,
      eating_habits: a?.eating_habits || "",
      has_constipation: a?.has_constipation ?? false,
      has_diarrhea: a?.has_diarrhea ?? false,
      wears_pampers: a?.wears_pampers ?? false,
      likes_bathing: a?.likes_bathing ?? false,
      has_inner_speech: a?.has_inner_speech ?? false,
      first_word_age: a?.first_word_age?.toString() || "",
      current_vocabulary_count: a?.current_vocabulary_count || "",
      vaccination: a?.vaccination || "",
      // Konsultatsiya
      arrival_date: c?.arrival_date || "",
      preliminary_diagnosis: c?.preliminary_diagnosis || "",
      final_diagnosis: c?.final_diagnosis || "",
      neuro_complex_name: c?.neuro_complex_name || "",
      working_period: c?.working_period || "",
      recommendations: c?.recommendations || "",
      group_acceptance_date: c?.group_acceptance_date || "",
      accompanied_by: c?.accompanied_by || "",
      assigned_specialists: c?.assigned_specialists || [] as number[],
      // Diagnosis
      diagnosis: child.diagnosis || "",
    };
  });

  const set = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSpecialist = (specId: number) => {
    setForm((prev) => {
      const list = prev.assigned_specialists;
      return {
        ...prev,
        assigned_specialists: list.includes(specId)
          ? list.filter((id: number) => id !== specId)
          : [...list, specId],
      };
    });
  };

  // Har step faqat o'z datasi yuboriladi — boshqa fieldlar overwrite bo'lmaydi
  const buildPatch = () => {
    // Step 0-3: anamnez fieldlari
    if (step <= 3) {
      const anamnesis: Record<string, any> = {};

      if (step === 0) {
        anamnesis.pregnancy_1_trimester = form.pregnancy_1_trimester || null;
        anamnesis.pregnancy_2_trimester = form.pregnancy_2_trimester || null;
        anamnesis.pregnancy_3_trimester = form.pregnancy_3_trimester || null;
        anamnesis.birth_process = form.birth_process || null;
        anamnesis.birth_weight = form.birth_weight || null;
        anamnesis.first_40_days = form.first_40_days || null;
        anamnesis.up_to_1_year = form.up_to_1_year || null;
      }

      if (step === 1) {
        anamnesis.breastfeeding_duration = form.breastfeeding_duration || null;
        anamnesis.pacifier_usage_period = form.pacifier_usage_period || null;
        anamnesis.walking_age = form.walking_age ? Number(form.walking_age) : null;
        anamnesis.gadget_usage_age = form.gadget_usage_age ? Number(form.gadget_usage_age) : null;
        anamnesis.kindergarten_age = form.kindergarten_age ? Number(form.kindergarten_age) : null;
      }

      if (step === 2) {
        anamnesis.sleep_habits = serializeSleepHabits(form.sleep_time, form.sleep_with_who);
        anamnesis.eating_habits = form.eating_habits || null;
        anamnesis.has_constipation = form.has_constipation;
        anamnesis.has_diarrhea = form.has_diarrhea;
        anamnesis.wears_pampers = form.wears_pampers;
        anamnesis.likes_bathing = form.likes_bathing;
      }

      if (step === 3) {
        anamnesis.has_inner_speech = form.has_inner_speech;
        anamnesis.first_word_age = form.first_word_age ? Number(form.first_word_age) : null;
        anamnesis.current_vocabulary_count = form.current_vocabulary_count || null;
        anamnesis.vaccination = form.vaccination || null;
      }

      return { anamnesis };
    }

    // Step 4: konsultatsiya + diagnosis
    return {
      consultation: {
        arrival_date: form.arrival_date || null,
        preliminary_diagnosis: form.preliminary_diagnosis || null,
        final_diagnosis: form.final_diagnosis || null,
        neuro_complex_name: form.neuro_complex_name || null,
        working_period: form.working_period || null,
        recommendations: form.recommendations || null,
        group_acceptance_date: form.group_acceptance_date || null,
        accompanied_by: form.accompanied_by || null,
        assigned_specialists: form.assigned_specialists.length > 0 ? form.assigned_specialists : undefined,
      },
      ...(form.diagnosis ? { diagnosis: form.diagnosis } : {}),
    };
  };

  const [saving, setSaving] = useState(false);

  const handleSaveStep = async (isLast = false) => {
    setSaving(true);
    try {
      await onSave(buildPatch());
      setCompleted((prev) => new Set(prev).add(step));
      if (isLast) {
        toast.success("Ma'lumotlar saqlandi!");
        onComplete();
      } else {
        toast.success(`${STEPS[step].label} saqlandi`);
        setStep((s) => s + 1);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail?.[0]?.msg || err?.message || "Saqlashda xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-start justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-gray-100 z-0" />
          {STEPS.map((s, i) => {
            const done = completed.has(i);
            const active = i === step;
            return (
              <button
                key={i}
                type="button"
                onClick={() => i <= Math.max(step, ...Array.from(completed)) && setStep(i)}
                className="flex flex-col items-center gap-2 z-10 relative"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all",
                    done
                      ? "bg-blue-600 border-blue-600 text-white"
                      : active
                      ? "bg-white border-blue-600 text-blue-600"
                      : "bg-white border-gray-200 text-[#9EB1D4]"
                  )}
                >
                  {done ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-[11px] font-semibold whitespace-nowrap", active ? "text-blue-600" : done ? "text-[#2D3142]" : "text-[#9EB1D4]")}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {/* Step 0: Homiladorlik va tug'ilish */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-[17px] font-bold text-[#2D3142]">Homiladorlik va tug'ilish ma'lumotlari</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="1-trimestr qanday o'tgan">
                <textarea rows={3} className={textareaCls} placeholder="Ma'lumot kiriting" value={form.pregnancy_1_trimester} onChange={(e) => set("pregnancy_1_trimester", e.target.value)} />
              </Field>
              <Field label="2-trimestr">
                <textarea rows={3} className={textareaCls} placeholder="Ma'lumot kiriting" value={form.pregnancy_2_trimester} onChange={(e) => set("pregnancy_2_trimester", e.target.value)} />
              </Field>
              <Field label="3-trimestr">
                <textarea rows={3} className={textareaCls} placeholder="Ma'lumot kiriting" value={form.pregnancy_3_trimester} onChange={(e) => set("pregnancy_3_trimester", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Tug'ruq jarayoni">
                <textarea rows={3} className={textareaCls} placeholder="Tug'ruq haqida" value={form.birth_process} onChange={(e) => set("birth_process", e.target.value)} />
              </Field>
              <Field label="Tug'ilgandagi vazni">
                <input className={inputCls} placeholder="Masalan: 3200 gr" value={form.birth_weight} onChange={(e) => set("birth_weight", e.target.value)} />
              </Field>
              <Field label="Birinchi 40 kunlik davr">
                <textarea rows={3} className={textareaCls} placeholder="Ma'lumot kiriting" value={form.first_40_days} onChange={(e) => set("first_40_days", e.target.value)} />
              </Field>
              <Field label="1 yoshgacha davr">
                <textarea rows={3} className={textareaCls} placeholder="Ma'lumot kiriting" value={form.up_to_1_year} onChange={(e) => set("up_to_1_year", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {/* Step 1: Rivojlanish */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-[17px] font-bold text-[#2D3142]">Rivojlanish bosqichlari</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Ko'krak suti davomiyligi">
                <input className={inputCls} placeholder="Masalan: 12 oy" value={form.breastfeeding_duration} onChange={(e) => set("breastfeeding_duration", e.target.value)} />
              </Field>
              <Field label="So'rg'ich ishlatish davri">
                <input className={inputCls} placeholder="Masalan: 6 oy" value={form.pacifier_usage_period} onChange={(e) => set("pacifier_usage_period", e.target.value)} />
              </Field>
              <Field label="Yurgan yoshi (oyda)">
                <input type="number" className={inputCls} placeholder="14" value={form.walking_age} onChange={(e) => set("walking_age", e.target.value)} />
              </Field>
              <Field label="Gadjet boshlagan yoshi (oyda)">
                <input type="number" className={inputCls} placeholder="18" value={form.gadget_usage_age} onChange={(e) => set("gadget_usage_age", e.target.value)} />
              </Field>
              <Field label="Bog'cha boshlagan yoshi (oyda)">
                <input type="number" className={inputCls} placeholder="36" value={form.kindergarten_age} onChange={(e) => set("kindergarten_age", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {/* Step 2: Kunlik odatlar */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-[17px] font-bold text-[#2D3142]">Kunlik odatlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Uyqu odatlari">
                <input className={inputCls} placeholder="Masalan: Kuniga 10-12 soat" value={form.sleep_time} onChange={(e) => set("sleep_time", e.target.value)} />
              </Field>
              <Field label="Kim bilan uxlaydi">
                <input className={inputCls} placeholder="Masalan: Onasi bilan" value={form.sleep_with_who} onChange={(e) => set("sleep_with_who", e.target.value)} />
              </Field>
            </div>
            <Field label="Ovqatlanish odatlari">
              <textarea rows={4} className={textareaCls} placeholder="Ovqatlanish haqida" value={form.eating_habits} onChange={(e) => set("eating_habits", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {([
                { key: "has_constipation" as const, label: "Qabziyat bormi" },
                { key: "has_diarrhea" as const, label: "Ich ketish bormi" },
                { key: "wears_pampers" as const, label: "Pampers kiyish" },
                { key: "likes_bathing" as const, label: "Cho'milishni yoqtiradimi" },
              ]).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between bg-[#F8F9FB] rounded-[12px] px-5 h-[52px]">
                  <span className="text-[14px] font-medium text-[#2D3142]">{label}</span>
                  <Toggle value={form[key] as boolean} onChange={(v) => set(key, v)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Nutq */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-[17px] font-bold text-[#2D3142]">Nutq rivojlanishi</h2>
            <div className="flex items-center justify-between bg-[#F8F9FB] rounded-[12px] px-5 h-[52px]">
              <span className="text-[14px] font-medium text-[#2D3142]">Ichki nutq bormi</span>
              <Toggle value={form.has_inner_speech} onChange={(v) => set("has_inner_speech", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Birinchi so'z yoshi (oyda)">
                <input type="number" className={inputCls} placeholder="24" value={form.first_word_age} onChange={(e) => set("first_word_age", e.target.value)} />
              </Field>
              <Field label="Hozirgi so'z boyligi">
                <input className={inputCls} placeholder="Masalan: 15-20 so'z" value={form.current_vocabulary_count} onChange={(e) => set("current_vocabulary_count", e.target.value)} />
              </Field>
            </div>
            <Field label="Emlash tarixi">
              <textarea rows={3} className={textareaCls} placeholder="Barcha emlashlar haqida" value={form.vaccination} onChange={(e) => set("vaccination", e.target.value)} />
            </Field>
          </div>
        )}

        {/* Step 4: Konsultatsiya kartasi */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-[17px] font-bold text-[#2D3142]">Konsultatsiya kartasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Kelgan sanasi">
                <CustomDatePicker value={form.arrival_date} onChange={(v) => set("arrival_date", v)} placeholder="Sanani tanlang" className="bg-[#F8F9FB] border-none rounded-[10px]" />
              </Field>
              <Field label="Kim bilan kelgan">
                <input className={inputCls} placeholder="Masalan: Onasi - Nilufar" value={form.accompanied_by} onChange={(e) => set("accompanied_by", e.target.value)} />
              </Field>
              <Field label="Dastlabki tashxis">
                <textarea rows={3} className={textareaCls} placeholder="Nutq rivojlanishida kechikish (ZRR)" value={form.preliminary_diagnosis} onChange={(e) => set("preliminary_diagnosis", e.target.value)} />
              </Field>
              <Field label="Yakuniy tashxis">
                <textarea rows={3} className={textareaCls} placeholder="ZPRR - Psixik va nutq rivojlanishida kechikish" value={form.final_diagnosis} onChange={(e) => set("final_diagnosis", e.target.value)} />
              </Field>
              <Field label="Tashxis (diagnosis)">
                <input className={inputCls} placeholder="ZPRR" value={form.diagnosis} onChange={(e) => set("diagnosis", e.target.value)} />
              </Field>
              <Field label="Neyropsixologik kompleks nomi">
                <input className={inputCls} placeholder="Masalan: 1-kompleks" value={form.neuro_complex_name} onChange={(e) => set("neuro_complex_name", e.target.value)} />
              </Field>
              <Field label="Ishlash davri">
                <input className={inputCls} placeholder="Masalan: 12 oy" value={form.working_period} onChange={(e) => set("working_period", e.target.value)} />
              </Field>
              <Field label="Guruhga qabul sanasi">
                <CustomDatePicker value={form.group_acceptance_date} onChange={(v) => set("group_acceptance_date", v)} placeholder="Sanani tanlang" className="bg-[#F8F9FB] border-none rounded-[10px]" />
              </Field>
            </div>
            <Field label="Tavsiyalar">
              <textarea rows={4} className={textareaCls} placeholder="Logoped va neyropsixolog bilan ishlash" value={form.recommendations} onChange={(e) => set("recommendations", e.target.value)} />
            </Field>

            {/* Mutaxassis biriktirish */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-[13px] font-semibold text-[#2D3142]">Biriktirilgan mutaxassislar</label>
              {specialists && specialists.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {specialists.map((spec) => {
                    const isSelected = form.assigned_specialists.includes(spec.user_id);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => toggleSpecialist(spec.user_id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[13px] font-bold transition-all border",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-[#F8F9FB] text-[#2D3142] border-gray-100 hover:border-blue-300"
                        )}
                      >
                        {spec.fio}
                        <span className="text-[11px] font-medium ml-1.5 opacity-70">({spec.specialist_type_title})</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-[#9EB1D4]">Mutaxassislar yuklanmoqda...</p>
              )}
              {form.assigned_specialists.length > 0 && (
                <p className="text-[12px] text-blue-500 font-medium">{form.assigned_specialists.length} ta mutaxassis tanlandi</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step === 0 ? onBack() : setStep((s) => s - 1)}
          className="flex items-center gap-2 text-[14px] font-semibold text-[#9EB1D4] hover:text-[#2D3142] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Orqaga
        </button>
        <button
          onClick={() => handleSaveStep(step === STEPS.length - 1)}
          disabled={saving || isPending}
          className="flex items-center gap-2 h-[44px] px-6 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold rounded-[12px] transition-colors disabled:opacity-60"
        >
          {(saving || isPending) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : step === STEPS.length - 1 ? (
            "Saqlash va yakunlash"
          ) : (
            <>Keyingi <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
