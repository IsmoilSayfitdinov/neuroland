import { Calendar, Users, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MothersEvent } from "@/types/meetings.types";

interface EventCardProps {
  event: MothersEvent;
  onDelete?: (id: number) => void;
  onMarkComplete?: (id: number) => void;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  weekly_session: "Haftalik mashg'ulot",
  monthly_training: "Oylik trening",
};

const TOP_COLORS = ["bg-[#4D89FF]", "bg-[#2D3142]", "bg-[#3DB87E]", "bg-[#F59E0B]", "bg-[#A855F7]"];

export function EventCard({ event, onDelete, onMarkComplete }: EventCardProps) {
  const today = new Date();
  const eventDate = new Date(event.scheduled_date);
  const daysLeft = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const status = event.is_completed ? "completed" : daysLeft <= 3 && daysLeft >= 0 ? "upcoming" : "planned";
  const topColor = TOP_COLORS[event.id % TOP_COLORS.length];

  const getStatusBadge = () => {
    if (status === "completed") {
      return (
        <span className="px-3 py-1 bg-[#E8FFF3] text-[#2ECC71] rounded-[8px] text-[12px] font-bold border border-[#B7F4D1]">
          Tugallangan
        </span>
      );
    }
    if (status === "upcoming") {
      return (
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-[#FFF4E5] text-[#F59E0B] rounded-[8px] text-[12px] font-bold">
            {daysLeft} kun qoldi
          </span>
          <span className="px-3 py-1 bg-[#FFF9E5] text-[#D4A017] rounded-[8px] text-[12px] font-bold border border-[#FFE7A1]">
            Yaqinlashmoqda
          </span>
        </div>
      );
    }
    return (
      <span className="px-3 py-1 bg-[#F5F7FA] text-[#9EB1D4] rounded-[8px] text-[12px] font-bold border border-[#E1E5EE]">
        Rejada
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className={cn("h-[6px] w-full", topColor)} />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="text-[18px] font-bold text-[#2D3142] group-hover:text-[#4D89FF] transition-colors truncate">
              {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-[#9EB1D4] text-[13px] font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{event.scheduled_date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>
                  {event.all_children
                    ? "Barcha bolalar"
                    : event.groups?.length
                    ? `${event.groups.length} ta guruh`
                    : "Guruh belgilanmagan"}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#F0F5FF] text-[#4D89FF] rounded-full text-[11px] font-bold">
                {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {getStatusBadge()}
            {!event.is_completed && onMarkComplete && (
              <button
                onClick={() => onMarkComplete(event.id)}
                className="p-2 text-[#3DB87E] hover:bg-[#E8FFF3] rounded-lg transition-colors"
                title="Tugallandi deb belgilash"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                title="O'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {event.description && (
          <p className="text-[14px] text-[#6B7A99] leading-relaxed font-medium line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
