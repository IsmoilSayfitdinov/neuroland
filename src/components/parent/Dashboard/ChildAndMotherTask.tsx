import { CalendarDays, Clock } from "lucide-react";
import { useUpcomingEvents } from "@/hooks/parent/useMeetings";

function ChildAndMotherTask() {
  const { data: events } = useUpcomingEvents();

  const today = new Date();
  const upcomingEvents = events
    ?.filter((e) => !e.is_completed && new Date(e.scheduled_date) >= today)
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()) ?? [];

  const nextEvent = upcomingEvents[0];

  if (!nextEvent) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
  };

  const eventTypeLabel = nextEvent.event_type === "weekly_session"
    ? "Haftalik mashg'ulot"
    : "Oylik trening";

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex">
      <div className="w-[6px] shrink-0 bg-[#F97316]" />

      <div className="flex-1 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#222939]">{nextEvent.title}</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-[#F97316] rounded-full">
              {eventTypeLabel}
            </span>
          </div>
          <p className="text-[13px] text-[#768093] leading-relaxed max-w-[480px]">
            {nextEvent.description || "Ota-onalar va bolalar birgalikda ishtirok etadigan mashg'ulot"}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[13px] text-[#768093]">
            <CalendarDays className="w-4 h-4 text-[#F97316]" />
            <span className="font-medium">{formatDate(nextEvent.scheduled_date)}</span>
          </div>
          {nextEvent.scheduled_time && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#768093]">
              <Clock className="w-4 h-4 text-[#F97316]" />
              <span className="font-medium">{nextEvent.scheduled_time.slice(0, 5)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChildAndMotherTask;
