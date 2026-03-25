import { Loader2, Users, Calendar, Clock, CheckCircle2, CircleDot } from "lucide-react";
import { useUpcomingEvents } from "@/hooks/parent/useMeetings";
import type { MothersEvent } from "@/types/meetings.types";

const eventTypeLabels: Record<string, string> = {
  weekly_session: "Haftalik mashg'ulot",
  monthly_training: "Oylik trening",
};

function EventCard({ event }: { event: MothersEvent }) {
  const date = new Date(event.scheduled_date);
  const formattedDate = date.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
            event.event_type === "weekly_session"
              ? "bg-blue-50 text-blue-600"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {eventTypeLabels[event.event_type] || event.event_type}
        </div>
        {event.is_completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <CircleDot className="w-5 h-5 text-amber-400" />
        )}
      </div>

      <h3 className="font-bold text-[#1E293B] text-[15px] mb-2">{event.title}</h3>

      {event.description && (
        <p className="text-[13px] text-[#768093] mb-3 leading-relaxed">{event.description}</p>
      )}

      <div className="flex items-center gap-4 text-[12px] text-[#9EB1D4]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
        {event.scheduled_time && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{event.scheduled_time.slice(0, 5)}</span>
          </div>
        )}
        {event.participants.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{event.participants.length} ishtirokchi</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  const { data: events, isLoading } = useUpcomingEvents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const allEvents = events ?? [];
  const upcoming = allEvents.filter((e) => !e.is_completed);
  const completed = allEvents.filter((e) => e.is_completed);

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6">Yig'ilishlar</h1>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <h2 className="text-[16px] font-bold text-[#1E293B] mb-3">Kelgusi yig'ilishlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <h2 className="text-[16px] font-bold text-[#1E293B] mb-3">O'tgan yig'ilishlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {allEvents.length === 0 && (
        <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-bold text-[15px]">Hali yig'ilishlar yo'q</p>
          <p className="text-[#9EB1D4] text-[13px] mt-1">
            Yangi yig'ilishlar rejalashtirilganda bu yerda ko'rinadi
          </p>
        </div>
      )}
    </div>
  );
}
