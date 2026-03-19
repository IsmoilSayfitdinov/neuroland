import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { useState, useMemo } from "react";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useChildren } from "@/hooks/admin/useChildren";
import { useSessions } from "@/hooks/admin/useSessions";
import { useSkills } from "@/hooks/admin/useSkills";

const EVENT_COLORS = [
  "bg-[#4D89FF]",
  "bg-[#3DB87E]",
  "bg-[#F59E0B]",
  "bg-[#A855F7]",
  "bg-[#EF4444]",
  "bg-[#EC4899]",
  "bg-[#14B8A6]",
  "bg-[#8B5CF6]",
];

const DAYS_OF_WEEK = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];

export default function AdminCalendar() {
  const [specialistId, setSpecialistId] = useState("all");
  const [childId, setChildId] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();

  const { useChildrenList } = useChildren();
  const { data: children } = useChildrenList();

  const { useSessionsList } = useSessions();
  const { data: sessions } = useSessionsList();

  const { useSections } = useSkills();
  const { data: sections } = useSections();

  // Build dynamic event types from sections
  const eventTypes = useMemo(() => {
    if (!sections?.length) return [
      { label: "Mashg'ulot", color: EVENT_COLORS[0] },
    ];
    return sections.map((s, i) => ({
      label: s.name,
      color: EVENT_COLORS[i % EVENT_COLORS.length],
    }));
  }, [sections]);

  const specialistOptions = useMemo(() => {
    if (!specialists) return [{ label: "Barchasi", value: "all" }];
    return [
      { label: "Barchasi", value: "all" },
      ...specialists.map((s) => ({ label: s.fio, value: s.id.toString() })),
    ];
  }, [specialists]);

  const childrenOptions = useMemo(() => {
    if (!children) return [{ label: "Barchasi", value: "all" }];
    return [
      { label: "Barchasi", value: "all" },
      ...children.map((c) => ({ label: c.fio, value: c.id.toString() })),
    ];
  }, [children]);

  // Generate calendar grid for current month
  const calendarCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday-based weekday (0=Mon, 6=Sun)
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    // Filter sessions for this month
    const monthSessions = (sessions || []).filter((s) => {
      const d = new Date(s.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return false;
      if (specialistId !== "all" && String(s.specialist) !== specialistId) return false;
      if (childId !== "all" && String(s.child) !== childId) return false;
      return true;
    });

    const cells: {
      date: number | null;
      isCurrentMonth: boolean;
      events: { text: string; color: string }[];
    }[] = [];

    // Pad start
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ date: null, isCurrentMonth: false, events: [] });
    }

    // Fill days
    for (let d = 1; d <= totalDays; d++) {
      const daySessions = monthSessions.filter((s) => new Date(s.date).getDate() === d);
      cells.push({
        date: d,
        isCurrentMonth: true,
        events: daySessions.map((s, i) => ({
          text: s.group_name || s.topic_title || "Mashg'ulot",
          color: EVENT_COLORS[i % EVENT_COLORS.length],
        })),
      });
    }

    // Pad end to complete grid rows
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        cells.push({ date: null, isCurrentMonth: false, events: [] });
      }
    }

    return cells;
  }, [currentDate, sessions, specialistId, childId]);

  const monthLabel = currentDate.toLocaleString("uz-UZ", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const today = new Date();

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#2D3142] mb-8">Kalendar</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[280px] space-y-6 flex-shrink-0">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-[#6B7A99]" />
              <h3 className="text-[15px] font-bold text-[#2D3142]">Filtrlar</h3>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#6B7A99]">Mutaxassis bo'yicha</label>
                <CustomSelect
                  options={specialistOptions}
                  value={specialistId}
                  onChange={(val) => setSpecialistId(val.toString())}
                  placeholder="Tanlang..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#6B7A99]">Bemor bo'yicha</label>
                <CustomSelect
                  options={childrenOptions}
                  value={childId}
                  onChange={(val) => setChildId(val.toString())}
                  placeholder="Tanlang..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#2D3142] mb-5">Mashq turlari</h3>
            <div className="space-y-4">
              {eventTypes.map((type, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${type.color}`} />
                  <span className="text-[13px] font-medium text-[#6B7A99]">{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Calendar */}
        <div className="flex-1 w-full bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-[10px] bg-[#F8F9FB] flex items-center justify-center text-[#6B7A99] hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-[10px] bg-[#F8F9FB] flex items-center justify-center text-[#6B7A99] hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-[16px] font-bold text-[#2D3142] capitalize">{monthLabel}</h2>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-7 border-b border-gray-50">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="py-4 text-center text-[12px] font-bold text-[#6B7A99]">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 auto-rows-[110px]">
                {calendarCells.map((cell, idx) => {
                  const isRightEdge = (idx + 1) % 7 === 0;
                  const isBottomEdge = idx >= calendarCells.length - 7;
                  const isToday =
                    cell.isCurrentMonth &&
                    cell.date === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  return (
                    <div
                      key={idx}
                      className={`p-2 relative flex flex-col gap-1 transition-colors bg-white hover:bg-[#F8F9FB]
                        ${!isRightEdge ? "border-r border-gray-100" : ""}
                        ${!isBottomEdge ? "border-b border-gray-100" : ""}
                        ${isToday ? "border-[1.5px] border-blue-400 m-[-1.5px] z-10" : ""}
                      `}
                    >
                      {cell.date && (
                        <span
                          className={`text-[13px] font-medium ${
                            !cell.isCurrentMonth
                              ? "text-[#C3CFE1]"
                              : isToday
                              ? "text-blue-500 font-bold"
                              : "text-[#9EB1D4]"
                          }`}
                        >
                          {cell.date}
                        </span>
                      )}
                      <div className="flex flex-col gap-1 mt-0.5 overflow-hidden">
                        {cell.events.slice(0, 2).map((evt, i) => (
                          <div
                            key={i}
                            className={`px-2 py-1 rounded-full text-[10px] font-bold text-white truncate shadow-sm ${evt.color}`}
                            title={evt.text}
                          >
                            {evt.text}
                          </div>
                        ))}
                        {cell.events.length > 2 && (
                          <span className="text-[10px] text-[#9EB1D4] font-bold pl-1">
                            +{cell.events.length - 2} ta
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
