import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGroupDetailPage } from "@/hooks/specialist/useGroupDetailPage";
import GroupStudentCard from "@/components/specialist/Groups/GroupStudentCard";
import GroupAnalyticsSidebar from "@/components/specialist/Groups/GroupAnalyticsSidebar";
import {
  ChevronLeft, Loader2, CalendarDays, ClipboardList,
  PlayCircle, Square, Clock, CheckCircle2, FileText,
  BookOpen, ArrowRight, BookCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";

/* ── Live elapsed timer ── */
function useElapsedTime(startedAt: string | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) { setElapsed(0); return; }
    const update = () => setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

const DAYS: Record<number, string> = {
  1: "Dushanba", 2: "Seshanba", 3: "Chorshanba",
  4: "Payshanba", 5: "Juma", 6: "Shanba", 7: "Yakshanba",
};

const typeStyles: Record<string, { cell: string; dot: string; label: string }> = {
  group:      { cell: "bg-blue-50 border-blue-100 text-blue-700",      dot: "bg-blue-500",   label: "Guruh" },
  mini_group: { cell: "bg-teal-50 border-teal-100 text-teal-700",      dot: "bg-teal-500",   label: "Mini guruh" },
  individual: { cell: "bg-purple-50 border-purple-100 text-purple-700", dot: "bg-purple-500", label: "Individual" },
};

type AttendStatus = "keldi" | "kelmadi" | "kechikdi";

export default function GroupDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { group, groupAnalytics, mySlots, isLoading, groupId } = useGroupDetailPage();

  const [attendMode, setAttendMode] = useState(false);
  const [attendance, setAttendance] = useState<Record<number, AttendStatus>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  /* ── Today's sessions ── */
  const { data: todaySessions, refetch: refetchToday } = useQuery({
    queryKey: ["sessions-today"],
    queryFn: () => SessionsAPI.getToday(),
    refetchInterval: 30_000,
  });

  const activeSession = todaySessions?.find(
    (s) => s.group === groupId && s.is_started && !s.ended_at
  ) ?? null;

  const endedSession = todaySessions?.find(
    (s) => s.group === groupId && !!s.ended_at
  ) ?? null;

  const todaySession = activeSession ?? endedSession ?? null;

  const elapsed = useElapsedTime(activeSession?.started_at ?? null);

  /* ── End session ── */
  const { mutate: endActiveSession, isPending: endingActive } = useMutation({
    mutationFn: (id: number) => SessionsAPI.end(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      refetchToday();
      toast.success("Seans yakunlandi!");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  /* ── Save attendance ── */
  const { mutate: saveAttendance, isPending: saving } = useMutation({
    mutationFn: async () => {
      let sessionId = todaySession?.id;
      if (!sessionId) {
        const now = new Date();
        const session = await SessionsAPI.create({
          group: groupId,
          date: now.toISOString().split("T")[0],
          start_time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
        });
        sessionId = session.id;
      }
      const entries = (group?.children ?? []).map((c) => ({
        child: c.id,
        is_present: attendance[c.id] !== "kelmadi",
      }));
      return SessionsAPI.markAttendance(sessionId, entries);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Davomat saqlandi!");
      setAttendanceSaved(true);
      setAttendMode(false);
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || err?.message || "Xatolik yuz berdi"),
  });

  const setStatus = (childId: number, status: AttendStatus) =>
    setAttendance((prev) => ({ ...prev, [childId]: status }));

  /* ── Loading / not found ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }
  if (!group) {
    return <div className="py-20 text-center text-[#9EB1D4]">Guruh topilmadi</div>;
  }

  const slots = mySlots;
  const times = [...new Set(slots.map((s) => s.start_time))].sort();
  const activeDays = Object.entries(DAYS)
    .filter(([key]) => slots.some((s) => s.weekday === Number(key)))
    .map(([key, label]) => ({ key: Number(key), label }));

  /* ══════════════════════════════════════════
     ATTENDANCE MODE
  ══════════════════════════════════════════ */
  if (attendMode) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAttendMode(false)}
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
            </button>
            <div>
              <h1 className="text-[22px] font-bold text-[#2D3142]">{group.name} — Davomat</h1>
              {activeSession && (
                <p className="text-[12px] text-[#9EB1D4] mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                  Seans davom etmoqda · {elapsed}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => saveAttendance()}
            disabled={saving}
            className="h-10 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Saqlash
          </button>
        </div>

        {/* Child cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {group.children?.map((child) => {
            const status = attendance[child.id] ?? "keldi";
            const initials = child.fio.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={child.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {child.photo ? (
                    <img
                      src={import.meta.env.VITE_API_MEDIA_URL + child.photo}
                      alt={child.fio}
                      className="w-11 h-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#2D3142] text-[13px] truncate">{child.fio}</h4>
                    <span className={cn(
                      "mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full",
                      status === "keldi"    ? "bg-emerald-50 text-emerald-600" :
                      status === "kechikdi" ? "bg-amber-50 text-amber-600" :
                                             "bg-red-50 text-red-500"
                    )}>
                      {status === "keldi" ? "Keldi" : status === "kechikdi" ? "Kechikdi" : "Kelmadi"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {(["keldi", "kelmadi", "kechikdi"] as AttendStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(child.id, s)}
                      className={cn(
                        "flex-1 h-8 rounded-lg text-[11px] font-bold transition-all",
                        status === s
                          ? s === "keldi"    ? "bg-blue-600 text-white"
                          : s === "kelmadi"  ? "bg-red-500 text-white"
                          :                   "bg-amber-400 text-white"
                          : "bg-gray-100 text-[#9EB1D4] hover:bg-gray-200"
                      )}
                    >
                      {s === "keldi" ? "Keldi" : s === "kelmadi" ? "Kelmadi" : "Kechikdi"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom action - End session after saving attendance */}
        {activeSession && attendanceSaved && (
          <div className="sticky bottom-4">
            <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg shadow-blue-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-[13px] font-bold text-white">Davomat saqlandi</p>
                  <p className="text-[11px] text-blue-200">Endi seansni yakunlashingiz mumkin</p>
                </div>
              </div>
              <button
                onClick={() => endActiveSession(activeSession.id)}
                disabled={endingActive}
                className="flex items-center gap-2 h-10 px-5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-[13px] font-bold transition-colors disabled:opacity-60"
              >
                {endingActive
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Square className="w-3.5 h-3.5 fill-current" />}
                Yakunlash
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     DEFAULT MODE
  ══════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── ACTIVE SESSION BANNER ── */}
      {activeSession && (
        <div className="bg-blue-600 rounded-2xl shadow-md shadow-blue-200 overflow-hidden">
          {/* Top row — timer */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Seans davom etmoqda</p>
                <p className="text-[13px] font-semibold text-white">
                  Boshlangan: {activeSession.start_time.slice(0, 5)}
                  {activeSession.started_at && (
                    <span className="text-blue-200 ml-2 text-[12px]">
                      · {new Date(activeSession.started_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })} dan
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-[22px] font-bold text-white tabular-nums tracking-wider">{elapsed}</span>
            </div>
          </div>

          {/* Steps row */}
          <div className="flex items-center px-5 py-3 gap-2">

            {/* Step 1 — Boshlandi */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[12px] font-bold text-white">Boshlandi</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-blue-300 mx-1" />

            {/* Step 2 — Davomat */}
            <button
              onClick={() => setAttendMode(true)}
              className={cn(
                "flex items-center gap-2 h-8 px-3 rounded-xl text-[12px] font-bold transition-colors",
                attendanceSaved
                  ? "bg-white/20 text-white"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              )}
            >
              {attendanceSaved
                ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                : <ClipboardList className="w-3.5 h-3.5" />}
              Davomat
              {attendanceSaved && <span className="text-blue-200">✓</span>}
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-blue-300 mx-1" />

            {/* Step 3 — Yakunlash */}
            <button
              onClick={() => endActiveSession(activeSession.id)}
              disabled={endingActive}
              className={cn(
                "flex items-center gap-2 h-8 px-3 rounded-xl text-[12px] font-bold transition-colors disabled:opacity-60",
                attendanceSaved
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              {endingActive
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Square className="w-3 h-3 fill-current" />}
              Yakunlash
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-blue-300 mx-1" />

            {/* Step 4–5 — greyed out */}
            <span className="text-[12px] text-blue-300 font-medium">Hisobot</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-300 mx-1" />
            <span className="text-[12px] text-blue-300 font-medium">Uy vazifa</span>
          </div>
        </div>
      )}

      {/* ── POST-SESSION PANEL ── */}
      {!activeSession && endedSession && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-emerald-700">Seans yakunlandi</p>
                <p className="text-[11px] text-emerald-500">
                  {endedSession.start_time.slice(0, 5)}
                  {endedSession.ended_at && (
                    <> — {new Date(endedSession.ended_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</>
                  )}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-500 bg-emerald-100 px-3 py-1 rounded-full">
              Bugun
            </span>
          </div>

          {/* Next steps */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <button
              onClick={() => navigate({ to: "/specialist/reports/create" })}
              className="flex flex-col items-center gap-2 py-5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-[12px] font-bold text-[#2D3142]">Hisobot yozish</span>
              <span className="text-[11px] text-[#9EB1D4]">Seans hisoboti</span>
            </button>

            <button
              onClick={() => navigate({ to: "/specialist/groups/$groupId/homework", params: { groupId: String(groupId) } })}
              className="flex flex-col items-center gap-2 py-5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-[12px] font-bold text-[#2D3142]">Uy vazifa berish</span>
              <span className="text-[11px] text-[#9EB1D4]">Bolalarga topshiriq</span>
            </button>

            <button
              onClick={() => navigate({ to: "/specialist/groups/$groupId/homework/review", params: { groupId: String(groupId) } })}
              className="flex flex-col items-center gap-2 py-5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <BookCheck className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-[12px] font-bold text-[#2D3142]">Uy vazifa tekshirish</span>
              <span className="text-[11px] text-[#9EB1D4]">Yuborilgan ishlar</span>
            </button>
          </div>
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/specialist/groups" })}
            className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-[#2D3142]">{group.name}</h1>
            {groupAnalytics?.avg_progress !== undefined && (
              <p className="text-[12px] text-[#9EB1D4] mt-0.5">
                O'rtacha: {groupAnalytics.avg_progress}% · {group.children_count} bola
              </p>
            )}
          </div>
        </div>

        {/* Quick actions — only when no active session */}
        {!activeSession && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAttendMode(true)}
              className="h-10 px-4 bg-white border border-gray-100 hover:bg-gray-50 text-[#2D3142] text-[13px] font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4 text-[#9EB1D4]" />
              Davomat
            </button>
          </div>
        )}
      </div>

      {/* ── STUDENT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {group.children?.map((child) => (
          <GroupStudentCard key={child.id} child={child} />
        ))}
        {(!group.children || group.children.length === 0) && (
          <div className="col-span-full py-10 text-center text-[#9EB1D4] text-[14px] bg-white rounded-2xl border border-dashed border-gray-200">
            Bu guruhda bolalar yo'q
          </div>
        )}
      </div>

      {/* ── WEEKLY SCHEDULE + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-[16px] font-bold text-[#2D3142]">Haftalik jadval</h3>
              {slots.length > 0 && (
                <span className="text-[11px] bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-lg">
                  {slots.length} ta dars
                </span>
              )}
            </div>

            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <CalendarDays className="w-10 h-10 text-gray-200" />
                <p className="text-[13px] text-[#9EB1D4] font-medium">Jadval belgilanmagan</p>
                <p className="text-[11px] text-[#C5D0E6]">Admin tomonidan jadval qo'shiladi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="w-16 text-[11px] text-[#9EB1D4] font-medium py-3 px-4 text-left">Vaqt</th>
                      {activeDays.map((d) => (
                        <th key={d.key} className="text-[12px] font-bold text-[#2D3142] py-3 px-3 text-left">{d.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {times.map((time) => (
                      <tr key={time} className="border-b border-gray-50 last:border-0">
                        <td className="text-[11px] text-[#9EB1D4] font-medium px-4 py-3 whitespace-nowrap">{time.slice(0, 5)}</td>
                        {activeDays.map((d) => {
                          const slot = slots.find((s) => s.weekday === d.key && s.start_time === time);
                          const style = slot ? typeStyles[slot.session_type] ?? typeStyles.group : null;
                          return (
                            <td key={d.key} className="px-3 py-2 min-w-[120px]">
                              {slot && style ? (
                                <div className={cn("rounded-xl border px-3 py-2 text-[11px] font-semibold leading-snug", style.cell)}>
                                  <div className="font-bold truncate">{slot.specialist_name}</div>
                                  <div className="opacity-70 mt-0.5">{style.label} · {slot.duration_min} min</div>
                                </div>
                              ) : (
                                <div className="h-12 rounded-xl border border-gray-50 bg-[#FDFDFD]" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-50">
                  {Object.entries(typeStyles).map(([key, s]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full", s.dot)} />
                      <span className="text-[10px] text-[#9EB1D4] font-bold uppercase tracking-wider">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <GroupAnalyticsSidebar group={group} />
        </div>
      </div>
    </div>
  );
}
