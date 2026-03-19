import { useQuery } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ScheduleSlot } from "@/types/session.types";

const DAYS: { key: number; label: string }[] = [
  { key: 1, label: "Dushanba" },
  { key: 2, label: "Seshanba" },
  { key: 3, label: "Chorshanba" },
  { key: 4, label: "Payshanba" },
  { key: 5, label: "Juma" },
  { key: 6, label: "Shanba" },
  { key: 7, label: "Yakshanba" },
];

const typeStyles: Record<string, { cell: string; dot: string; label: string }> = {
  group:       { cell: "bg-blue-50 border-blue-100 text-blue-700",   dot: "bg-blue-500",   label: "Guruh" },
  mini_group:  { cell: "bg-teal-50 border-teal-100 text-teal-700",   dot: "bg-teal-500",   label: "Mini guruh" },
  individual:  { cell: "bg-purple-50 border-purple-100 text-purple-700", dot: "bg-purple-500", label: "Individual" },
};

function formatTime(t: string) {
  return t.slice(0, 5);
}

interface Props {
  groupId: number;
  label: string;
}

export default function WeeklySchedule({ groupId, label }: Props) {
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["schedule-slots", groupId],
    queryFn: () => SessionsAPI.listSlots({ group: groupId }),
    enabled: !!groupId,
  });

  // Collect unique times sorted
  const times = [...new Set(slots.map((s) => s.start_time))].sort();

  // Active days only (days that have at least one slot)
  const activeDays = DAYS.filter((d) => slots.some((s) => s.weekday === d.key));

  const getSlot = (day: number, time: string): ScheduleSlot | undefined =>
    slots.find((s) => s.weekday === day && s.start_time === time);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 pb-0">
        <h3 className="text-[16px] font-bold text-[#2D3142] mb-4">{label}</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : slots.length === 0 ? (
        <div className="py-10 text-center text-[#9EB1D4] text-[13px] font-medium">
          Jadval mavjud emas
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="w-16 text-[11px] text-[#9EB1D4] font-medium py-3 px-4 text-left">Vaqt</th>
                {activeDays.map((d) => (
                  <th key={d.key} className="text-[12px] font-bold text-[#2D3142] py-3 px-3 text-left">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time} className="border-b border-gray-50 last:border-0">
                  <td className="text-[11px] text-[#9EB1D4] font-medium px-4 py-3 whitespace-nowrap">
                    {formatTime(time)}
                  </td>
                  {activeDays.map((d) => {
                    const slot = getSlot(d.key, time);
                    const style = slot ? typeStyles[slot.session_type] ?? typeStyles.group : null;
                    return (
                      <td key={d.key} className="px-3 py-2 min-w-[120px]">
                        {slot && style ? (
                          <div
                            className={cn(
                              "rounded-xl border px-3 py-2 text-[11px] font-semibold leading-snug",
                              style.cell
                            )}
                          >
                            <div className="font-bold truncate">{slot.specialist_name}</div>
                            <div className="opacity-70 mt-0.5">{style.label}</div>
                          </div>
                        ) : (
                          <div className="h-12 rounded-xl border border-gray-50 bg-[#FDFDFD]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      {slots.length > 0 && (
        <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-50">
          {Object.entries(typeStyles).map(([key, s]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", s.dot)} />
              <span className="text-[10px] text-[#9EB1D4] font-bold uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
