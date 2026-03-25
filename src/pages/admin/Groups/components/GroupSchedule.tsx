import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus, Trash2, Loader2, CalendarDays } from "lucide-react";
import { SessionsAPI } from "@/api/sessions.api";
import { SlotModal } from "@/pages/admin/Schedule/components/SlotModal";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { toast } from "sonner";

const WEEKDAY_KEY: Record<number, string> = {
  1: "dushanba",
  2: "seshanba",
  3: "chorshanba",
  4: "payshanba",
  5: "juma",
};

const DAYS = [
  { label: "Dushanba", key: "dushanba" },
  { label: "Seshanba", key: "seshanba" },
  { label: "Chorshanba", key: "chorshanba" },
  { label: "Payshanba", key: "payshanba" },
  { label: "Juma", key: "juma" },
];

interface Lesson {
  title: string;
  teacher: string;
  slotId: number;
}

interface Row {
  time: string;
  days: Record<string, Lesson | undefined>;
}

interface GroupScheduleProps {
  groupId: number;
}

export function GroupSchedule({ groupId }: GroupScheduleProps) {
  const queryClient = useQueryClient();
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();

  const { data: slots, isLoading } = useQuery({
    queryKey: ["schedule-slots", groupId],
    queryFn: () => SessionsAPI.listSlots({ group: groupId }),
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (id: number) => SessionsAPI.deleteSlot(id),
    onMutate: (id) => setDeletingSlotId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-slots", groupId] });
      toast.success("Jadval uyasi o'chirildi");
    },
    onError: () => toast.error("O'chirishda xatolik"),
    onSettled: () => setDeletingSlotId(null),
  });

  const specialistOptions = useMemo(() => {
    if (!specialists) return [];
    return specialists.map((s) => ({ label: `${s.fio} (${s.specialist_type_title})`, value: s.id.toString() }));
  }, [specialists]);

  // Transform slots into table rows (same format as ScheduleAdmin)
  const weeklyRows: Row[] = useMemo(() => {
    if (!slots) return [];

    const timeMap = new Map<string, Record<string, Lesson>>();

    slots.forEach((slot) => {
      const time = slot.start_time.slice(0, 5);
      const dayKey = WEEKDAY_KEY[slot.weekday];
      if (!dayKey) return;

      if (!timeMap.has(time)) timeMap.set(time, {});
      timeMap.get(time)![dayKey] = {
        title: slot.group_name || slot.session_type,
        teacher: slot.specialist_name,
        slotId: slot.id,
      };
    });

    return Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, days]) => ({ time, days }));
  }, [slots]);

  // Split into 2 weeks
  const mid = Math.ceil(weeklyRows.length / 2);
  const week1 = weeklyRows.length > 0 ? weeklyRows.slice(0, mid) : [];
  const week2 = weeklyRows.length > 0 ? weeklyRows.slice(mid) : [];

  if (isLoading) {
    return (
      <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="h-[200px] bg-gray-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const renderTable = (weekNumber: number, rows: Row[]) => (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 pb-4">
        <h3 className="text-[16px] font-bold text-[#2D3142]">{weekNumber}-hafta jadval</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-gray-50">
              <th className="px-8 py-4 text-[13px] font-bold text-[#9EB1D4]">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />Vaqt</div>
              </th>
              {DAYS.map((day) => (
                <th key={day.key} className="px-6 py-4 text-[13px] font-bold text-[#9EB1D4]">{day.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 border-r border-gray-50">
                  <div className="text-[14px] font-bold text-[#2D3142]">{row.time}</div>
                </td>
                {DAYS.map((day) => {
                  const lesson = row.days[day.key];
                  return (
                    <td key={day.key} className="px-6 py-5 border-r border-gray-50 last:border-r-0">
                      {lesson ? (
                        <div className="flex items-start justify-between gap-2 group/cell">
                          <div className="space-y-1">
                            <div className="text-[13px] font-bold text-[#2D3142]">{lesson.title}</div>
                            <div className="text-[11px] text-[#9EB1D4] font-medium">{lesson.teacher}</div>
                          </div>
                          <button
                            onClick={() => deleteSlotMutation.mutate(lesson.slotId)}
                            disabled={deletingSlotId === lesson.slotId}
                            className="opacity-0 group-hover/cell:opacity-100 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition-all shrink-0"
                          >
                            {deletingSlotId === lesson.slotId
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Trash2 className="w-3 h-3" />}
                          </button>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#2D3142]">Seanslar jadvali</h3>
        <button
          onClick={() => setIsSlotModalOpen(true)}
          className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Slot qo'shish
        </button>
      </div>

      {/* Tables */}
      {weeklyRows.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-dashed border-gray-200 py-16 text-center">
          <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Jadval mavjud emas</p>
          <p className="text-[12px] text-[#C5D0E6] mt-1">"Slot qo'shish" tugmasidan foydalaning</p>
        </div>
      ) : (
        <>
          {week1.length > 0 && renderTable(1, week1)}
          {week2.length > 0 && renderTable(2, week2)}
        </>
      )}

      {/* Slot Modal */}
      <SlotModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        groupId={groupId}
        specialistOptions={specialistOptions}
      />
    </div>
  );
}
