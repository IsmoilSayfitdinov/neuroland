import { useState } from "react";
import { CalendarDays, Plus, Clock, Trash2, Loader2, RefreshCw, CheckCircle2, PlayCircle, Circle, Info } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { WeeklySchedule, type Lesson } from "@/pages/admin/Schedule/components/WeeklySchedule";
import { SlotModal, type EditSlotData } from "@/pages/admin/Schedule/components/SlotModal";
import { SessionModal } from "@/pages/admin/Schedule/components/SessionModal";
import { useScheduleAdminPage } from "@/hooks/admin/useScheduleAdminPage";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { cn } from "@/lib/utils";
import { InfoModal } from "@/components/admin/ui/InfoModal";
import type { Session } from "@/types/session.types";

function SessionStatusBadge({ session }: { session: Session }) {
  if (session.ended_at) {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="w-3 h-3" />
        Yakunlangan
      </span>
    );
  }
  if (session.is_started) {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
        <PlayCircle className="w-3 h-3" />
        Jarayonda
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
      <Circle className="w-3 h-3" />
      Boshlanmagan
    </span>
  );
}

const scheduleInfo = (
  <>
    <p>Bu bo'limda guruhlar uchun haftalik jadval va seanslarni boshqarish mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Haftalik jadvalga slot (mashg'ulot vaqti) qo'shish</li>
      <li>Mutaxassis, kun va vaqtni belgilash</li>
      <li>Kunlik seanslarni yaratish va kuzatish</li>
      <li>Seans holatini ko'rish (boshlanmagan, jarayonda, yakunlangan)</li>
    </ul>
  </>
);

export default function ScheduleAdmin() {
  const {
    isLoading,
    isLoadingSessions,
    groupOptions,
    specialistOptions,
    selectedGroupId,
    setSelectedGroupId,
    weeklyRows,
    isSlotModalOpen,
    setIsSlotModalOpen,
    deleteSlot,
    deletingSlotId,
    daySessions,
    selectedDate,
    setSelectedDate,
    isSessionModalOpen,
    setIsSessionModalOpen,
    createSession,
    deleteSession,
    isDeletingSession,
    refetchSessions,
  } = useScheduleAdminPage();

  const [showScheduleInfo, setShowScheduleInfo] = useState(false);
  const [editSlot, setEditSlot] = useState<EditSlotData | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);

  const handleEditSlot = (lesson: Lesson & { start_time: string }) => {
    if (!lesson.slotId) return;
    setEditSlot({
      slotId: lesson.slotId,
      specialist: lesson.specialist ?? 0,
      weekday: lesson.weekday ?? 1,
      start_time: lesson.start_time,
      duration_min: lesson.duration_min ?? 45,
      session_type: lesson.session_type ?? "group",
    });
    setIsSlotModalOpen(true);
  };

  const handleDeleteSession = (id: number) => {
    setDeletingSessionId(id);
    deleteSession(id);
    setTimeout(() => setDeletingSessionId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-[240px] rounded-[10px]" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-[24px]" />
        <Skeleton className="h-[260px] w-full rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-8">
      <div className="flex items-center gap-2.5">
        <h1 className="text-[28px] font-bold text-[#2D3142]">Jadval</h1>
        <button type="button" onClick={() => setShowScheduleInfo(true)} className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
          <Info className="w-4 h-4 text-blue-500" />
        </button>
      </div>
      <InfoModal isOpen={showScheduleInfo} onClose={() => setShowScheduleInfo(false)} title="Jadval">{scheduleInfo}</InfoModal>

      {/* ── Haftalik jadval ── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-[#9EB1D4]" />
            <h2 className="text-[18px] font-bold text-[#2D3142]">Haftalik jadval</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[200px]">
              <CustomSelect
                options={groupOptions}
                value={selectedGroupId?.toString() || ""}
                onChange={(val) => setSelectedGroupId(val ? Number(val) : null)}
                placeholder="Guruh tanlang"
                bgBtnColor="bg-white"
              />
            </div>
            {selectedGroupId && (
              <button
                onClick={() => { setEditSlot(null); setIsSlotModalOpen(true); }}
                className="flex items-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Slot qo'shish
              </button>
            )}
          </div>
        </div>

        {weeklyRows.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Jadval mavjud emas"
            description={selectedGroupId
              ? "Bu guruh uchun hozircha jadval belgilanmagan."
              : "Jadval ko'rish uchun guruh tanlang."}
          />
        ) : (
          <WeeklySchedule
            lessons={weeklyRows}
            onDeleteSlot={deleteSlot}
            onEditSlot={handleEditSlot}
            deletingSlotId={deletingSlotId}
          />
        )}
      </section>

      {/* ── Kunlik seanslar ── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#9EB1D4]" />
            <h2 className="text-[18px] font-bold text-[#2D3142]">Kunlik seanslar</h2>
            <span className="text-[12px] font-bold text-[#9EB1D4] bg-gray-100 px-2.5 py-1 rounded-full">
              {daySessions.length} ta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[180px]">
              <CustomDatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Sana tanlang"
              />
            </div>
            <button
              onClick={() => refetchSessions()}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4 text-[#9EB1D4]", isLoadingSessions && "animate-spin")} />
            </button>
            <button
              onClick={() => setIsSessionModalOpen(true)}
              className="flex items-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Seans qo'shish
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[56px_1fr_1fr_1fr_120px_64px] gap-0 border-b border-gray-100 bg-[#F8F9FB]">
            {["#", "Vaqt", "Guruh", "Mutaxassis", "Holat", ""].map((h, i) => (
              <div key={i} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9EB1D4]">
                {h}
              </div>
            ))}
          </div>

          {isLoadingSessions ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="grid grid-cols-[56px_1fr_1fr_1fr_120px_64px] gap-0 px-0">
                  {[56, 90, 130, 150, 100, 40].map((w, j) => (
                    <div key={j} className="px-4 py-4">
                      <Skeleton className={`h-4 rounded-md`} style={{ width: w }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : daySessions.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-[14px] font-bold text-[#9EB1D4]">Bu kunda seanslar yo'q</p>
              <button
                onClick={() => setIsSessionModalOpen(true)}
                className="mt-1 flex items-center gap-2 h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Seans qo'shish
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {daySessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="grid grid-cols-[56px_1fr_1fr_1fr_120px_64px] gap-0 hover:bg-[#F8F9FB] transition-colors group"
                >
                  {/* # */}
                  <div className="px-4 py-3.5 flex items-center">
                    <span className="text-[12px] font-bold text-[#C8D5E8]">{idx + 1}</span>
                  </div>

                  {/* Vaqt */}
                  <div className="px-4 py-3.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span className="text-[14px] font-bold text-[#2D3142]">
                      {session.start_time.slice(0, 5)}
                    </span>
                  </div>

                  {/* Guruh */}
                  <div className="px-4 py-3.5 flex items-center">
                    {session.group_name ? (
                      <span className="text-[13px] font-semibold text-[#2D3142] truncate">
                        {session.group_name}
                      </span>
                    ) : (
                      <span className="text-[13px] text-[#C8D5E8]">—</span>
                    )}
                  </div>

                  {/* Mutaxassis */}
                  <div className="px-4 py-3.5 flex items-center">
                    {session.specialist_name ? (
                      <span className="text-[13px] text-[#5A6484] truncate">
                        {session.specialist_name}
                      </span>
                    ) : (
                      <span className="text-[13px] text-[#C8D5E8]">—</span>
                    )}
                  </div>

                  {/* Holat */}
                  <div className="px-4 py-3.5 flex items-center">
                    <SessionStatusBadge session={session} />
                  </div>

                  {/* Actions */}
                  <div className="px-2 py-3.5 flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      disabled={isDeletingSession && deletingSessionId === session.id}
                      className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[#C8D5E8] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100"
                    >
                      {isDeletingSession && deletingSessionId === session.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Slot Modal */}
      <SlotModal
        isOpen={isSlotModalOpen}
        onClose={() => { setIsSlotModalOpen(false); setEditSlot(null); }}
        groupId={selectedGroupId}
        specialistOptions={specialistOptions}
        editSlot={editSlot}
      />

      {/* Session Modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSubmit={(data) => createSession.mutate(data)}
        isPending={createSession.isPending}
        groupOptions={groupOptions}
        specialistOptions={specialistOptions}
        defaultGroupId={selectedGroupId}
      />
    </div>
  );
}
