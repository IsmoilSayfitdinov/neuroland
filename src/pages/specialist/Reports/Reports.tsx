import { useNavigate } from "@tanstack/react-router";
import { Plus, Calendar, Image, Loader2 } from "lucide-react";
import { useReports } from "@/hooks/specialist/useReports";
import { useQuery } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { formatDate } from "@/lib/utils";
import type { SessionReport } from "@/types/session.types";

function ReportCard({ session }: { session: { id: number; specialist_name: string; group_name: string; topic_title: string; date: string } }) {
  const { data: report } = useQuery({
    queryKey: ["session-report", session.id],
    queryFn: () => SessionsAPI.getReport(session.id).catch(() => null),
  });

  const gameName = report?.game_name || "";
  const noteText = report?.notes || "";
  const mediaCount = report?.media?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 space-y-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[15px] font-bold text-[#2D3142]">
            {session.specialist_name || session.group_name || "—"}
          </span>
          {session.topic_title && (
            <span className="px-2.5 py-0.5 bg-[#EEF4FF] text-[#4D89FF] text-[12px] font-bold rounded-full">
              {session.topic_title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[#9EB1D4] shrink-0">
          <Image className="w-4 h-4" />
          <span className="text-[12px] font-bold">{mediaCount}</span>
        </div>
      </div>

      {/* Date + game */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#9EB1D4]">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(session.date)}</span>
        {gameName && (
          <>
            <span>·</span>
            <span>{gameName}</span>
          </>
        )}
      </div>

      {/* Notes */}
      {noteText && (
        <p className="text-[13px] text-[#5A6484] leading-relaxed border-t border-gray-50 pt-3">
          {noteText}
        </p>
      )}
    </div>
  );
}

export default function Reports() {
  const navigate = useNavigate();
  const { useReportsList } = useReports();
  const { data: sessions, isLoading } = useReportsList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2D3142]">Hisobotlar</h1>
        <button
          onClick={() => navigate({ to: "/specialist/reports/create" })}
          className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-[12px] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi hisobot
        </button>
      </div>

      {/* List */}
      {!sessions?.length ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-[#9EB1D4] font-medium">Hisobotlar mavjud emas</p>
          <button
            onClick={() => navigate({ to: "/specialist/reports/create" })}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-[10px]"
          >
            <Plus className="w-4 h-4" />
            Hisobot yozish
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <ReportCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
