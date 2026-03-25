import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";
import type { Badge, ConditionRules, ConditionType } from "@/types/gamification.types";

const ICONS = ["🥇", "🔥", "⭐", "👤", "📚", "📝", "🎯", "💎", "🏆", "🎖️", "🌟", "🚀", "🥉", "🏅", "👾"];

const CONDITION_TYPES: { label: string; value: ConditionType }[] = [
  { label: "XP yig'ish", value: "xp_threshold" },
  { label: "Vazifa yuborildi", value: "tasks_completed" },
  { label: "Vazifa tasdiqlandi", value: "tasks_approved" },
  { label: "Tadbirda qatnashdi", value: "events_attended" },
  { label: "AND — barchasi bajarilsin", value: "and" },
  { label: "OR — kamida bittasi", value: "or" },
];

const SIMPLE_TYPES: { label: string; value: string }[] = [
  { label: "XP yig'ish", value: "xp_threshold" },
  { label: "Vazifa yuborildi", value: "tasks_completed" },
  { label: "Vazifa tasdiqlandi", value: "tasks_approved" },
  { label: "Tadbirda qatnashdi", value: "events_attended" },
];

const TYPE_LABELS: Record<string, string> = {
  xp_threshold: "XP yig'ish",
  tasks_completed: "Vazifa yuborildi",
  tasks_approved: "Vazifa tasdiqlandi",
  events_attended: "Tadbirda qatnashdi",
  and: "AND — barchasi",
  or: "OR — kamida bittasi",
};

function isCompound(type: string): type is "and" | "or" {
  return type === "and" || type === "or";
}

interface SubRule {
  type: string;
  value: number;
}

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; description: string; condition_rules: ConditionRules; is_active: boolean }) => void;
  initialData?: Badge | null;
  isPending?: boolean;
}

export function BadgeModal({ isOpen, onClose, onSave, initialData, isPending }: BadgeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: ICONS[0],
    is_active: true,
  });

  const [conditionType, setConditionType] = useState<ConditionType>("xp_threshold");
  const [simpleValue, setSimpleValue] = useState(100);
  const [subRules, setSubRules] = useState<SubRule[]>([
    { type: "xp_threshold", value: 100 },
    { type: "tasks_approved", value: 5 },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon || ICONS[0],
        is_active: initialData.is_active,
      });
      const rules = initialData.condition_rules;
      if (rules && typeof rules === "object") {
        setConditionType(rules.type as ConditionType);
        if (isCompound(rules.type) && "rules" in rules) {
          setSubRules(
            rules.rules.map((r: any) => ({ type: r.type, value: r.value || 0 }))
          );
        } else if ("value" in rules) {
          setSimpleValue(rules.value);
        }
      }
    } else {
      setFormData({ name: "", description: "", icon: ICONS[0], is_active: true });
      setConditionType("xp_threshold");
      setSimpleValue(100);
      setSubRules([
        { type: "xp_threshold", value: 100 },
        { type: "tasks_approved", value: 5 },
      ]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let condition_rules: ConditionRules;

    if (isCompound(conditionType)) {
      condition_rules = {
        type: conditionType,
        rules: subRules.map((r) => ({
          type: r.type as any,
          value: r.value,
        })),
      };
    } else {
      condition_rules = {
        type: conditionType,
        value: simpleValue,
      };
    }

    onSave({ ...formData, condition_rules });
  };

  const addSubRule = () => {
    setSubRules([...subRules, { type: "xp_threshold", value: 100 }]);
  };

  const removeSubRule = (idx: number) => {
    if (subRules.length > 2) {
      setSubRules(subRules.filter((_, i) => i !== idx));
    }
  };

  const updateSubRule = (idx: number, field: keyof SubRule, val: string | number) => {
    setSubRules(subRules.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };

  const buildPreview = (): string => {
    if (isCompound(conditionType)) {
      const parts = subRules.map(
        (r) => `${TYPE_LABELS[r.type] || r.type}: ${r.value}`
      );
      return conditionType === "and"
        ? parts.join(" VA ")
        : parts.join(" YOKI ");
    }
    return `${TYPE_LABELS[conditionType]}: ${simpleValue}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[560px] max-h-[90vh] overflow-y-auto p-8 rounded-[32px] border-none shadow-2xl scrollbar-hide">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-[20px] font-bold text-[#2D3142] text-left">
            {initialData ? "Badgeni tahrirlash" : "Yangi badge qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Badge nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: Birinchi qadam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-[48px] px-4 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4]"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B7A99]">Tavsif</label>
            <textarea
              placeholder="Badge haqida qisqacha ma'lumot..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-[90px] p-4 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] resize-none"
            />
          </div>

          {/* Icon */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#6B7A99]">Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={cn(
                    "w-[48px] h-[48px] flex items-center justify-center text-xl rounded-full transition-all border-2",
                    formData.icon === icon
                      ? "bg-[#EEF4FF] border-[#4D89FF] scale-110"
                      : "bg-[#F8F9FB] border-transparent hover:border-[#E1E5EE]"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Rules */}
          <div className="space-y-4 p-5 bg-gradient-to-br from-[#F8F9FB] to-[#F0F4FF] rounded-[16px] border border-[#E8EDFB]">
            <label className="text-[14px] font-bold text-[#2D3142]">Ochilish sharti</label>

            {/* Condition Type Selector */}
            <CustomSelect
              options={CONDITION_TYPES}
              value={conditionType}
              onChange={(val) => setConditionType(val as ConditionType)}
              placeholder="Shart turini tanlang"
              bgBtnColor="bg-white"
            />

            {/* Simple condition */}
            {!isCompound(conditionType) && (
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#6B7A99]">
                  {conditionType === "xp_threshold" ? "Kerakli XP miqdori" : "Necha marta"}
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={simpleValue}
                  onChange={(e) => setSimpleValue(Number(e.target.value))}
                  className="w-full h-[44px] px-4 bg-white rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all border border-gray-100"
                />
              </div>
            )}

            {/* Compound condition (AND / OR) */}
            {isCompound(conditionType) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-medium text-[#6B7A99]">
                    {conditionType === "and" ? "Barcha shartlar bajarilishi kerak" : "Kamida bittasi bajarilishi kerak"}
                  </label>
                  <button
                    type="button"
                    onClick={addSubRule}
                    className="flex items-center gap-1 text-[12px] font-bold text-[#4D89FF] hover:text-blue-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Shart qo'shish
                  </button>
                </div>

                {subRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-[12px] border border-gray-100">
                    <div className="flex-1">
                      <CustomSelect
                        options={SIMPLE_TYPES}
                        value={rule.type}
                        onChange={(val) => updateSubRule(idx, "type", val as string)}
                        placeholder="Tur"
                        bgBtnColor="bg-[#F8F9FB]"
                      />
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={rule.value}
                      onChange={(e) => updateSubRule(idx, "value", Number(e.target.value))}
                      className="w-[90px] h-[48px] px-3 bg-[#F8F9FB] rounded-[10px] text-[14px] text-center outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all"
                    />
                    {subRules.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeSubRule(idx)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Preview */}
            <div className="flex items-start gap-2 pt-2 border-t border-gray-100/60">
              <span className="text-[11px] text-[#9EB1D4] shrink-0 mt-0.5">Shart:</span>
              <span className="text-[12px] font-semibold text-[#2D3142]">
                {buildPreview()}
              </span>
            </div>
          </div>

          {/* Active toggle */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-[48px] px-8 rounded-[12px] text-[#6B7A99] font-bold"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-[48px] px-10 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-lg shadow-[#2563EB]/20 disabled:opacity-70"
            >
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
