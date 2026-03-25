import { useState, useMemo } from "react";
import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "./components/EventCard";
import { EventForm } from "./components/EventForm";
import { useMeetings } from "@/hooks/admin/useMeetings";
import { useGroups } from "@/hooks/admin/useGroups";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";

const eventsInfo = (
  <>
    <p>Bu bo'limda markaz tadbirlarini yaratish va boshqarish mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi tadbir yaratish (sana, vaqt, guruh)</li>
      <li>Tadbirni bajarilgan deb belgilash</li>
      <li>Tadbirlar ro'yxatini ko'rish va o'chirish</li>
    </ul>
  </>
);

export default function EventsAdmin() {
  const [showForm, setShowForm] = useState(false);

  const { useEventsList, useCreateEvent, useDeleteEvent, useMarkComplete } = useMeetings();
  const { data: events, isLoading } = useEventsList();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const markComplete = useMarkComplete();

  const { useGroupsList } = useGroups();
  const { data: groups } = useGroupsList();

  const groupOptions = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => ({ label: g.name, value: g.id.toString() }));
  }, [groups]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Tadbirlar" infoTitle="Tadbirlar bo'limi" infoContent={eventsInfo} />
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-8">
      <PageHeader
        title="Tadbirlar"
        action={
          <Button
            onClick={() => setShowForm(!showForm)}
            className="h-[48px] px-6 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-lg shadow-[#2563EB]/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tadbir qo'shish
          </Button>
        }
      />

      {showForm && (
        <EventForm
          groupOptions={groupOptions}
          isLoading={createEvent.isPending}
          onSave={(data) => {
            createEvent.mutate(data, { onSuccess: () => setShowForm(false) });
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {events?.length === 0 && !showForm && (
        <EmptyState
          icon={CalendarDays}
          title="Tadbirlar mavjud emas"
          description="Hozircha hech qanday tadbir qo'shilmagan. Yangi tadbir yaratish uchun yuqoridagi tugmani bosing."
          action={{
            label: "Tadbir qo'shish",
            onClick: () => setShowForm(true),
            icon: Plus,
          }}
        />
      )}

      <div className="space-y-6">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={(id) => deleteEvent.mutate(id)}
            onMarkComplete={(id) => markComplete.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
}
