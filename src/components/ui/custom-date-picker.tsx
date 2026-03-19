import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = "Sana tanlang",
  label,
  error,
  disabled = false,
  className,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewState, setViewState] = React.useState<'year' | 'month' | 'day'>('day');
  const [viewDate, setViewDate] = React.useState(value ? new Date(value) : new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset view state when opening
  React.useEffect(() => {
    if (isOpen) {
      setViewState(value ? 'day' : 'year');
    }
  }, [isOpen, value]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const formattedDate = newDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];

  const daysHeader = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

  const renderDays = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate?.getDate() === d && 
                         selectedDate?.getMonth() === viewDate.getMonth() && 
                         selectedDate?.getFullYear() === viewDate.getFullYear();
      const isToday = new Date().getDate() === d && 
                      new Date().getMonth() === viewDate.getMonth() && 
                      new Date().getFullYear() === viewDate.getFullYear();

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={cn(
            "h-9 w-9 flex items-center justify-center rounded-full text-[13px] transition-all hover:bg-[#F0F5FF] hover:text-[#4D89FF]",
            isSelected ? "bg-[#4D89FF] text-white hover:bg-[#4D89FF] hover:text-white font-bold" : "text-[#2D3142]",
            isToday && !isSelected && "border border-[#4D89FF] text-[#4D89FF]"
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 100; y--) {
      years.push(
        <button
          key={y}
          type="button"
          onClick={() => {
            setViewDate(new Date(y, viewDate.getMonth(), 1));
            setViewState('month');
          }}
          className={cn(
            "py-2 rounded-lg text-[14px] transition-all hover:bg-[#F0F5FF] hover:text-[#4D89FF]",
            viewDate.getFullYear() === y ? "bg-[#F0F5FF] text-[#4D89FF] font-bold" : "text-[#2D3142]"
          )}
        >
          {y}
        </button>
      );
    }
    return <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto px-1 custom-scrollbar">{years}</div>;
  };

  const renderMonths = () => {
    return (
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setViewDate(new Date(viewDate.getFullYear(), idx, 1));
              setViewState('day');
            }}
            className={cn(
              "py-3 rounded-xl text-[14px] transition-all hover:bg-[#F0F5FF] hover:text-[#4D89FF]",
              viewDate.getMonth() === idx ? "bg-[#F0F5FF] text-[#4D89FF] font-bold" : "text-[#2D3142]"
            )}
          >
            {month}
          </button>
        ))}
      </div>
    );
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
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full h-[52px] px-4 flex items-center gap-3 rounded-[12px] bg-[#F8F9FB] border border-transparent transition-all duration-200 outline-none",
            isOpen && "bg-white border-[#4D89FF] shadow-[0_0_0_4px_rgba(77,137,255,0.1)]",
            error && "border-red-500 bg-red-50",
            disabled && "opacity-50 cursor-not-allowed",
            !isOpen && !error && "hover:bg-[#F1F3F7]"
          )}
        >
          <CalendarIcon className={cn("w-5 h-5", selectedDate ? "text-[#4D89FF]" : "text-[#9EB1D4]")} />
          <span className={cn(
            "text-[14px]",
            selectedDate ? "text-[#2D3142]" : "text-[#9EB1D4]"
          )}>
            {selectedDate ? selectedDate.toLocaleDateString('uz-UZ') : placeholder}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-50 w-[300px] mt-2 bg-white rounded-[20px] border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <button 
                  type="button" 
                  onClick={() => {
                    if (viewState === 'day') setViewState('month');
                    else if (viewState === 'month') setViewState('year');
                  }}
                  className={cn(
                    "flex flex-col items-start transition-all hover:opacity-70",
                    viewState === 'year' && "pointer-events-none"
                  )}
                >
                  <span className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider leading-none mb-1">
                    {viewState === 'day' ? 'KUNNI TANLAN' : viewState === 'month' ? 'OYNI TANLANG' : 'YILNI TANLANG'}
                  </span>
                  <div className="text-[16px] font-bold text-[#2D3142] flex items-center gap-1">
                    {viewState === 'day' && <span>{months[viewDate.getMonth()]}, </span>}
                    <span>{viewDate.getFullYear()}</span>
                  </div>
                </button>
                
                {viewState === 'day' && (
                  <div className="flex items-center gap-1">
                    <button 
                      type="button" 
                      onClick={handlePrevMonth}
                      className="p-1.5 hover:bg-[#F8F9FB] rounded-full transition-colors text-[#9EB1D4] hover:text-[#2D3142]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextMonth}
                      className="p-1.5 hover:bg-[#F8F9FB] rounded-full transition-colors text-[#9EB1D4] hover:text-[#2D3142]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-h-[250px] flex flex-col justify-center">
                {viewState === 'year' && renderYears()}
                {viewState === 'month' && renderMonths()}
                {viewState === 'day' && (
                  <>
                    <div className="grid grid-cols-7 mb-2">
                      {daysHeader.map(day => (
                        <div key={day} className="h-9 w-9 flex items-center justify-center text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                      {renderDays()}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center px-1">
                <button 
                  type="button"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    onChange(today);
                    setIsOpen(false);
                  }}
                  className="text-[12px] font-bold text-[#4D89FF] hover:underline"
                >
                  Bugungi sana
                </button>
                
                {viewState !== 'year' && (
                  <button 
                    type="button"
                    onClick={() => {
                        if (viewState === 'day') setViewState('month');
                        else if (viewState === 'month') setViewState('year');
                    }}
                    className="text-[12px] font-bold text-[#9EB1D4] hover:text-[#2D3142] transition-colors"
                  >
                    O'zgartirish
                  </button>
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

