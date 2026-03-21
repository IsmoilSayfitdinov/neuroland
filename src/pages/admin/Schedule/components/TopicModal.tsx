import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

interface SelectOption {
  label: string;
  value: string;
}

export interface TopicFormData {
  title: string;
  category: string;
  group: string;
}

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TopicFormData) => void;
  sectionOptions?: SelectOption[];
  groupOptions?: SelectOption[];
  isLoading?: boolean;
}

export function TopicModal({ isOpen, onClose, onSave, sectionOptions = [], groupOptions = [], isLoading }: TopicModalProps) {
  const [formData, setFormData] = useState<TopicFormData>({
    title: "",
    category: "",
    group: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", category: "", group: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-[24px] w-full max-w-[440px] p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi mavzu</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-[#9EB1D4]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mavzu nomi */}
          <div>
            <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Mavzu nomi</label>
            <input
              type="text"
              required
              placeholder="Mavzu nomini kiriting"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-[48px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] text-[#2D3142] transition-colors placeholder:text-[#9EB1D4]"
            />
          </div>

          {/* Bo'lim */}
          <div>
            <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Bo'lim</label>
            <CustomSelect
              options={sectionOptions}
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val.toString() })}
              placeholder="Bo'limni kiriting"
            />
          </div>

          {/* Guruh */}
          <div>
            <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Guruh</label>
            <CustomSelect
              options={groupOptions}
              value={formData.group}
              onChange={(val) => setFormData({ ...formData, group: val.toString() })}
              placeholder="Guruhni kiriting"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[48px] rounded-[14px] border border-gray-200 text-[#2D3142] text-[14px] font-bold hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title}
              className="flex-1 h-[48px] rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</>
                : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
