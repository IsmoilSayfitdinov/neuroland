import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  bgBtnColor?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Tanlang...",
  label,
  error,
  disabled = false,
  className,
  bgBtnColor,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-[14px] font-medium text-[#2D3142]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            `w-full h-[52px] px-4 flex items-center justify-between rounded-[12px] ${bgBtnColor} border border-transparent transition-all duration-200 outline-none`,
            isOpen && "bg-white border-[#4D89FF] shadow-[0_0_0_4px_rgba(77,137,255,0.1)]",
            error && "border-red-500 bg-red-50",
            disabled && "opacity-50 cursor-not-allowed",
            !isOpen && !error && "hover:bg-[#F1F3F7]"
          )}
        >
          <span className={cn(
            "text-[14px] truncate",
            selectedOption ? "text-[#2D3142]" : "text-[#9EB1D4]"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-[#9EB1D4]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-2 bg-white rounded-[16px] border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="max-h-[280px] overflow-y-auto p-2 custom-scrollbar">
                {options.length === 0 ? (
                  <div className="px-4 py-3 text-[14px] text-[#9EB1D4] text-center italic">
                    Ma'lumot mavjud emas
                  </div>
                ) : (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 flex items-center justify-between rounded-[10px] text-[14px] transition-colors text-left",
                        option.value === value
                          ? "bg-[#F0F5FF] text-[#4D89FF] font-medium"
                          : "hover:bg-gray-50 text-[#2D3142]"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {option.value === value && (
                        <Check className="w-4 h-4 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-medium ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
