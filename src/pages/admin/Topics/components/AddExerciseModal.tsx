import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SkillsAPI } from "@/api/skills.api";
import { VideosAPI } from "@/api/videos.api";
import { CustomSelect } from "@/components/ui/custom-select";

const textareaCls = "w-full bg-[#F8F9FB] rounded-[10px] px-4 py-3 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4] resize-none";

interface AddExerciseModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  isPending: boolean;
}

export function AddExerciseModal({ onClose, onSave, isPending }: AddExerciseModalProps) {
  const [sectionId, setSectionId] = useState("");
  const [form, setForm] = useState({ exercise: "", video: "", order: "1", instruction: "" });

  const { data: sections } = useQuery({ queryKey: ["sections"], queryFn: () => SkillsAPI.listSections() });
  const { data: exercises } = useQuery({
    queryKey: ["exercises-by-section", sectionId],
    queryFn: () => SkillsAPI.listExercisesBySection(Number(sectionId)),
    enabled: !!sectionId,
  });
  const { data: videos } = useQuery({ queryKey: ["videos-list"], queryFn: () => VideosAPI.listVideos() });

  const selectedExercise = exercises?.find((ex) => ex.id === Number(form.exercise));
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.exercise) return;
    onSave({
      title: selectedExercise?.name || `Mashq #${form.exercise}`,
      exercise: Number(form.exercise),
      video: form.video ? Number(form.video) : undefined,
      order: Number(form.order) || 1,
      instruction: form.instruction || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[480px] p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Mashq qo'shish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          <CustomSelect label="Bo'lim" options={sections?.map((s) => ({ label: s.name, value: s.id.toString() })) ?? []}
            value={sectionId} onChange={(val) => { setSectionId(val.toString()); set("exercise", ""); }}
            placeholder="Bo'limni tanlang..." bgBtnColor="bg-[#F8F9FB]" />
          <CustomSelect label="Mashq" options={exercises?.map((ex) => ({ label: ex.name, value: ex.id.toString() })) ?? []}
            value={form.exercise} onChange={(val) => set("exercise", val.toString())}
            placeholder={sectionId ? "Mashqni tanlang..." : "Avval bo'lim tanlang"} disabled={!sectionId} bgBtnColor="bg-[#F8F9FB]" />
          <CustomSelect label="Video (ixtiyoriy)" options={videos?.map((v) => ({ label: v.title, value: v.id.toString() })) ?? []}
            value={form.video} onChange={(val) => set("video", val.toString())}
            placeholder="Video tanlang..." bgBtnColor="bg-[#F8F9FB]" />
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Ko'rsatma (ixtiyoriy)</label>
            <textarea rows={3} className={textareaCls} placeholder="Ushbu videoni bolaga ko'rsating va takrorlashga undang"
              value={form.instruction} onChange={(e) => set("instruction", e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={handleSubmit} disabled={!form.exercise || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}
