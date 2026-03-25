import * as React from "react";
import { ChevronDown, Check, Search } from "lucide-react";
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
  searchable?: boolean;
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
  bgBtnColor = "bg-white",
  searchable = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [dropUp, setDropUp] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const showSearch = searchable || options.length > 6;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, showSearch]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 300);
    }
    if (isOpen) setSearch("");
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("space-y-2 w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-[14px] font-medium text-[#2D3142]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className={cn(
            `w-full h-[48px] px-4 flex items-center justify-between rounded-[12px] ${bgBtnColor} border transition-all duration-200 outline-none`,
            isOpen
              ? "bg-white border-[#4D89FF] shadow-[0_0_0_3px_rgba(77,137,255,0.08)]"
              : "border-transparent",
            error && "border-red-400 bg-red-50/50",
            disabled && "opacity-50 cursor-not-allowed",
            !isOpen && !error && !disabled && "hover:border-gray-200"
          )}
        >
          <span
            className={cn(
              "text-[14px] truncate",
              selectedOption ? "text-[#2D3142] font-medium" : "text-[#9EB1D4]"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-colors",
                isOpen ? "text-[#4D89FF]" : "text-[#9EB1D4]"
              )}
            />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: dropUp ? 8 : -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: dropUp ? 8 : -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute z-50 w-full bg-white rounded-[14px] border border-gray-100 overflow-hidden",
                dropUp
                  ? "bottom-full mb-1 shadow-[0_-12px_48px_-12px_rgba(0,0,0,0.12)]"
                  : "top-full mt-1 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.12)]"
              )}
            >
              {/* Search */}
              {showSearch && (
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9EB1D4]" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Qidirish..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-[36px] pl-9 pr-3 bg-[#F8F9FB] rounded-[10px] text-[13px] outline-none placeholder:text-[#9EB1D4]"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-[240px] overflow-y-auto p-1.5 custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-6 text-[13px] text-[#9EB1D4] text-center">
                    Natija topilmadi
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "w-full px-3 py-2.5 flex items-center justify-between rounded-[10px] text-[14px] transition-all text-left group",
                          isSelected
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-[#F8F9FB] text-[#2D3142]"
                        )}
                      >
                        <span className={cn("truncate", isSelected && "font-medium")}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })
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
