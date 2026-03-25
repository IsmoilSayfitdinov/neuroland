import { Play, Loader2, Square, RefreshCw, Clock, CheckCircle2, PlayCircle, Circle, CalendarDays } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/session.types";

interface Props {
  apiData?: Session[];
  isLoading?: boolean;
  onRefetch?: () => void;
  onSessionChange?: () => void;
}

function StatusBadge({ session }: { session: Session }) {
  if (session.ended_at) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="w-3 h-3" /> Yakunlangan
      </span>
    );
  }
  if (session.is_started) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 animate-pulse">
        <PlayCircle className="w-3 h-3" /> Davom etmoqda
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
      <Circle className="w-3 h-3" /> Kutilmoqda
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3.5 w-28 bg-gray-200 rounded-md" />
          <div className="h-3 w-20 bg-gray-100 rounded-md" />
        </div>
      </div>
      <div className="h-8 w-24 bg-gray-200 rounded-xl" />
    </div>
  );
}

export default function TodaySchedule({ apiData, isLoading, onRefetch, onSessionChange }: Props) {
  const sessions = apiData ?? [];
  const navigate = useNavigate();

  const { mutate: startSession, isPending: starting, variables: startingId } = useMutation({
    mutationFn: (id: number) => SessionsAPI.start(id),
    onSuccess: (_, id) => {
      onSessionChange?.();
      toast.success("Seans boshlandi!");
      const session = sessions.find((s) => s.id === id);
      if (session?.group) {
        navigate({ to: "/specialist/groups/$groupId", params: { groupId: String(session.group) } });
      }
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const { mutate: endSession, isPending: ending, variables: endingId } = useMutation({
    mutationFn: (id: number) => SessionsAPI.end(id),
    onSuccess: () => {
      onSessionChange?.();
      toast.success("Seans yakunlandi!");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const today = new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#2D3142]">Bugungi Jadval</h3>
            <p className="text-[11px] text-[#9EB1D4] mt-0.5">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[12px] font-bold px-3 py-1 rounded-full",
            sessions.length > 0 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-[#9EB1D4]"
          )}>
            {isLoading ? "..." : `${sessions.length} ta`}
          </span>
          <button
            onClick={() => onRefetch?.()}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[#9EB1D4]", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-200" />
            </div>
            <p className="text-[13px] font-semibold text-[#9EB1D4]">Bugungi seanslar mavjud emas</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isStarted = session.is_started && !session.ended_at;
            const isEnded = !!session.ended_at;
            const isThisStarting = starting && startingId === session.id;
            const isThisEnding = ending && endingId === session.id;

            return (
              <div
                key={session.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all",
                  isStarted
                    ? "bg-blue-50/60 border-blue-100"
                    : isEnded
                    ? "bg-gray-50 border-gray-100"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                )}
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0",
                    isStarted ? "bg-blue-100" : isEnded ? "bg-gray-100" : "bg-[#EEF4FF]"
                  )}>
                    <span className={cn(
                      "text-[15px] font-bold leading-none",
                      isStarted ? "text-blue-600" : isEnded ? "text-gray-400" : "text-[#2563EB]"
                    )}>
                      {session.start_time?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-bold text-[#2D3142] leading-none">
                      {session.group_name || "Individual seans"}
                    </p>
                    <StatusBadge session={session} />
                    {session.topic_title && (
                      <p className="text-[11px] text-[#9EB1D4] truncate max-w-[160px]">{session.topic_title}</p>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {!isEnded && (
                  isStarted ? (
                    <button
                      onClick={() => endSession(session.id)}
                      disabled={ending || starting}
                      className="flex items-center gap-1.5 h-9 px-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[12px] font-bold transition-colors disabled:opacity-60 shrink-0"
                    >
                      {isThisEnding
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Square className="w-3 h-3 fill-current" />}
                      Yakunlash
                    </button>
                  ) : (
                    <button
                      onClick={() => startSession(session.id)}
                      disabled={starting || ending}
                      className="flex items-center gap-1.5 h-9 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-bold transition-colors disabled:opacity-60 shrink-0"
                    >
                      {isThisStarting
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Play className="w-3 h-3 fill-current" />}
                      Boshlash
                    </button>
                  )
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
