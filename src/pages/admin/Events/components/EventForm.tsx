import { useState } from "react";
import { FileText, Layers, Type, Users, X } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { CustomTimePicker } from "@/components/ui/custom-time-picker";
import type { MothersEventRequest, EventTypeEnum } from "@/types/meetings.types";

interface EventFormProps {
  groupOptions: { label: string; value: string }[];
  onSave: (data: MothersEventRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({ groupOptions, onSave, onCancel, isLoading }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    event_type: "weekly_session" as EventTypeEnum,
    scheduled_date: "",
    scheduled_time: "",
    description: "",
    all_children: true,
    group_id: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: MothersEventRequest = {
      title: formData.title,
      event_type: formData.event_type,
      scheduled_date: formData.scheduled_date,
      scheduled_time: formData.scheduled_time || undefined,
      description: formData.description || undefined,
      all_children: formData.all_children,
      groups: formData.group_id ? [Number(formData.group_id)] : undefined,
    };
    onSave(payload);
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div>
          <h3 className="text-[17px] font-bold text-[#2D3142]">Yangi tadbir qo'shish</h3>
          <p className="text-[13px] text-[#9EB1D4] mt-0.5">Tadbir ma'lumotlarini kiriting</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-white/80 text-[#9EB1D4] hover:text-[#2D3142] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tadbir nomi */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2D3142]">
              <Type className="w-3.5 h-3.5 text-blue-500" />
              Tadbir nomi
            </label>
            <input
              type="text"
              required
              placeholder="Tadbir nomini kiriting"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-[48px] px-4 bg-[#F8F9FB] border border-transparent rounded-[12px] text-[14px] outline-none focus:bg-white focus:border-[#4D89FF] focus:shadow-[0_0_0_3px_rgba(77,137,255,0.08)] transition-all placeholder:text-[#9EB1D4]"
            />
          </div>

          {/* Tadbir turi */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2D3142]">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Tadbir turi
            </label>
            <CustomSelect
              options={[
                { label: "Haftalik mashg'ulot", value: "weekly_session" },
                { label: "Oylik trening", value: "monthly_training" },
              ]}
              value={formData.event_type}
              onChange={(val) => setFormData({ ...formData, event_type: val as EventTypeEnum })}
              placeholder="Turni tanlang..."
              bgBtnColor="bg-[#F8F9FB]"
            />
          </div>

          {/* Sana */}
          <div className="space-y-2">
            <CustomDatePicker
              label="Sana"
              value={formData.scheduled_date}
              onChange={(date) => setFormData({ ...formData, scheduled_date: date })}
              placeholder="Sanani tanlang"
            />
          </div>

          {/* Vaqt */}
          <div className="space-y-2">
            <CustomTimePicker
              label="Vaqt (ixtiyoriy)"
              value={formData.scheduled_time}
              onChange={(time) => setFormData({ ...formData, scheduled_time: time })}
              placeholder="Vaqtni tanlang"
            />
          </div>

          {/* Guruh */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2D3142]">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              Guruh
              <span className="text-[11px] text-[#9EB1D4] font-normal">(ixtiyoriy)</span>
            </label>
            <CustomSelect
              options={[{ label: "Barcha bolalar", value: "" }, ...groupOptions]}
              value={formData.group_id}
              onChange={(val) =>
                setFormData({ ...formData, group_id: val.toString(), all_children: !val })
              }
              placeholder="Guruh tanlang"
              bgBtnColor="bg-[#F8F9FB]"
            />
          </div>
        </div>

        {/* Tavsif */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2D3142]">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            Tavsif
          </label>
          <textarea
            placeholder="Tadbir haqida ma'lumot..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-[120px] p-4 bg-[#F8F9FB] border border-transparent rounded-[16px] text-[14px] outline-none focus:bg-white focus:border-[#4D89FF] focus:shadow-[0_0_0_3px_rgba(77,137,255,0.08)] transition-all placeholder:text-[#9EB1D4] resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="h-[44px] px-6 rounded-[12px] text-[14px] font-medium text-[#6B7A99] hover:bg-gray-100 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="h-[44px] px-8 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
          >
            {isLoading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
