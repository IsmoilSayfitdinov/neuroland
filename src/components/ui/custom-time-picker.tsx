import * as React from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomTimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomTimePicker({
  value,
  onChange,
  placeholder = "Vaqt tanlang",
  label,
  error,
  disabled = false,
  className,
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  const [hour, setHour] = React.useState(() => {
    if (value) return parseInt(value.split(":")[0], 10);
    return 9;
  });
  const [minute, setMinute] = React.useState(() => {
    if (value) return parseInt(value.split(":")[1], 10);
    return 0;
  });

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const applyTime = (h: number, m: number) => {
    onChange(`${pad(h)}:${pad(m)}`);
  };

  const incrementHour = () => {
    const next = (hour + 1) % 24;
    setHour(next);
    applyTime(next, minute);
  };

  const decrementHour = () => {
    const next = (hour - 1 + 24) % 24;
    setHour(next);
    applyTime(next, minute);
  };

  const incrementMinute = () => {
    const next = (minute + 5) % 60;
    setMinute(next);
    applyTime(hour, next);
  };

  const decrementMinute = () => {
    const next = (minute - 5 + 60) % 60;
    setMinute(next);
    applyTime(hour, next);
  };

  const quickTimes = [
    { label: "09:00", h: 9, m: 0 },
    { label: "10:00", h: 10, m: 0 },
    { label: "12:00", h: 12, m: 0 },
    { label: "14:00", h: 14, m: 0 },
    { label: "16:00", h: 16, m: 0 },
    { label: "18:00", h: 18, m: 0 },
  ];

  const displayValue = value || "";

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
            "w-full h-[48px] px-4 flex items-center gap-3 rounded-[12px] bg-[#F8F9FB] border border-transparent transition-all duration-200 outline-none",
            isOpen && "bg-white border-[#4D89FF] shadow-[0_0_0_3px_rgba(77,137,255,0.08)]",
            error && "border-red-400 bg-red-50/50",
            disabled && "opacity-50 cursor-not-allowed",
            !isOpen && !error && !disabled && "hover:border-gray-200"
          )}
        >
          <Clock className={cn("w-4.5 h-4.5", displayValue ? "text-[#4D89FF]" : "text-[#9EB1D4]")} />
          <span className={cn(
            "text-[14px]",
            displayValue ? "text-[#2D3142] font-medium" : "text-[#9EB1D4]"
          )}>
            {displayValue || placeholder}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-[280px] mt-1 bg-white rounded-[18px] border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] p-5"
            >
              {/* Spinner */}
              <div className="flex items-center justify-center gap-3 mb-5">
                {/* Hour */}
                <div className="flex flex-col items-center" ref={hourRef}>
                  <button
                    type="button"
                    onClick={incrementHour}
                    className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F5FF] text-[#9EB1D4] hover:text-[#4D89FF] transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div className="w-[72px] h-[56px] bg-[#F8F9FB] rounded-[14px] flex items-center justify-center text-[28px] font-bold text-[#2D3142] select-none">
                    {pad(hour)}
                  </div>
                  <button
                    type="button"
                    onClick={decrementHour}
                    className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F5FF] text-[#9EB1D4] hover:text-[#4D89FF] transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-semibold text-[#9EB1D4] uppercase mt-1">Soat</span>
                </div>

                {/* Separator */}
                <div className="flex flex-col items-center gap-1.5 pb-5">
                  <div className="w-2 h-2 bg-[#2D3142] rounded-full" />
                  <div className="w-2 h-2 bg-[#2D3142] rounded-full" />
                </div>

                {/* Minute */}
                <div className="flex flex-col items-center" ref={minuteRef}>
                  <button
                    type="button"
                    onClick={incrementMinute}
                    className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F5FF] text-[#9EB1D4] hover:text-[#4D89FF] transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div className="w-[72px] h-[56px] bg-[#F8F9FB] rounded-[14px] flex items-center justify-center text-[28px] font-bold text-[#2D3142] select-none">
                    {pad(minute)}
                  </div>
                  <button
                    type="button"
                    onClick={decrementMinute}
                    className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F5FF] text-[#9EB1D4] hover:text-[#4D89FF] transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-semibold text-[#9EB1D4] uppercase mt-1">Daqiqa</span>
                </div>
              </div>

              {/* Quick times */}
              <div className="grid grid-cols-3 gap-1.5 mb-4">
                {quickTimes.map((qt) => {
                  const isActive = hour === qt.h && minute === qt.m;
                  return (
                    <button
                      key={qt.label}
                      type="button"
                      onClick={() => {
                        setHour(qt.h);
                        setMinute(qt.m);
                        applyTime(qt.h, qt.m);
                      }}
                      className={cn(
                        "py-2 rounded-[10px] text-[13px] font-medium transition-all",
                        isActive
                          ? "bg-blue-500 text-white shadow-sm"
                          : "bg-[#F8F9FB] text-[#2D3142] hover:bg-[#F0F5FF] hover:text-[#4D89FF]"
                      )}
                    >
                      {qt.label}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const h = now.getHours();
                    const m = now.getMinutes();
                    setHour(h);
                    setMinute(m);
                    applyTime(h, m);
                  }}
                  className="text-[12px] font-bold text-[#4D89FF] hover:underline"
                >
                  Hozirgi vaqt
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-[34px] px-5 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-[10px] transition-colors"
                >
                  Tayyor
                </button>
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
