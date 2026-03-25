import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { CustomTimePicker } from "@/components/ui/custom-time-picker";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    start_time: string;
    group?: number | null;
    specialist?: number | null;
  }) => void;
  isPending: boolean;
  groupOptions: { label: string; value: string }[];
  specialistOptions: { label: string; value: string }[];
  defaultGroupId?: number | null;
}

const today = new Date().toISOString().split("T")[0];
const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export function SessionModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  groupOptions,
  specialistOptions,
  defaultGroupId,
}: SessionModalProps) {
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState(nowTime);
  const [groupId, setGroupId] = useState(defaultGroupId?.toString() ?? "");
  const [specialistId, setSpecialistId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(today);
      setStartTime(nowTime());
      setGroupId(defaultGroupId?.toString() ?? "");
      setSpecialistId("");
    }
  }, [isOpen, defaultGroupId]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!date || !startTime) return;
    onSubmit({
      date,
      start_time: startTime,
      group: groupId ? Number(groupId) : null,
      specialist: specialistId ? Number(specialistId) : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[460px] p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi seans</h3>
            <p className="text-[12px] text-[#9EB1D4] mt-0.5">Kunlik seans yaratish</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-[#9EB1D4]" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Sana *</label>
              <CustomDatePicker value={date} onChange={setDate} placeholder="Sana" />
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Vaqt *</label>
              <CustomTimePicker value={startTime} onChange={setStartTime} placeholder="Vaqt" />
            </div>
          </div>

          {/* Group */}
          <CustomSelect
            label="Guruh (ixtiyoriy)"
            options={groupOptions}
            value={groupId}
            onChange={(v) => setGroupId(v.toString())}
            placeholder="Guruh tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />

          {/* Specialist */}
          <CustomSelect
            label="Mutaxassis (ixtiyoriy)"
            options={specialistOptions}
            value={specialistId}
            onChange={(v) => setSpecialistId(v.toString())}
            placeholder="Mutaxassis tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            disabled={!date || !startTime || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}
