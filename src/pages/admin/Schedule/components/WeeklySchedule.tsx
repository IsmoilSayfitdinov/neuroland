import { Clock, Trash2, Loader2, Pencil } from "lucide-react";

export interface Lesson {
  title: string;
  teacher: string;
  slotId?: number;
  specialist?: number;
  weekday?: number;
  session_type?: string;
  duration_min?: number;
}

interface Row {
  time: string;
  days: {
    dushanba?: Lesson;
    seshanba?: Lesson;
    chorshanba?: Lesson;
    payshanba?: Lesson;
    juma?: Lesson;
  };
}

interface WeeklyScheduleProps {
  lessons: Row[];
  onDeleteSlot?: (slotId: number) => void;
  onEditSlot?: (lesson: Lesson & { start_time: string }) => void;
  deletingSlotId?: number | null;
}

const WEEKDAY_KEY = {
  0: "dushanba",
  1: "seshanba",
  2: "chorshanba",
  3: "payshanba",
  4: "juma",
  5: "shanba",
} as const;

export function WeeklySchedule({ lessons, onDeleteSlot, onEditSlot, deletingSlotId }: WeeklyScheduleProps) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 pb-4">
        <h3 className="text-[16px] font-bold text-[#2D3142]">Jadval</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-gray-50">
              <th className="px-8 py-4 text-[13px] font-bold text-[#9EB1D4]">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />Vaqt</div>
              </th>
              {Object.values(WEEKDAY_KEY).map((day) => (
                <th key={day} className="px-6 py-4 text-[13px] font-bold text-[#9EB1D4]">{day.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lessons.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 border-r border-gray-50">
                  <div className="text-[14px] font-bold text-[#2D3142]">{row.time}</div>
                </td>
                {Object.values(WEEKDAY_KEY).map((day) => {
                  const lesson = (row.days as any)[day] as Lesson | undefined;
                  return (
                    <td key={day} className="px-6 py-5 border-r border-gray-50 last:border-r-0">
                      {lesson ? (
                        <div className="flex items-start justify-between gap-2 group/cell">
                          <div className="space-y-1">
                            <div className="text-[13px] font-bold text-[#2D3142]">{lesson.title}</div>
                            <div className="text-[11px] text-[#9EB1D4] font-medium">{lesson.teacher}</div>
                          </div>
                          {lesson.slotId && (
                            <div className="opacity-0 group-hover/cell:opacity-100 flex items-center gap-1 transition-all shrink-0">
                              {onEditSlot && (
                                <button
                                  onClick={() => onEditSlot({ ...lesson, start_time: row.time })}
                                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-400 transition-colors"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                              {onDeleteSlot && (
                                <button
                                  onClick={() => onDeleteSlot(lesson.slotId!)}
                                  disabled={deletingSlotId === lesson.slotId}
                                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition-colors"
                                >
                                  {deletingSlotId === lesson.slotId
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : <Trash2 className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[13px] text-gray-200">Bo'sh</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
