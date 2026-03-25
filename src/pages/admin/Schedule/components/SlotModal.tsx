import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { CustomSelect } from "@/components/ui/custom-select";
import { toast } from "sonner";
import type { ScheduleSlotRequest } from "@/types/session.types";

const WEEKDAYS = [
  { label: "Dushanba", value: "1" },
  { label: "Seshanba", value: "2" },
  { label: "Chorshanba", value: "3" },
  { label: "Payshanba", value: "4" },
  { label: "Juma", value: "5" },
  { label: "Shanba", value: "6" },
  { label: "Yakshanba", value: "7" },
];

const SESSION_TYPES = [
  { label: "Guruh", value: "group" },
  { label: "Individual", value: "individual" },
];

const inputCls = "w-full h-[48px] bg-[#F8F9FB] rounded-[12px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";

export interface EditSlotData {
  slotId: number;
  specialist: number;
  weekday: number;
  start_time: string;
  duration_min: number;
  session_type: string;
}

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number | null;
  specialistOptions: { label: string; value: string }[];
  editSlot?: EditSlotData | null;
}

const EMPTY_FORM = { specialist: "", weekday: "", start_time: "09:00", duration_min: "45", session_type: "group" };

export function SlotModal({ isOpen, onClose, groupId, specialistOptions, editSlot }: SlotModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editSlot;

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editSlot) {
      setForm({
        specialist: String(editSlot.specialist),
        weekday: String(editSlot.weekday),
        start_time: editSlot.start_time,
        duration_min: String(editSlot.duration_min),
        session_type: editSlot.session_type,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editSlot, isOpen]);

  const { mutate: createSlot, isPending: creating } = useMutation({
    mutationFn: (data: ScheduleSlotRequest) => SessionsAPI.createSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-slots"] });
      toast.success("Jadval uyasi yaratildi");
      onClose();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const { mutate: patchSlot, isPending: patching } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ScheduleSlotRequest> }) =>
      SessionsAPI.patchSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-slots"] });
      toast.success("Jadval uyasi yangilandi");
      onClose();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const isPending = creating || patching;

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.specialist || !form.weekday) return;
    const payload = {
      specialist: Number(form.specialist),
      group: groupId ?? undefined,
      session_type: form.session_type as "group" | "individual",
      weekday: Number(form.weekday) as any,
      start_time: form.start_time,
      duration_min: Number(form.duration_min) || 45,
      is_active: true,
    };
    if (isEdit && editSlot) {
      patchSlot({ id: editSlot.slotId, data: payload });
    } else {
      if (!groupId) return;
      createSlot({ ...payload, group: groupId });
    }
  };

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[460px] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-[#2D3142]">
              {isEdit ? "Jadval uyasini tahrirlash" : "Jadval uyasi yaratish"}
            </h3>
            <p className="text-[12px] text-[#9EB1D4] mt-0.5">Doimiy haftalik jadval</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <X className="w-4 h-4 text-[#9EB1D4]" />
          </button>
        </div>

        <div className="space-y-4">
          <CustomSelect
            label="Mutaxassis"
            options={specialistOptions}
            value={form.specialist}
            onChange={(val) => set("specialist", val.toString())}
            placeholder="Mutaxassis tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Hafta kuni"
              options={WEEKDAYS}
              value={form.weekday}
              onChange={(val) => set("weekday", val.toString())}
              placeholder="Kun tanlang..."
              bgBtnColor="bg-[#F8F9FB]"
            />
            <CustomSelect
              label="Tur"
              options={SESSION_TYPES}
              value={form.session_type}
              onChange={(val) => set("session_type", val.toString())}
              placeholder="Tur tanlang..."
              bgBtnColor="bg-[#F8F9FB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Boshlanish vaqti</label>
              <input type="time" className={inputCls} value={form.start_time} onChange={(e) => set("start_time", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Davomiyligi (daqiqa)</label>
              <input type="number" className={inputCls} placeholder="45" value={form.duration_min} onChange={(e) => set("duration_min", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">
            Bekor qilish
          </button>
          <button onClick={handleSubmit} disabled={!form.specialist || !form.weekday || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Saqlash" : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}
