import { CalendarDays, FileText } from "lucide-react";
import { useUpcomingEvents } from "@/hooks/parent/useMeetings";

function ChildAndMotherTask() {
  const { data: events } = useUpcomingEvents();

  const today = new Date();
  const nextEvent = events
    ?.filter((e) => !e.is_completed && new Date(e.scheduled_date) >= today)
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())[0];

  const title       = nextEvent?.title       || "Ona va bola mashg'uloti";
  const description = nextEvent?.description ||
    "Ota-onalar va bolalar birgalikda ishtirok etadigan mashg'ulotlar. Rasm chizish, plastilsin ishlash va musiqa o'yinlari.";

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex">
      {/* Left orange stripe */}
      <div className="w-[6px] shrink-0 bg-[#F97316]" />

      <div className="flex-1 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h2 className="text-[16px] font-bold text-[#222939]">{title}</h2>
          <p className="text-[13px] text-[#768093] leading-relaxed max-w-[480px]">{description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#F97316] text-[#F97316] text-[13px] font-bold hover:bg-orange-50 transition-colors">
            <CalendarDays className="w-4 h-4" />
            Reja qilish
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] text-white text-[13px] font-bold hover:bg-orange-600 transition-colors shadow-sm">
            <FileText className="w-4 h-4" />
            Hisobot yuborish
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChildAndMotherTask;
