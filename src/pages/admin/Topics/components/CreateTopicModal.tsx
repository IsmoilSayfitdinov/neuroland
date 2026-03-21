import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SkillsAPI } from "@/api/skills.api";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { CustomSelect } from "@/components/ui/custom-select";

const inputCls = "w-full h-[46px] bg-[#F8F9FB] rounded-[10px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";
const textareaCls = "w-full bg-[#F8F9FB] rounded-[10px] px-4 py-3 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4] resize-none";

interface CreateTopicModalProps {
  onClose: () => void;
  onSave: (data: { title: string; description?: string | null; category?: number | null; start_date?: string; end_date?: string }) => void;
  isPending: boolean;
}

export function CreateTopicModal({ onClose, onSave, isPending }: CreateTopicModalProps) {
  const [form, setForm] = useState({ title: "", description: "", category: "", start_date: "", end_date: "" });
  const { data: sections } = useQuery({ queryKey: ["sections"], queryFn: () => SkillsAPI.listSections() });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave({
      title: form.title,
      description: form.description || null,
      category: form.category ? Number(form.category) : null,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[480px] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi mavzu yaratish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Mavzu nomi</label>
            <input className={inputCls} placeholder="Masalan: Hayvonlar olami" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Tavsif (ixtiyoriy)</label>
            <textarea rows={3} className={textareaCls} placeholder="Mavzu haqida qisqa tavsif" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <CustomSelect
            label="Kategoriya (ixtiyoriy)"
            options={sections?.map((s) => ({ label: s.name, value: s.id.toString() })) ?? []}
            value={form.category}
            onChange={(val) => set("category", val.toString())}
            placeholder="Kategoriya tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Boshlanish</label>
              <CustomDatePicker value={form.start_date} onChange={(v) => set("start_date", v)} placeholder="Sana" className="bg-[#F8F9FB] border-none rounded-[10px]" />
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Tugash</label>
              <CustomDatePicker value={form.end_date} onChange={(v) => set("end_date", v)} placeholder="Sana" className="bg-[#F8F9FB] border-none rounded-[10px]" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={handleSubmit} disabled={!form.title.trim() || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}
