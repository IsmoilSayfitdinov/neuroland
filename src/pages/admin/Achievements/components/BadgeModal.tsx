import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ICONS = ["🥇", "🔥", "⭐", "👤", "📚", "📝", "🎯", "💎", "🏆", "🎖️", "🌟", "🚀", "🥉", "🏅", "👾"];

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export function BadgeModal({ isOpen, onClose, onSave, initialData }: BadgeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: ICONS[0],
    rewardType: "Badge",
    rewardValue: 50,
    requirement: "7 kun ketma-ket kirish",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        description: "",
        icon: ICONS[0],
        rewardType: "Badge",
        rewardValue: 50,
        requirement: "7 kun ketma-ket kirish",
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

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#6B7A99]">Mukofot turi</label>
              <CustomSelect
                options={[
                  { label: "Badge", value: "Badge" },
                  { label: "Bonus XP", value: "Bonus XP" },
                  { label: "Sovg'a", value: "Sovg'a" },
                ]}
                value={formData.rewardType}
                onChange={(val) => setFormData({ ...formData, rewardType: val.toString() })}
                className="bg-[#F8F9FB] border-none h-[52px] rounded-[10px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#6B7A99]">XP ball</label>
              <input 
                type="number"
                value={formData.rewardValue}
                onChange={(e) => setFormData({ ...formData, rewardValue: parseInt(e.target.value) })}
                className="w-full h-[52px] px-5 bg-[#F8F9FB] border-none rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Ochilish sharti</label>
            <CustomSelect
              options={[
                { label: "7 kun ketma-ket kirish", value: "7 kun ketma-ket kirish" },
                { label: "1-haftalik reja bajarildi", value: "1-haftalik reja bajarildi" },
                { label: "Nutq bo'limida 80% ga yetish", value: "Nutq bo'limida 80% ga yetish" },
                { label: "5 ta video ko'rildi", value: "5 ta video ko'rildi" },
                { label: "10 ta mashg'ulot bajarildi", value: "10 ta mashg'ulot bajarildi" },
              ]}
              value={formData.requirement}
              onChange={(val) => setFormData({ ...formData, requirement: val.toString() })}
              className="bg-[#F8F9FB] border-none h-[52px] rounded-[10px]"
            />
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
              className="h-[48px] px-10 rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-lg shadow-[#2563EB]/20"
            >
              Saqlash
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
