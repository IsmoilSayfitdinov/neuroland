import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types/gamification.types";

const ICONS = ["🥇", "🔥", "⭐", "👤", "📚", "📝", "🎯", "💎", "🏆", "🎖️", "🌟", "🚀", "🥉", "🏅", "👾"];

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; description: string; condition_rules: string; is_active: boolean }) => void;
  initialData?: Badge | null;
  isPending?: boolean;
}

export function BadgeModal({ isOpen, onClose, onSave, initialData, isPending }: BadgeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: ICONS[0],
    condition_rules: "",
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon || ICONS[0],
        condition_rules: initialData.condition_rules || "",
        is_active: initialData.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: ICONS[0],
        condition_rules: "",
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[512px] max-h-[90vh] overflow-y-auto p-8 rounded-[32px] border-none shadow-2xl scrollbar-hide">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-[20px] font-bold text-[#2D3142] text-left">
            {initialData ? "Badgeni tahrirlash" : "Yangi badge qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Badge nomi</label>
            <input
              type="text"
              placeholder="Masalan: Birinchi qadam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-[52px] px-5 bg-[#F8F9FB] border-none rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Tavsif</label>
            <textarea
              placeholder="Badge haqida qisqacha ma'lumot..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-[100px] p-5 bg-[#F8F9FB] border-none rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#6B7A99]">Icon</label>
            <div className="grid grid-cols-7 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={cn(
                    "w-[52px] h-[52px] flex items-center justify-center text-2xl rounded-full transition-all border-2",
                    formData.icon === icon
                      ? "bg-[#EEF4FF] border-[#4D89FF]"
                      : "bg-[#F8F9FB] border-transparent hover:border-[#E1E5EE]"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Ochilish sharti (condition_rules)</label>
            <input
              type="text"
              placeholder="Masalan: 7 kun ketma-ket kirish"
              value={formData.condition_rules}
              onChange={(e) => setFormData({ ...formData, condition_rules: e.target.value })}
              className="w-full h-[52px] px-5 bg-[#F8F9FB] border-none rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              className="w-[44px] h-[22px] rounded-full relative transition-all duration-200 focus:outline-none cursor-pointer"
              style={{ backgroundColor: formData.is_active ? "#2563EB" : "#E1E5EE" }}
            >
              <div className={cn(
                "absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 shadow-sm",
                formData.is_active ? "translate-x-[24px]" : "translate-x-[2px]"
              )} />
            </button>
            <span className="text-[13px] font-medium text-[#6B7A99]">
              {formData.is_active ? "Faol" : "Nofaol"}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-[48px] px-8 rounded-[10px] text-[#6B7A99] font-bold"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-[48px] px-10 rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-lg shadow-[#2563EB]/20 disabled:opacity-70"
            >
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
