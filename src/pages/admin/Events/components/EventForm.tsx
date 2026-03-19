import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
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
    <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4">
      <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Yangi tadbir qo'shish</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Tadbir nomi</label>
            <input
              type="text"
              required
              placeholder="Tadbir nomini kiriting"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-[52px] px-5 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Tadbir turi</label>
            <CustomSelect
              options={[
                { label: "Haftalik mashg'ulot", value: "weekly_session" },
                { label: "Oylik trening", value: "monthly_training" },
              ]}
              value={formData.event_type}
              onChange={(val) => setFormData({ ...formData, event_type: val as EventTypeEnum })}
              placeholder="Tanlang..."
              className="bg-[#F8F9FB] border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Sana</label>
            <input
              type="date"
              required
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              className="w-full h-[52px] px-5 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Vaqt (ixtiyoriy)</label>
            <input
              type="time"
              value={formData.scheduled_time}
              onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
              className="w-full h-[52px] px-5 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Guruh (ixtiyoriy)</label>
            <CustomSelect
              options={[{ label: "Barcha bolalar", value: "" }, ...groupOptions]}
              value={formData.group_id}
              onChange={(val) =>
                setFormData({ ...formData, group_id: val.toString(), all_children: !val })
              }
              placeholder="Guruh tanlang"
              className="bg-[#F8F9FB] border-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#6B7A99]">Tavsif</label>
          <textarea
            placeholder="Tadbir haqida ma'lumot..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-[120px] p-5 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-[48px] px-8 rounded-[12px] text-[#6B7A99] font-bold"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-[48px] px-10 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-lg shadow-[#2563EB]/20"
          >
            {isLoading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </form>
    </div>
  );
}
