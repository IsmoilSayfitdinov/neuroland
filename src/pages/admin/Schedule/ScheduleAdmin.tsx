import { Calendar as CalendarIcon, CalendarDays, Plus } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { TopicCard } from "@/pages/admin/Schedule/components/TopicCard";
import { WeeklySchedule } from "@/pages/admin/Schedule/components/WeeklySchedule";
import { TopicModal } from "@/pages/admin/Schedule/components/TopicModal";
import { SlotModal } from "@/pages/admin/Schedule/components/SlotModal";
import { useScheduleAdminPage } from "@/hooks/admin/useScheduleAdminPage";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";

export default function ScheduleAdmin() {
  const {
    isLoading,
    groupOptions,
    sectionOptions,
    specialistOptions,
    selectedGroupId,
    setSelectedGroupId,
    currentGroupName,
    activeTopic,
    weeklyRows,
    isModalOpen,
    setIsModalOpen,
    isSlotModalOpen,
    setIsSlotModalOpen,
    createTopic,
    deleteSlot,
    deletingSlotId,
  } = useScheduleAdminPage();

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="Guruh bo'yicha reja nazorati" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-[240px] rounded-[10px]" />
          <Skeleton className="h-12 w-[180px] rounded-[10px]" />
        </div>
        <Skeleton className="h-[140px] w-full rounded-[24px]" />
        <Skeleton className="h-[300px] w-full rounded-[24px]" />
      </div>
    );
  }

  const currentTopic = activeTopic
    ? {
        title: (activeTopic as any).title || "—",
        section: "—",
        group: currentGroupName,
        duration: `${(activeTopic as any).start_date || ""} — ${(activeTopic as any).end_date || ""}`,
        themeNumber: 2,
      }
    : {
        title: "Mavzu belgilanmagan",
        section: "—",
        group: currentGroupName,
        duration: "—",
        themeNumber: 2,
      };

  const mid = Math.ceil(weeklyRows.length / 2);
  const week1Rows = weeklyRows.length > 0 ? weeklyRows.slice(0, mid) : [];
  const week2Rows = weeklyRows.length > 0 ? weeklyRows.slice(mid) : [];

  return (
    <div className="mx-auto pb-10 space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#2D3142]">Guruh bo'yicha reja nazorati</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="w-full sm:w-[240px]">
            <CustomSelect
              options={groupOptions}
              value={selectedGroupId?.toString() || ""}
              onChange={(val) => setSelectedGroupId(val ? Number(val) : null)}
              placeholder="Guruh tanlang"
              className="bg-white border-none rounded-[10px] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-[10px] shadow-sm text-[#9EB1D4] text-[14px] font-medium border-none">
              <CalendarIcon className="w-4 h-4" />
              <span>{currentTopic.duration !== "—" ? currentTopic.duration : "Sana tanlanmagan"}</span>
            </button>
            {selectedGroupId && (
              <button
                onClick={() => setIsSlotModalOpen(true)}
                className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Slot qo'shish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Topic Card */}
      <TopicCard topic={currentTopic} onAddTopic={() => setIsModalOpen(true)} />

      {/* Weekly Schedules */}
      {weeklyRows.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Jadval mavjud emas"
          description={selectedGroupId
            ? "Bu guruh uchun hozircha jadval belgilanmagan. \"Slot qo'shish\" tugmasidan foydalaning."
            : "Jadval ko'rish uchun guruh tanlang."}
        />
      ) : (
        <>
          {week1Rows.length > 0 && (
            <WeeklySchedule weekNumber={1} lessons={week1Rows} onDeleteSlot={deleteSlot} deletingSlotId={deletingSlotId} />
          )}
          {week2Rows.length > 0 && (
            <WeeklySchedule weekNumber={2} lessons={week2Rows} onDeleteSlot={deleteSlot} deletingSlotId={deletingSlotId} />
          )}
        </>
      )}

      {/* Topic Modal */}
      <TopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionOptions={sectionOptions}
        groupOptions={groupOptions}
        isLoading={createTopic.isPending}
        onSave={(data) => {
          createTopic.mutate({
            title: data.title,
            category: data.category ? Number(data.category) : null,
          });
        }}
      />

      {/* Slot Modal */}
      <SlotModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        groupId={selectedGroupId}
        specialistOptions={specialistOptions}
      />
    </div>
  );
}
