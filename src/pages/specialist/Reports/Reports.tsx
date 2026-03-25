import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Calendar, Image, Loader2, Play, Download, X, Trash2 } from "lucide-react";
import { useReports } from "@/hooks/specialist/useReports";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { PageInfoButton } from "@/components/specialist/PageInfo";
function ReportCard({ session }: { session: { id: number; specialist_name: string; group_name: string; topic_title: string; date: string } }) {
  const queryClient = useQueryClient();
  const { data: report } = useQuery({
    queryKey: ["session-report", session.id],
    queryFn: () => SessionsAPI.getReport(session.id).catch(() => null),
  });
  const [showMedia, setShowMedia] = useState(false);

  const { mutate: deleteSession, isPending: deleting } = useMutation({
    mutationFn: () => SessionsAPI.delete(session.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Hisobot o'chirildi");
    },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  const gameName = report?.game_name || "";
  const noteText = report?.notes || "";
  const media = report?.media ?? [];
  const mediaCount = media.length;
  const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

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
        <div className="flex items-center gap-2 shrink-0">
          {mediaCount > 0 && (
            <button
              onClick={() => setShowMedia(!showMedia)}
              className="flex items-center gap-1.5 text-[#4D89FF] hover:text-blue-700 transition-colors"
            >
              <Image className="w-4 h-4" />
              <span className="text-[12px] font-bold">{mediaCount} ta fayl</span>
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Hisobotni o'chirishni tasdiqlaysizmi?")) deleteSession();
            }}
            disabled={deleting}
            className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
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

      {/* Media Gallery */}
      {showMedia && media.length > 0 && (
        <div className="border-t border-gray-100 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Media fayllar</p>
            <button onClick={() => setShowMedia(false)} className="text-[#9EB1D4] hover:text-[#2D3142]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {media.map((m) => (
              <div key={m.id} className="relative group rounded-xl overflow-hidden bg-gray-100">
                {m.media_type === "video" ? (
                  <video src={MEDIA_URL + m.file} controls className="w-full h-[140px] object-cover bg-black" />
                ) : (
                  <img src={MEDIA_URL + m.file} alt="" className="w-full h-[140px] object-cover" />
                )}
                <a
                  href={MEDIA_URL + m.file}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#2D3142]" />
                </a>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-0.5 bg-black/50 text-white text-[10px] font-medium rounded-full flex items-center gap-1">
                    {m.media_type === "video" ? <><Play className="w-2.5 h-2.5" /> Video</> : "Rasm"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-bold text-[#2D3142]">Hisobotlar</h1>
        <PageInfoButton title="Hisobotlar">
          <p>Seans hisobotlarini ko'rish va boshqarish.</p>
          <p><strong>Imkoniyatlar:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Seanslar bo'yicha hisobotlarni ko'rish</li>
            <li>Yangi hisobot yaratish</li>
            <li>Media fayllarni biriktirish</li>
            <li>Hisobotlarni o'chirish</li>
          </ul>
        </PageInfoButton>
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
